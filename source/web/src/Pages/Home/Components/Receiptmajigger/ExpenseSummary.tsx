import {Checkbox, Divider, NumberInput, Stack, Table, TableData} from "@mantine/core";
import {useState} from "react";

export type ExpenseSummaryDataRow = [string, string];

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
      copy = copy.map((a) => [a[0], String(Number(Number(a[1]) * (1 + taxAmount / 100)).toFixed(2))]);
    }

    //add dollar sign
    copy = copy.map((a) => [a[0], `$${a[1]}`]);
    return copy;
  };


  const tableData: TableData = {
    head: ['Category', 'Total'],
    body: calculateFinalAmounts(),
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
      <Table
        data={tableData}
      />
    </Stack>
  );
}

export default ExpenseSummary;