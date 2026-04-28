/**
 * Unit tests for ObjectStorageService.downloadObject
 *
 * Validates:
 *  1. Successful streaming — a known buffer piped through pipeline → PassThrough
 *     → Readable.toWeb → Response.body can be consumed and matches the source.
 *  2. Error propagation — a mid-stream error on the GCS file's readable destroys
 *     the pipeline and surfaces the error through the WHATWG ReadableStream.
 *  3. Metadata guard — missing contentType falls back to application/octet-stream.
 *  4. Empty stream — verifies a zero-byte file produces an empty Response body.
 */

import { Readable } from "stream";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@google-cloud/storage", () => ({
  Storage: jest.fn().mockImplementation(() => ({
    bucket: jest.fn().mockReturnValue({
      file: jest.fn(),
    }),
  })),
  File: jest.fn(),
}));

jest.mock("../src/lib/objectAcl", () => ({
  getObjectAclPolicy: jest
    .fn()
    .mockResolvedValue({ visibility: "public" }),
  setObjectAclPolicy: jest.fn(),
  canAccessObject: jest.fn(),
  ObjectPermission: { READ: "READ", WRITE: "WRITE" },
}));

// Import after mocks are registered (Jest hoists jest.mock calls automatically)
import { ObjectStorageService } from "../src/lib/objectStorage";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Creates a mock GCS File that satisfies the two methods downloadObject uses:
 *   - getMetadata()      → resolves to [metadata]
 *   - createReadStream() → returns a Node Readable
 */
function createMockFile(opts: {
  metadata?: Record<string, unknown>;
  streamData?: Buffer;
  /** When set, the stream will push partial data then destroy with this error */
  streamError?: Error;
}): any {
  const {
    metadata = {},
    streamData,
    streamError,
  } = opts;

  return {
    getMetadata: jest.fn().mockResolvedValue([metadata]),
    createReadStream: jest.fn(() => {
      let pushed = false;
      const readable = new Readable({
        read() {
          if (pushed) return;
          pushed = true;

          if (streamError) {
            this.push(Buffer.from("partial"));
            process.nextTick(() => this.destroy(streamError));
          } else if (streamData) {
            this.push(streamData);
            this.push(null);
          } else {
            this.push(null);
          }
        },
      });
      return readable;
    }),
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("ObjectStorageService.downloadObject", () => {
  let service: ObjectStorageService;

  beforeEach(() => {
    service = new ObjectStorageService();
  });

  it("streams file data end-to-end and returns a valid Response with correct headers", async () => {
    const payload = Buffer.from("Hello, robust streaming world! 🚀");
    const mockFile = createMockFile({
      metadata: {
        contentType: "text/plain",
        size: payload.length,
      },
      streamData: payload,
    });

    const response = await service.downloadObject(mockFile, 7200);

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(response.headers.get("Content-Length")).toBe(String(payload.length));
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=7200");

    const body = Buffer.from(await response.arrayBuffer());
    expect(body).toEqual(payload);
  });

  it("propagates a mid-stream error through the web ReadableStream", async () => {
    const diskError = new Error("simulated disk read failure");
    const mockFile = createMockFile({
      metadata: { contentType: "application/octet-stream" },
      streamError: diskError,
    });

    const response = await service.downloadObject(mockFile);
    expect(response).toBeInstanceOf(Response);

    await expect(response.arrayBuffer()).rejects.toBeDefined();
  });

  it("falls back to application/octet-stream when metadata lacks contentType", async () => {
    const payload = Buffer.from("binary blob");
    const mockFile = createMockFile({
      metadata: { size: payload.length },
      streamData: payload,
    });

    const response = await service.downloadObject(mockFile);
    expect(response.headers.get("Content-Type")).toBe("application/octet-stream");

    const body = Buffer.from(await response.arrayBuffer());
    expect(body).toEqual(payload);
  });

  it("handles empty streams gracefully", async () => {
    const mockFile = createMockFile({ metadata: {} });
    const response = await service.downloadObject(mockFile);

    expect(response).toBeInstanceOf(Response);
    const body = Buffer.from(await response.arrayBuffer());
    expect(body.length).toBe(0);
  });
});
