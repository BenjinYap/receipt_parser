import {UploadedImage} from "./Receiptmajigger.tsx";
import {Image, Paper} from "@mantine/core";

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
        overflow: 'hidden',
        borderColor: props.isActive ? 'var(--mantine-color-dark-1)' : 'var(--mantine-color-dark-4)',
      }}
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