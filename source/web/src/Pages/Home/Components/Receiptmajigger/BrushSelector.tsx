import {ExpenseCategory} from "./Receiptmajigger.tsx";
import {Box, Divider, Flex, Group, Text, Title} from "@mantine/core";
import classes from './BrushSelector.module.css';

type BrushSelectorProps = {
  categories: Array<ExpenseCategory>,
  onCategorySelect: (id: number) => void,
  activeCategoryId: number,
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
            style={{
              borderColor: `var(--mantine-color-${c.color}-outline)`
            }}
            bg={c.id === props.activeCategoryId ? `var(--mantine-color-${c.color}-filled)` : 'transparent'}
            onClick={() => props.onCategorySelect(c.id)}
          >
            <Text>{c.name}</Text>
          </Group>
        ))}
      </Flex>
    </>
  );
}

export default BrushSelector;