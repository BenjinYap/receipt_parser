import Api from "../../Global/Api";
import express, {Request, Response, Router} from "express";
import {
  AnalyzeDocumentCommand, AnalyzeDocumentCommandOutput,
  AnalyzeDocumentRequest,
  AnalyzeDocumentResponse,
  TextractClient
} from "@aws-sdk/client-textract";
import {fromEnv} from "@aws-sdk/credential-providers";
import fs from "fs";
import path from "node:path";

export default class ReceiptRouter extends Api {

  private async parse(req: Request, res: Response): Promise<any> {
    const client: TextractClient = new TextractClient({
      region: 'us-east-1',
      credentials: fromEnv(),
    });

    const awd: Buffer = fs.readFileSync(path.resolve(__dirname, 'Untitled.jpg'));
    const input: AnalyzeDocumentRequest = { // AnalyzeDocumentRequest
      Document: { // Document
        // Bytes: Uint8Array.from("awd".split('').map(letter => letter.charCodeAt(0))),
        Bytes: awd,
      },
      FeatureTypes: [ // FeatureTypes // required
        "SIGNATURES",
      ],
    };

    const command: AnalyzeDocumentCommand = new AnalyzeDocumentCommand(input);

    const resp: AnalyzeDocumentCommandOutput = await client.send(command);
    res.json(this.buildSuccessResponse('yo'));
    // fs.writeFileSync(path.resolve(__dirname, 'hello.txt'), JSON.stringify(resp));
  }

  public getRouter(): Router {
    const router: Router = express.Router();

    router.get('/', (req: Request, res: Response): void => {
      res.send('hellaa');
    });

    router.get('/parse', this.parse);

    return router;
  }
}