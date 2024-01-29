import {ExpenseCategory} from "./Receiptmajigger.tsx";
import {Divider, Flex, Group, Stack, Text} from "@mantine/core";
import classes from './BrushSelector.module.css';
import globalClasses from '../../../../App.module.css';

type BrushSelectorProps = {
  categories: Array<ExpenseCategory>,
  onCategorySelect: (id: number) => void,
  activeCategoryId: number | null,
};

const BrushSelector = (props: BrushSelectorProps) => {
  return (
    <>
      <Stack
        gap="xs"
      >
        <Divider
          label="Category Brushes"
          labelPosition="left"
        />
        <Flex
          direction={{xs: 'column'}}
          gap="xs"
          style={{flexWrap: 'wrap'}}
        >
          {props.categories.map((c: ExpenseCategory) => {
            //figure out the class names based on the category color id
            const overlayClass: string = `overlay${c.id}`;
            const overlayClassActive: string = c.id === props.activeCategoryId ? `${overlayClass}Active` : '';

            return (
              <Group
                className={`${classes.categoryContainer} ${globalClasses[overlayClass]} ${globalClasses[overlayClassActive]}`}
                key={c.id}
                px="xs"
                onClick={() => props.onCategorySelect(c.id)}
              >
                <Text>{c.name}</Text>
              </Group>
            );
          })}
        </Flex>
      </Stack>
    </>
  );
}

export default BrushSelector;