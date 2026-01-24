import fs from "node:fs";
import path from "node:path";
import { Context, Schema, Service } from "koishi";
import type { FontManagement } from "koishi-plugin-to-image-service";
// noinspection ES6UnusedImports
import {} from "koishi-plugin-w-node";
import type Typst from "@myriaddreamin/typst-ts-node-compiler";
import type {
  NodeCompiler,
  NodeAddFontBlobs,
} from "@myriaddreamin/typst-ts-node-compiler";
import { importPackage } from "./util";

const serviceName = "typstToImageService";

declare module "koishi" {
  interface Context {
    typstToImageService: TypstToImageService;
  }
}

class TypstToImageService extends Service {
  readonly typstName = "@myriaddreamin/typst-ts-node-compiler";
  readonly fontFormats: FontManagement.FontFormat[] = ["ttf", "otf"];

  typst: typeof Typst;
  private lastFonts: FontManagement.Font[] = [];
  private compiler: NodeCompiler = null;

  constructor(
    private _ctx: Context,
    private _config: TypstToImageService.Config,
  ) {
    super(_ctx, serviceName);
  }

  async start() {
    this.typst = await importPackage(this._ctx, this.typstName);
  }

  getCompiler() {
    const fonts = this._ctx.toImageService.fontManagement.getFonts({
      formats: this.fontFormats,
    });
    if (
      !this.compiler ||
      fonts.length != this.lastFonts.length ||
      (fonts.length > 0 &&
        fonts.some((f) => !this.lastFonts.some((lf) => lf.data === f.data)))
    ) {
      this.compiler = this.typst.NodeCompiler.create({
        fontArgs: fonts.map(
          (font) =>
            ({
              fontBlobs: [font.data],
            }) as NodeAddFontBlobs,
        ),
      });
      this.lastFonts = fonts;
    }
    return this.compiler;
  }

  toSvg(content: string, inputs?: Record<string, string>) {
    const compiler = this.getCompiler();
    try {
      return compiler.svg({
        mainFileContent: content,
        inputs,
      });
    } finally {
      compiler.evictCache(10);
    }
  }

  async toPng(content: string, inputs?: Record<string, string>) {
    const svg = this.toSvg(content, inputs);
    return this._ctx.toImageService.sharpRenderer.render({
      source: Buffer.from(svg),
      format: "png",
    });
  }
}

const readme = fs.readFileSync(path.join(__dirname, "../readme.md"), "utf8");
namespace TypstToImageService {
  export const usage = readme;

  export const inject = ["node", "toImageService"];
  export interface Config {}
  export const Config: Schema<Config> = Schema.object({});
}

export default TypstToImageService;
