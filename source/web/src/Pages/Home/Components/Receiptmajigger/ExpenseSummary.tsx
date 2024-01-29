import {Table, TableData} from "@mantine/core";

const ExpenseSummary = () => {
  const tableData: TableData = {
    head: ['Category', 'Total'],
    body: [
      ['Snack', '$34.55'],
      ['Eating out', '$555.13'],
      ['Coffee', '$8.67'],
    ],
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