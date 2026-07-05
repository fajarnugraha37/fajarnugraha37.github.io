import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

function runCommand(command: string, args: string[], extraEnv?: Record<string, string>) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...extraEnv,
    },
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

function resolveNextCommand(bunBinary: string) {
  const candidatePaths = [
    path.join(process.cwd(), "node_modules", ".bin", process.platform === "win32" ? "next.exe" : "next"),
    path.join(process.cwd(), "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next"),
  ];

  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      return {
        command: candidatePath,
        args: ["build"],
      };
    }
  }

  const nextCliPath = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  if (fs.existsSync(nextCliPath)) {
    return {
      command: bunBinary,
      args: [nextCliPath, "build"],
    };
  }

  throw new Error("Unable to locate a runnable Next.js CLI binary for build.");
}

async function run() {
  const bunBinary = process.execPath;
  let preBuildSucceeded = false;
  let buildStatus = 1;
  let buildAttempted = false;

  try {
    const preBuildStatus = runCommand(bunBinary, ["run", "scripts/pre-build.ts"]);
    if (preBuildStatus !== 0) {
      buildStatus = preBuildStatus;
      return;
    }

    preBuildSucceeded = true;
    buildAttempted = true;
    const nextCommand = resolveNextCommand(bunBinary);
    buildStatus = runCommand(nextCommand.command, nextCommand.args);
  } finally {
    const postBuildMode =
      preBuildSucceeded && buildAttempted && buildStatus === 0 ? "full" : "restore-only";
    const postBuildStatus = runCommand(
      bunBinary,
      ["run", "scripts/post-build.ts"],
      {
        POST_BUILD_MODE: postBuildMode,
      },
    );
    if (buildStatus === 0 && postBuildStatus !== 0) {
      buildStatus = postBuildStatus;
    }
  }

  process.exit(buildStatus);
}

run().catch((error) => {
  console.error("Build orchestration failed:", error);
  process.exit(1);
});
