import {ExpenseCategory} from "./Receiptmajigger";
import {ActionIcon, Divider, Flex, Group, Paper, rem, Stack, Text, Title} from "@mantine/core";
import classes from './BrushSelector.module.css';
import globalClasses from '../../../../App.module.css';
import {IconSettings} from "@tabler/icons-react";

type BrushSelectorProps = {
  categories: Array<ExpenseCategory>,
  onCategorySelect: (id: number) => void,
  activeCategoryId: number | null,
};

const BrushSelector = (props: BrushSelectorProps) => {
  return (
    <Paper
      withBorder
      p="xs"
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <Title order={6}>Category Brushes</Title>
          <ActionIcon
            size="sm"
          >
            <IconSettings style={{width: rem(20), height: rem(20)}}/>
          </ActionIcon>
        </Group>
        <Divider/>
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
    </Paper>
  );
}

export default BrushSelector;