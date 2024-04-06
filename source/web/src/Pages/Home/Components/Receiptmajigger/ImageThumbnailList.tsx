import ImageThumbnail from "./ImageThumbnail";
import {Dropzone} from "@mantine/dropzone";
import {ActionIcon, Box, Flex, Group} from "@mantine/core";
import {IconCamera, IconPhotoPlus, IconX} from "@tabler/icons-react";
import {UploadedImage} from "./Receiptmajigger";
import classes from './ImageThumbnailList.module.css';

type ImageThumbnailListProps = {
  images: Array<UploadedImage>,
  onDrop: (files: Array<File>) => void,
  onThumbnailClick: (id: string) => void,
  onCameraClick: () => void,
  onThumbnailDeleteClick: (id: string) => void,
};

const ImageThumbnailList = (props: ImageThumbnailListProps) => {
  const activeImage: UploadedImage | undefined | null = props.images.find((a: UploadedImage) => a.isActive);

  const MAX_SIZE = 100;

  return (
    <Flex
      direction={{xs: 'column'}}
      w={{xs: 100}}
      h={{xs: 'auto'}}
      gap="xs"
      justify={{base: 'center', xs: 'unset'}}
      style={{flexWrap: 'wrap'}}
    >
      {props.images.map((image: UploadedImage) => (
        <Box
          key={image.id}
          pos="relative"
        >
          <ImageThumbnail
            isActive={image === activeImage}
            key={image.id}
            maxSize={MAX_SIZE}
            image={image}
            onClick={(id: string) => props.onThumbnailClick(id)}
          />
          <ActionIcon
            size="xs"
            color="red"
            pos="absolute"
            top="calc(1px + 13px)"
            left="calc(100% - 1px - 15px)"
            style={{
              transform: 'translate(-50%,-50%)',
            }}
            onClick={() => props.onThumbnailDeleteClick(image.id)}
          >
            <IconX style={{
              width: '90%',
              height: '90%'
            }}/>
          </ActionIcon>
        </Box>
      ))}
      <Dropzone
        onDrop={(files: Array<File>) => props.onDrop(files)}
        maxSize={5 * 1024 ** 2}
        accept={['image/jpeg', 'image/png']}
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
          />
        </Group>
      </Dropzone>
      <Group
        w={MAX_SIZE}
        h={MAX_SIZE}
        justify="center"
        align="center"
        className={classes.webcam}
        onClick={() => props.onCameraClick()}
      >
        <IconCamera
          style={{
            color: 'var(--mantine-color-dimmed)'
          }}
        />
      </Group>
    </Flex>
  );
}

export default ImageThumbnailList;