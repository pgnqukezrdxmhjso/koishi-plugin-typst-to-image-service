import fs from "node:fs/promises";

import { Test } from "koishi-plugin-rzgtboeyndxsklmq-commons";
import { loadService } from "koishi-plugin-to-image-service/test/testBase";
import FontCascadiaMono from "koishi-plugin-to-image-service-font-cascadia-mono";
import TypstToImageService from "../src";

(async () => {
  const toImageService = await loadService();

  const fontCascadiaMono = new FontCascadiaMono(
    { ...toImageService["_ctx"], toImageService } as any,
    {},
  );
  await fontCascadiaMono["start"]();

  const typstToImageService = new TypstToImageService(
    { toImageService, node: toImageService["_ctx"].node } as any,
    {},
  );
  await typstToImageService.start();

  const count = 30;
  const save = false;
  const typ = await fs.readFile("./test.typ", "utf8");

  let svg: string;

  await Test.test(count, [
    {
      name: "typst to svg",
      fn: async () => {
        svg = typstToImageService.toSvg(typ);
        save && (await fs.writeFile("./test.svg", svg, "utf8"));
      },
    },
    {
      name: "typst to png",
      fn: async () => {
        const png = await typstToImageService.toPng(typ);
        save && (await fs.writeFile("./test.png", png, "utf8"));
      },
    },
    {
      name: "svg to resvg",
      fn: async () => {
        const png = await toImageService.resvgRenderer.render({
          svg,
        });
        save && (await fs.writeFile("./test-resvg.png", png));
      },
    },
    {
      name: "svg to sharp",
      fn: async () => {
        const png = await toImageService.sharpRenderer.render({
          source: Buffer.from(svg),
          format: "png",
        });
        save && (await fs.writeFile("./test-sharp.png", png));
      },
    },
  ]);
})();
