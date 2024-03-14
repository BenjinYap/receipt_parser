import {ExpenseCategory} from "./Receiptmajigger";
import {ActionIcon, Divider, Flex, Group, Paper, rem, Stack, Text, Title} from "@mantine/core";
import classes from './BrushSelector.module.css';
import globalClasses from '../../../../App.module.css';
import {IconSettings} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";

type BrushSelectorProps = {
  categories: Array<ExpenseCategory>,
  onCategorySelect: (id: number) => void,
  activeCategoryId: number | null,
};

const BrushSelector = (props: BrushSelectorProps) => {
  const cycleActiveCategory = (forward: boolean) => {
    let activeCategoryIndex = props.categories.findIndex((c: ExpenseCategory) => c.id === props.activeCategoryId);

    if (forward) {
      //no selection or at the end, then go back to beginning
      if (activeCategoryIndex === -1 || activeCategoryIndex === props.categories.length - 1) {
        activeCategoryIndex = 0;
      } else {
        activeCategoryIndex++;
      }
    } else {
      //at the beginning, then go back to the end
      if (activeCategoryIndex === 0) {
        activeCategoryIndex = props.categories.length - 1;
      } else {
        activeCategoryIndex--;
      }
    }

    props.onCategorySelect(props.categories[activeCategoryIndex].id);
  };

  //hotkeys for changing brushes
  useHotkeys([
    [',', () => cycleActiveCategory(false)],
    ['.', () => cycleActiveCategory(true)],
  ]);

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
            disabled
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