import fs from "node:fs/promises";
import path from "node:path";

import ToImageService from "koishi-plugin-to-image-service";
import WNode from "koishi-plugin-w-node";
import FontCascadiaMono from "koishi-plugin-to-image-service-font-cascadia-mono";
import TypstToImageService from "../src";

(async () => {
  const command = {
    action() {
      return command;
    },
    option() {
      return command;
    },
    alias() {
      return command;
    },
  };
  const ctx = {
    command() {
      return command;
    },
    i18n: {
      define: (a, b) => b,
    },
    on: () => 0,
    logger: {
      error: console.error,
    },
  };
  const node = new WNode(ctx as any, {
    packagePath: path.resolve(__dirname, "../../../cache/node"),
    registry: "https://registry.npmmirror.com/",
  });
  await node.start();

  const toImageService = new ToImageService({ ...ctx, node } as any, {});
  await toImageService.start();
  const fontCascadiaMono = new FontCascadiaMono(
    { ...ctx, toImageService } as any,
    {},
  );
  await fontCascadiaMono["start"]();

  const typstToImageService = new TypstToImageService(
    { toImageService, node } as any,
    {},
  );
  await typstToImageService.start();

  const typ = await fs.readFile("./test.typ", "utf8");

  console.time("typst");
  const svg = typstToImageService.toSvg(typ);
  console.timeEnd("typst");
  await fs.writeFile("./test.svg", svg, "utf8");

  console.time("typst to png");
  await fs.writeFile(
    "./test.png",
    await typstToImageService.toPng(typ),
    "utf8",
  );
  console.timeEnd("typst to png");

  console.time("resvg");
  await fs.writeFile(
    "./test-resvg.png",
    await toImageService.resvgRenderer.render(svg),
  );
  console.timeEnd("resvg");

  console.time("sharp");
  await fs.writeFile(
    "./test-sharp.png",
    await toImageService.sharpRenderer.render({
      source: Buffer.from(svg),
      format: "png",
    }),
  );
  console.timeEnd("sharp");
})();
