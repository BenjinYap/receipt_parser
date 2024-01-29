import {Table, TableData} from "@mantine/core";

export type ExpenseSummaryDataRow = [string, string];

type ExpenseSummaryProps = {
  data: Array<ExpenseSummaryDataRow>,
};

const ExpenseSummary = (props: ExpenseSummaryProps) => {
  const tableData: TableData = {
    head: ['Category', 'Total'],
    body: props.data,
  };
  
  return (
    <>
      <Table
        data={tableData}
      />
    </>
  );
}

export default ExpenseSummary;