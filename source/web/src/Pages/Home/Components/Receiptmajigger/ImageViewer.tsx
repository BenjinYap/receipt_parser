import {Image, LoadingOverlay, Paper, Stack, Text} from "@mantine/core";
import {useElementSize} from "@mantine/hooks";
import {UploadedImage} from "./Receiptmajigger";
import ParsedExpenseOverlay from "./ParsedExpenseOverlay";
import {ParsedExpense} from "../../Api/ReceiptApiInterface";

type ImageViewerProps = {
  images: Array<UploadedImage>,
  onDelete: () => void,
  onParsedExpenseSelect: (id: string) => void,
  onParsedExpenseClear: (id: string) => void,
  trackedExpenses: Record<string, number>,
};

const ImageViewer = (props: ImageViewerProps) => {
  const {ref, width, height} = useElementSize();
  const activeImage: UploadedImage | undefined | null = props.images.find((a: UploadedImage) => a.isActive);

  return (

    <Paper
      withBorder
      pos="relative"
      flex={1}
    >
      {activeImage ? (
        <>
          <LoadingOverlay
            visible={activeImage.textracting}
            loaderProps={{color: 'blue', type: 'dots'}}
          />
          <Image
            ref={ref}
            src={activeImage.previewUrl}
            //feels wrong to revoke the url in this child component
            // onLoad={() => URL.revokeObjectURL(activeImage.previewUrl)}
          />
          {activeImage.parsedExpenses.map((a: ParsedExpense) => (
            <ParsedExpenseOverlay
              key={a.id}
              parsedExpense={a}
              canvasWidth={width}
              canvasHeight={height}
              onSelect={(id: string) => props.onParsedExpenseSelect(id)}
              onClear={(id: string) => props.onParsedExpenseClear(id)}
              expenseCategoryId={props.trackedExpenses[a.id] ?? null}
            />
          ))}
        </>
      ) : (
        <Stack
          h="100%"
          p="xs"
          justify="center"
          ta="center"
        >
          <Text>Upload an image of a receipt to get started.</Text>
          <Text>Only JPEG and PNG are currently supported.</Text>
        </Stack>)}
    </Paper>

  );
};

export default ImageViewer;