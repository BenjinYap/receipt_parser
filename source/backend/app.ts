import express, {Express} from 'express';
import {AnalyzeDocumentCommand, AnalyzeDocumentRequest, TextractClient} from "@aws-sdk/client-textract";
import {fromEnv} from "@aws-sdk/credential-providers";
import * as fs from "fs";
import path from "node:path";
// import OrderRouter from "./Routes/Order/OrderRouter";

const app: Express = express()
const port: number = 3000

const client: TextractClient = new TextractClient([{
  region: 'us-east-1',
  credentials: fromEnv(),
}]);

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

// client.send(command).then((resp) => {
//   fs.writeFileSync(path.resolve(__dirname, 'hello.txt'), JSON.stringify(resp));
// });

app.get('/api', (req, res) => {
  res.send('Hello Worldaaaaaabbbbb!')
})

// app.use('/api/order', (new OrderRouter()).getRouter());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})