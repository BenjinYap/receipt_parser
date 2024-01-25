import {UploadedImage} from "./Receiptmajigger.tsx";
import {Image, Paper} from "@mantine/core";

type ImageThumbnailProps = {
  image: UploadedImage,
  maxSize: number,
  onClick: (id: string) => void,
};

const ImageThumbnail = (props: ImageThumbnailProps) => {
  return (
    <Paper
      withBorder
      style={{overflow: 'hidden'}}
      maw={props.maxSize}
      mah={props.maxSize}
      onClick={() => props.onClick(props.image.id)}
    >
      <Image
        src={props.image.previewUrl}
        //feels wrong to revoke the url in this child component
        // onLoad={() => URL.revokeObjectURL(props.image.previewUrl)}
      />
    </Paper>
  );
}

export default ImageThumbnail;