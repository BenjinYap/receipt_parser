import express, {Express} from 'express';
import {AnalyzeDocumentCommand, AnalyzeDocumentRequest, TextractClient} from "@aws-sdk/client-textract";
import {fromEnv} from "@aws-sdk/credential-providers";
import * as fs from "fs";
import path from "node:path";
import ReceiptRouter from "./Routes/Receipt/ReceiptRouter";
// import OrderRouter from "./Routes/Order/OrderRouter";

const app: Express = express()
const port: number = 3000


app.get('/api', (req, res) => {
  res.send('Hello Worldaaaaaabbbbb!')
})

app.use('/api/receipt', (new ReceiptRouter()).getRouter());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})