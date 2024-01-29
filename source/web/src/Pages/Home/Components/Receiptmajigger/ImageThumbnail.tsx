import {UploadedImage} from "./Receiptmajigger.tsx";
import {Image, Loader, Paper} from "@mantine/core";
import classes from './ImageThumbnail.module.css';

type ImageThumbnailProps = {
  isActive: boolean,
  image: UploadedImage,
  maxSize: number,
  onClick: (id: string) => void,
};

const ImageThumbnail = (props: ImageThumbnailProps) => {
  return (
    <Paper
      withBorder
      style={{
        borderColor: props.isActive ? 'var(--mantine-color-blue-outline)' : 'var(--mantine-color-dark-outline)',
      }}
      maw={props.maxSize}
      mah={props.maxSize}
      onClick={() => props.onClick(props.image.id)}
      className={classes.paper}
    >
      {props.image.textracting &&
        <Loader
          type="dots"
          color="blue"
          className={classes.loader}
          pos="absolute"
        />
      }
      <Image
        src={props.image.previewUrl}
        //feels wrong to revoke the url in this child component
        // onLoad={() => URL.revokeObjectURL(props.image.previewUrl)}
      />
    </Paper>
  );
}

export default ImageThumbnail;