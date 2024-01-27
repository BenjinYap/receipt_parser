import ImageViewer from "./ImageViewer.tsx";
import {useListState} from "@mantine/hooks";
import {useState} from "react";
import MockReceiptApi from "../../Api/MockReceiptApi.ts";

const receiptApi = new MockReceiptApi();

export type UploadedImage = {
  id: string,
  previewUrl: string,
  textracting: boolean,
  textractData: any,
};

const Receiptmajigger = () => {
  //undefined means nothing uploaded yet, null means current image is not working for any reason
  const [activeImage, setActiveImage] = useState<UploadedImage | undefined | null>(undefined);
  const [uploadedImages, uploadedImagesHandler] = useListState<UploadedImage>([]);

  const handleDrop = (files: Array<File>) => {
    const toAdd: Array<UploadedImage> = [];

    for (const file: File of files) {
      toAdd.push({
        //todo should add duplicate id check
        id: Math.random().toFixed(20).replace('0.', ''),
        previewUrl: URL.createObjectURL(file),
        textracting: false,
        textractData: undefined,
      });

      receiptApi.uploadReceipt(file).then((resp) => {
        console.log(resp);
      });
    }

    setActiveImage(toAdd[0]);
    uploadedImagesHandler.append(...toAdd);
  };

  const handleThumbnailClick = (id: string) => {
    //todo should switch to a map of ids instead of just looping and checking
    const result: UploadedImage | undefined = uploadedImages.find((image: UploadedImage) => image.id === id);
    setActiveImage(result === undefined ? null : result);
  };

  return (
    <ImageViewer
      activeImage={activeImage}
      images={uploadedImages}
      onDrop={handleDrop}
      onDelete={() => console.log(1)}
      onThumbnailClick={handleThumbnailClick}
    />
  );
};

export default Receiptmajigger;