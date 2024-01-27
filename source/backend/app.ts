import express, {Express} from 'express';
import ReceiptRouter from "./Routes/Receipt/ReceiptRouter";

const app: Express = express()
const port: number = 3000

app.get('/api', (req, res) => {
  res.send('Hello Worldaaaaaabbbbb!')
})

app.use('/api/receipt', (new ReceiptRouter()).getRouter());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})