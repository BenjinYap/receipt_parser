import {Box, HoverCard, Stack, Text} from "@mantine/core";
import classes from './ParsedExpenseOverlay.module.css';
import {ParsedExpense} from "../../Api/ReceiptApiInterface";
import globalClasses from '../../../../App.module.css';

type ParsedExpenseOverlayProps = {
  parsedExpense: ParsedExpense,
  canvasWidth: number,
  canvasHeight: number,
  onSelect: (id: string) => void,
  onClear: (id: string) => void,
  expenseCategoryId: number | null,
};

const ParsedExpenseOverlay = (props: ParsedExpenseOverlayProps) => {
  let overlayClass: string;
  let overlayClassActive: string;

  if (props.expenseCategoryId) {
    //figure out the class names based on the category color id
    overlayClass = `overlay${props.expenseCategoryId}`;
    overlayClassActive = globalClasses[`${overlayClass}Active`];
    overlayClass = globalClasses[overlayClass];
  } else {
    //otherwise use the default style
    overlayClass = classes.overlayDefault;
    overlayClassActive = classes.overlayDefaultActive;
  }

  return (
    <HoverCard
      withArrow
      openDelay={0}
      closeDelay={0}
      position="right"
      styles={{
        dropdown: {
          padding: 'var(--mantine-spacing-xs)',
        },
      }}
    >
      <HoverCard.Target>
        <Box
          opacity={0.4}
          className={`${classes.overlay} ${overlayClass} ${overlayClassActive}`}
          left={props.canvasWidth * props.parsedExpense.left}
          top={props.canvasHeight * props.parsedExpense.top}
          w={props.canvasWidth * props.parsedExpense.width}
          h={props.canvasHeight * props.parsedExpense.height}
          onClick={() => props.onSelect(props.parsedExpense.id)}
          onContextMenu={(e: MouseEvent) => {
            e.preventDefault();
            props.onClear(props.parsedExpense.id);
          }}
        >

        </Box>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Stack
          gap="xs"
        >
          <Text>{props.parsedExpense.text}</Text>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ParsedExpenseOverlay;