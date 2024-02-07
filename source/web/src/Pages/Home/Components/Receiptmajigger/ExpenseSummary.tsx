import {Button, Checkbox, Divider, NumberInput, Paper, Stack, Table} from "@mantine/core";
import * as React from "react";
import {useState} from 'react';
import classes from './ExpenseSummary.module.css';
import {useClipboard} from "@mantine/hooks";

export type ExpenseSummaryDataRow = {
  categoryId: number,
  categoryName: string,
  amount: number,
};

type ExpenseSummaryProps = {
  data: Array<ExpenseSummaryDataRow>,
};

const ExpenseSummary = (props: ExpenseSummaryProps) => {
  const clipboard = useClipboard();

  const [includeTax, setIncludeText] = useState<boolean>(true);
  const [taxAmount, setTaxAmount] = useState<number>(13);

  const calculateFinalAmounts = (): Array<ExpenseSummaryDataRow> => {
    let copy = [...props.data];

    //handle tax addition
    if (includeTax) {
      copy = copy.map((a) => {
        return {
          ...a,
          amount: Number((a.amount * (1 + taxAmount / 100)).toFixed(2)),
        };
      });
    }

    return copy;
  };

  const finalData: Array<ExpenseSummaryDataRow> = calculateFinalAmounts();

  const generateCopyText = (): string => {
    let str = '';

    for (const row of finalData) {
      str += `${row.categoryName},${row.amount}\n`;
    }

    return str;
  };

  return (
    <Stack
      gap="xs"
    >
      <Divider
        label="Summary"
        labelPosition="left"
      />
      <Checkbox
        checked={includeTax}
        label="Include tax"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIncludeText(event.currentTarget.checked)}
      />
      <NumberInput
        label="Tax %"
        value={taxAmount}
        onChange={(e) => setTaxAmount(Number(e))}
        suffix="%"
        disabled={!includeTax}
      />
      <Paper
        withBorder
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {finalData.map((a: ExpenseSummaryDataRow) => {
              return (
                <Table.Tr
                  key={a.categoryId}
                  className={classes[`row${a.categoryId}`]}
                >
                  <Table.Td>{a.categoryName}</Table.Td>
                  <Table.Td>{`$${a.amount}`}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Paper>
      <Button
        onClick={() => clipboard.copy(generateCopyText())}
      >
        {clipboard.copied ? 'Copied' : 'Copy as CSV Text'}
      </Button>
    </Stack>
  );
}

export default ExpenseSummary;