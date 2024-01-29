import {Group, Image, Paper, Text} from "@mantine/core";
import {useElementSize} from "@mantine/hooks";
import {UploadedImage} from "./Receiptmajigger.tsx";
import ParsedExpenseOverlay from "./ParsedExpenseOverlay.tsx";
import {ParsedExpense} from "../../Api/ReceiptApiInterface.ts";

type ImageViewerProps = {
  images: Array<UploadedImage>,
  onDelete: () => void,
  onParsedExpenseSelect: (id: string) => void,
  trackedExpenses: Record<string, number>,
};

const ImageViewer = (props: ImageViewerProps) => {
  const {ref, width, height} = useElementSize();
  const activeImage: UploadedImage | undefined | null = props.images.find((a: UploadedImage) => a.isActive);

  return (

    <Paper
      withBorder
      pos="relative"
      maw={1000}
    >
      {activeImage ? (
        <>
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
              expenseCategoryId={props.trackedExpenses[a.id] ?? null}
            />
          ))}
        </>
      ) : (
        <Group
          h="100%"
          p="xs"
        >
          <Text>Upload an image of a receipt to get started</Text>
        </Group>)}
    </Paper>

  );
};

export default ImageViewer;