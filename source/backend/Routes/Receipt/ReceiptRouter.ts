import Api from "../../Global/Api";
import express, {Request, Response, Router} from "express";
import multer from 'multer';
import {
  AnalyzeDocumentCommand, AnalyzeDocumentCommandOutput,
  AnalyzeDocumentRequest,
  AnalyzeDocumentResponse,
  TextractClient
} from "@aws-sdk/client-textract";
import {fromEnv} from "@aws-sdk/credential-providers";
import fs from "fs";
import path from "node:path";

const upload = multer();

export default class ReceiptRouter extends Api {

  // private async parse(req: Request, res: Response): Promise<any> {
  private parse = async (req: Request, res: Response): Promise<any> => {
    if (req.file === undefined) {
      res.json(this.buildErrorResponse('upload_failed', {}));
    } else {
      // console.log(req.body, req.file);
      // res.json(this.buildSuccessResponse(req.body));
      const client: TextractClient = new TextractClient({
        region: 'us-east-1',
        credentials: fromEnv(),
      });
      // const awd: Buffer = fs.readFileSync(path.resolve(__dirname, 'Untitled.jpg'));
      const input: AnalyzeDocumentRequest = { // AnalyzeDocumentRequest
        Document: { // Document
          Bytes: req.file.buffer,
        },
        FeatureTypes: [ // FeatureTypes // required
          "SIGNATURES",
        ],
      };
      const command: AnalyzeDocumentCommand = new AnalyzeDocumentCommand(input);
      const resp: AnalyzeDocumentCommandOutput = await client.send(command);
      // fs.writeFileSync(path.resolve(__dirname, 'hello.txt'), JSON.stringify(resp));
      // res.json(this.buildSuccessResponse('yo'));
    }
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