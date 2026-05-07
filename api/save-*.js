import { Octokit } from "octokit";

export default async function handler(req, res) {
  const { content } = req.body;

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const file = req.url.replace("/api/save-", "").replace(".js", "") + ".json";

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: "alykay1522",
    repo: "Dine-Details",
    path: `data/${file}`,
    message: "Admin update",
    content: Buffer.from(content).toString("base64")
  });

  res.status(200).json({ success: true });
}
