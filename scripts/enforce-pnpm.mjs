import { unlinkSync } from "node:fs";

for (const lock of ["package-lock.json", "yarn.lock"]) {
  try {
    unlinkSync(lock);
  } catch {
    /* ignore */
  }
}

const agent = process.env.npm_config_user_agent ?? "";
if (!agent.includes("pnpm")) {
  console.error("Use pnpm instead of npm or yarn for this workspace.");
  process.exit(1);
}
