/**
 * Static shim for @workspace/object-storage-web
 * Upload is disabled without a backend — returns a no-op.
 */

export function useUpload(opts?: {
  onSuccess?: (response: { objectPath: string }) => void;
  onError?: (error: Error) => void;
}) {
  return {
    uploadFile: async (_file: File) => {
      opts?.onError?.(new Error("Uploads are disabled in static mode."));
    },
    isUploading: false,
  };
}
