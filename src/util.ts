import fs from "node:fs/promises";
import path from "node:path";
import { Context } from "koishi";

export async function installPackage(ctx: Context, packageName: string) {
  if (await ctx.node.has(packageName)) {
    return;
  }

  const packageJson = JSON.parse(
    await fs.readFile(path.resolve(__dirname, "../package.json"), "utf8"),
  );
  await ctx.node.install(
    packageName,
    (packageJson?.devDependencies?.[packageName] as string)?.replace(
      /[^\d.]/,
      "",
    ),
  );
}
