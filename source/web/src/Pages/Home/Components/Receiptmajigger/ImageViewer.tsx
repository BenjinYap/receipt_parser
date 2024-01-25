import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {Flex, Group, Image, Paper, rem, Text} from "@mantine/core";
import {IconPhoto, IconPhotoPlus, IconUpload, IconX} from "@tabler/icons-react";
import {useListState} from "@mantine/hooks";
import {UploadedImage} from "./Receiptmajigger.tsx";
import ImageThumbnail from "./ImageThumbnail.tsx";

type ImageViewerProps = {
  activeImage: UploadedImage | undefined | null,
  images: Array<UploadedImage>,
  onDrop: (files: Array<File>) => void,
  onDelete: () => void,
  onThumbnailClick: (id: string) => void,
};

const ImageViewer = (props: ImageViewerProps) => {
  const MAX_SIZE = 100;

  return (
    <Flex
      w="100%"
      gap="md"
      direction={{base: 'column', xs: 'row'}}
    >
      <Paper withBorder>
        {props.activeImage ? (
          <Image
            src={props.activeImage.previewUrl}
            //feels wrong to revoke the url in this child component
            // onLoad={() => URL.revokeObjectURL(props.activeImage.previewUrl)}
          />
        ) : (
          <h1>awd</h1>
        )}
      </Paper>
      <Flex
        direction={{xs: 'column'}}
        w={{xs: 100}}
        h={{base: 100, xs: 'auto'}}
        gap="md"
        justify={{base: 'center', xs: 'unset'}}
      >
        {props.images.map((image: UploadedImage) => (
          <ImageThumbnail
            isActive={image === props.activeImage}
            key={image.id}
            maxSize={MAX_SIZE}
            image={image}
            onClick={(id: string) => props.onThumbnailClick(id)}
          />
        ))}
        <Dropzone
          onDrop={(files: Array<File>) => props.onDrop(files)}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          p={0}
        >
          <Group
            w={MAX_SIZE}
            h={MAX_SIZE}
            justify="center"
            align="center"
          >
            <IconPhotoPlus
              style={{
                color: 'var(--mantine-color-dimmed)'
              }}
              w={100}

            />
          </Group>
        </Dropzone>
      </Flex>
    </Flex>
  );
};

export default ImageViewer;