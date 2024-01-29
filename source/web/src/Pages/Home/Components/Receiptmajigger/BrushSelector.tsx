import {ExpenseCategory} from "./Receiptmajigger.tsx";
import {Box, Divider, Flex, Group, Text, Title} from "@mantine/core";
import classes from './BrushSelector.module.css';
import globalClasses from '../../../../App.module.css';

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
    </>
  );
}

export default BrushSelector;