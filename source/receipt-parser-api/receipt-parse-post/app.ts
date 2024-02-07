import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {
  AnalyzeDocumentCommand, AnalyzeDocumentCommandOutput,
  AnalyzeDocumentRequest,
  AnalyzeDocumentResponse, Block,
  TextractClient
} from "@aws-sdk/client-textract";
import fs from "fs";
import path from "node:path";

type TextBlock = {
  id: string,
  left: number,
  top: number,
  width: number,
  height: number,
  text: string,
}

const parseTextractResponse = (resp: AnalyzeDocumentCommandOutput): Array<TextBlock> => {
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
      id: textractBlock.Id ?? '',
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

const buildSuccessResponse = (data: object) => {
  return {statusCode: 200, body: JSON.stringify(data)};
};

const buildErrorResponse = (code: string, errorData: object) => {
  return {statusCode: 400, code: code, body: JSON.stringify(errorData)};
};

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.body === null) {
    return {
      statusCode: 500,
      body: 'bad boy',
    };
  }

  const base64 = JSON.parse(event.body).file ?? null;

  try {
    if (event.queryStringParameters?.mock) {
      const resp = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'hello.txt'), 'utf-8'));
      const blocks = parseTextractResponse(resp);
      return buildSuccessResponse({blocks: blocks});
    } else {
      if (base64 === null) {
        return buildErrorResponse('upload_failed', {});
      } else {
        const client: TextractClient = new TextractClient({
          region: 'us-east-1',
        });
        const input: AnalyzeDocumentRequest = { // AnalyzeDocumentRequest
          Document: { // Document
            Bytes: Buffer.from(base64.substring(base64.indexOf(',') + 1), 'base64'),
          },
          FeatureTypes: [ // FeatureTypes // required
            "SIGNATURES",
          ],
        };
        const command: AnalyzeDocumentCommand = new AnalyzeDocumentCommand(input);
        const resp: AnalyzeDocumentCommandOutput = await client.send(command);
        // fs.writeFileSync(path.resolve(__dirname, 'hello.txt'), JSON.stringify(resp));
        const blocks = parseTextractResponse(resp);
        return buildSuccessResponse({blocks: blocks});
      }
    }
  } catch (err) {
    console.log(err);
    return {statusCode: 500, body: JSON.stringify(err)};
  }
};
