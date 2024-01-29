import {Checkbox, Divider, NumberInput, Stack, Table} from "@mantine/core";
import {useState} from "react";
import classes from './ExpenseSummary.module.css';

export type ExpenseSummaryDataRow = {
  categoryId: number,
  categoryName: string,
  amount: number,
};

type ExpenseSummaryProps = {
  data: Array<ExpenseSummaryDataRow>,
};

const ExpenseSummary = (props: ExpenseSummaryProps) => {
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
        onChange={(event) => setIncludeText(event.currentTarget.checked)}
      />
      <NumberInput
        label="Tax %"
        value={taxAmount}
        onChange={(e) => setTaxAmount(Number(e))}
        suffix="%"
        disabled={!includeTax}
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Category</Table.Th>
            <Table.Th>Total</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {calculateFinalAmounts().map((a: ExpenseSummaryDataRow) => {
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
    </Stack>
  );
}

export default ExpenseSummary;