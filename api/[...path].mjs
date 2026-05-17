import app from "../artifacts/api-server/dist/vercel.mjs";

export default function handler(req, res) {
  req.url = req.url?.replace(/^\/api(?:\/|$)/, "/") ?? "/";
  return app(req, res);
}
