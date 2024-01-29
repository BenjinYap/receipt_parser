import {Box} from "@mantine/core";
import classes from './TextBlockOverlay.module.css';
import {ParsedExpense} from "../../Api/ReceiptApiInterface.ts";

type TextBlockOverlayProps = {
  parsedExpense: ParsedExpense,
  canvasWidth: number,
  canvasHeight: number,
};

const TextBlockOverlay = (props: TextBlockOverlayProps) => {
  console.log(props);

  return (
    <Box
      className={classes.textblockOverlay}
      left={props.canvasWidth * props.parsedExpense.left}
      top={props.canvasHeight * props.parsedExpense.top}
      w={props.canvasWidth * props.parsedExpense.width}
      h={props.canvasHeight * props.parsedExpense.height}
    >

    </Box>
  );
};

export default TextBlockOverlay;