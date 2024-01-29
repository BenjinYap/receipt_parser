import ImageThumbnail from "./ImageThumbnail.tsx";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {Flex, Group} from "@mantine/core";
import {IconPhotoPlus} from "@tabler/icons-react";
import {UploadedImage} from "./Receiptmajigger.tsx";


type ImageThumbnailListProps = {
  images: Array<UploadedImage>,
  onDrop: (files: Array<File>) => void,
  onThumbnailClick: (id: string) => void,
};

const ImageThumbnailList = (props: ImageThumbnailListProps) => {
  const activeImage: UploadedImage | undefined | null = props.images.find((a: UploadedImage) => a.isActive);

  const MAX_SIZE = 100;


  return (
    <Flex
      direction={{xs: 'column'}}
      w={{xs: 100}}
      h={{base: 100, xs: 'auto'}}
      gap="md"
      justify={{base: 'center', xs: 'unset'}}
    >
      {props.images.map((image: UploadedImage) => (
        <ImageThumbnail
          isActive={image === activeImage}
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
  );
}

export default ImageThumbnailList;