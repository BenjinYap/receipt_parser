import {Box} from "@mantine/core";
import classes from './TextBlockOverlay.module.css';

type TextBlockOverlayProps = {
  left: number,
  top: number,
  width: number,
  height: number,
  text: string,
  canvasWidth: number,
  canvasHeight: number,
};

const TextBlockOverlay = (props: TextBlockOverlayProps) => {
  console.log(props);

  return (
    <Box
      className={classes.textblockOverlay}
      left={props.canvasWidth * props.left}
      top={props.canvasHeight * props.top}
      w={props.canvasWidth * props.width}
      h={props.canvasHeight * props.height}
    >

    </Box>
  );
};

export default TextBlockOverlay;