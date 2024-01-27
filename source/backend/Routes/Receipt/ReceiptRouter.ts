import Api from "../../Global/Api";
import express, {Request, Response, Router} from "express";
import multer from 'multer';
import {
  AnalyzeDocumentCommand, AnalyzeDocumentCommandOutput,
  AnalyzeDocumentRequest,
  AnalyzeDocumentResponse, Block,
  TextractClient
} from "@aws-sdk/client-textract";
import {fromEnv} from "@aws-sdk/credential-providers";
import fs from "fs";
import path from "node:path";

export type TextBlock = {
  left: number,
  top: number,
  width: number,
  height: number,
  text: string,
}

const upload = multer();

export default class ReceiptRouter extends Api {

  private parseTextractResponse(resp: AnalyzeDocumentCommandOutput): Array<TextBlock> {
    const blocks: Array<TextBlock> = [];
    //only care about word blocks
    const textractBlocks: Array<Block> = resp.Blocks ? resp.Blocks.filter((a) => a.BlockType === 'WORD') : [];

    for (const textractBlock of textractBlocks) {
      //only care about blocks with a bounding box
      if (textractBlock.Geometry?.BoundingBox === undefined) {
        continue;
      }

      //only care about blocks with a number with decimals
      // noinspection PointlessBooleanExpressionJS
      if (/.*\d+\.\d+.*/.test(textractBlock.Text ?? '') === false) {
        continue;
      }

      const block: TextBlock = {
        left: textractBlock.Geometry.BoundingBox.Left ?? -1,
        top: textractBlock.Geometry.BoundingBox.Top ?? -1,
        width: textractBlock.Geometry.BoundingBox.Width ?? -1,
        height: textractBlock.Geometry.BoundingBox.Height ?? -1,
        text: textractBlock.Text ?? '',
      };
      blocks.push(block);
    }

    return blocks;
  }

  private parse = async (req: Request, res: Response): Promise<any> => {
    // if (req.file === undefined) {
    //   res.json(this.buildErrorResponse('upload_failed', {}));
    // } else {
    // const client: TextractClient = new TextractClient({
    //   region: 'us-east-1',
    //   credentials: fromEnv(),
    // });
    // const input: AnalyzeDocumentRequest = { // AnalyzeDocumentRequest
    //   Document: { // Document
    //     Bytes: req.file.buffer,
    //   },
    //   FeatureTypes: [ // FeatureTypes // required
    //     "SIGNATURES",
    //   ],
    // };
    // const command: AnalyzeDocumentCommand = new AnalyzeDocumentCommand(input);
    // const resp: AnalyzeDocumentCommandOutput = await client.send(command);
    // fs.writeFileSync(path.resolve(__dirname, 'hello.txt'), JSON.stringify(resp));
    const resp = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'hello.txt'), 'utf-8'));
    const blocks = this.parseTextractResponse(resp);
    res.json(this.buildSuccessResponse({blocks: blocks}));
    // }
  }

  public getRouter(): Router {
    const router: Router = express.Router();

    router.get('/', (req: Request, res: Response): void => {
      res.send('hellaa');
    });

    router.post('/parse', upload.single('file'), this.parse);

    return router;
  }
}