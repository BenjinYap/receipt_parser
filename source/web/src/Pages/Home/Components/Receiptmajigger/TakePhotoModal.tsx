import {Text, Button, Group, Image, Modal, Paper, Stack} from "@mantine/core";
import Webcam from "react-webcam";
import {useCallback, useRef, useState} from "react";

type TakePhotoModalProps = {
  opened: boolean,
  onClose: () => void,
  onUpload: (base64: string) => void,
};

const TakePhotoModal = (props: TakePhotoModalProps) => {
  const ref = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [streaming, setStreaming] = useState<boolean>(false);

  const capture = useCallback(() => {
    if (ref.current) {
      setStreaming(false);
      setImageSrc(ref.current?.getScreenshot());
    }
  }, [ref]);

  return (
    <Modal
      title="Take a Photo"
      size={streaming || imageSrc ? 'xl' : 'sm'}
      maw={1000}
      opened={props.opened}
      onClose={() => props.onClose()}
    >
      <Stack
        gap="xs"
      >
        {imageSrc &&
          <Image
            src={imageSrc}
          />
        }
        {!imageSrc &&
          <>
            <Webcam
              ref={ref}
              audio={false}
              width="100%"
              height={streaming ? 'auto' : 0}
              forceScreenshotSourceSize
              screenshotFormat="image/png"
              onUserMedia={() => setStreaming(true)}
            />
            {!streaming &&
              <Paper
                withBorder
                p="xl"
              >
                <Stack
                  gap="xl"
                  align="center"
                >
                  <Text ta="center">Loading your webcam.</Text>
                  <Text ta="center">Please allow this website to use your camera.</Text>
                </Stack>
              </Paper>
            }
          </>
        }
        <Group
          gap="xs"
          w="100%"
          justify="center"
        >
          {imageSrc &&
            <>
              <Button
                onClick={() => setImageSrc(null)}
                color="gray"
              >
                Retake Photo
              </Button>
              <Button onClick={() => props.onUpload(imageSrc)}>Upload Photo</Button>
            </>
          }
          {!imageSrc &&
            <Button
              onClick={() => capture()}
              disabled={!streaming}
            >
              Take Photo
            </Button>
          }
        </Group>
      </Stack>
    </Modal>
  );
}

export default TakePhotoModal;