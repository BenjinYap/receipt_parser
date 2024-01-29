import {ExpenseCategory} from "./Receiptmajigger.tsx";
import {Box, Divider, Flex, Group, Text, Title} from "@mantine/core";
import classes from './BrushSelector.module.css';

type BrushSelectorProps = {
  categories: Array<ExpenseCategory>,
};

const BrushSelector = (props: BrushSelectorProps) => {
  return (
    <>
      <Flex
        direction={{xs: 'column'}}
        gap="xs"
      >
        {props.categories.map((c: ExpenseCategory) => (
          <Group
            className={classes.categoryContainer}
            key={c.id}
            pl="xs"
            style={{borderColor: `var(--mantine-color-${c.color}-outline)`}}
          >
            <Text>{c.name}</Text>
          </Group>
        ))}
      </Flex>
    </>
  );
}

export default BrushSelector;