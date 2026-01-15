import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

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
  };
  const node = new WNode(
    {
      command() {
        return command;
      },
    } as any,
    {
      packagePath: path.resolve(os.tmpdir(), "w-node"),
      registry: "https://registry.npmmirror.com/",
    },
  );
  await node.start();

  const toImageService = new ToImageService({ node } as any, {});
  await toImageService.start();
  const fontCascadiaMono = new FontCascadiaMono({ toImageService } as any, {});
  await fontCascadiaMono["start"]();

  const typstToImageService = new TypstToImageService(
    { toImageService, node } as any,
    {},
  );
  await typstToImageService.start();

  const typ = await fs.readFile("./test.typ", "utf8");

  console.time("typst to png");
  await fs.writeFile(
    "./test.png",
    await typstToImageService.toPng(typ),
    "utf8",
  );
  console.timeEnd("typst to png");

  console.time("typst");
  const svg = typstToImageService.toSvg(typ);
  console.timeEnd("typst");
  await fs.writeFile("./test.svg", svg, "utf8");

  console.time("resvg");
  await fs.writeFile(
    "./test-resvg.png",
    await toImageService.svgToImage.resvg(svg),
  );
  console.timeEnd("resvg");

  console.time("vips");
  await fs.writeFile(
    "./test-vips.png",
    await toImageService.svgToImage.vips(svg, {
      format: "png",
      options: {
        compression: 5,
      },
    }),
  );
  console.timeEnd("vips");
})();
