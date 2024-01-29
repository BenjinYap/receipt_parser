import {Box, Image, Paper} from "@mantine/core";
import {useElementSize} from "@mantine/hooks";
import {UploadedImage} from "./Receiptmajigger.tsx";
import TextBlockOverlay from "./TextBlockOverlay.tsx";

type ImageViewerProps = {
  images: Array<UploadedImage>,
  onDelete: () => void,
};

const ImageViewer = (props: ImageViewerProps) => {
  const {ref, width, height} = useElementSize();
  const activeImage: UploadedImage | undefined | null = props.images.find((a: UploadedImage) => a.isActive);

  return (

    <Paper withBorder>
      {activeImage ? (
        <Box
          pos="relative"
        >
          <Image
            ref={ref}
            src={activeImage.previewUrl}
            //feels wrong to revoke the url in this child component
            // onLoad={() => URL.revokeObjectURL(activeImage.previewUrl)}
          />
          {activeImage.textractData?.blocks.map((a) => (
            <TextBlockOverlay
              key={a.id}
              left={a.left}
              top={a.top}
              width={a.width}
              height={a.height}
              text={a.text}
              canvasWidth={width}
              canvasHeight={height}
            />
          ))}
        </Box>
      ) : (
        <h1>awd</h1>
      )}
    </Paper>

  );
};

export default ImageViewer;