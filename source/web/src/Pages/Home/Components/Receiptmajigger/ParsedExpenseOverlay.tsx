import {Box} from "@mantine/core";
import classes from './ParsedExpenseOverlay.module.css';
import {ParsedExpense} from "../../Api/ReceiptApiInterface.ts";
import globalClasses from '../../../../App.module.css';

type ParsedExpenseOverlayProps = {
  parsedExpense: ParsedExpense,
  canvasWidth: number,
  canvasHeight: number,
  onSelect: (id: string) => void,
  expenseCategoryId: number | null,
};

const ParsedExpenseOverlay = (props: ParsedExpenseOverlayProps) => {
  let overlayClass: string = '';
  let overlayClassActive: string = '';

  if (props.expenseCategoryId) {
    //figure out the class names based on the category color id
    overlayClass = `overlay${props.expenseCategoryId}`;
    overlayClassActive = `${overlayClass}Active`;
  }

  return (
    <Box
      opacity={0.6}
      className={`${classes.textblockOverlay} ${globalClasses[overlayClass]} ${globalClasses[overlayClassActive]}`}
      left={props.canvasWidth * props.parsedExpense.left}
      top={props.canvasHeight * props.parsedExpense.top}
      w={props.canvasWidth * props.parsedExpense.width}
      h={props.canvasHeight * props.parsedExpense.height}
      onClick={() => props.onSelect(props.parsedExpense.id)}
    >

    </Box>
  );
};

export default ParsedExpenseOverlay;