import ImageViewer from "./ImageViewer.tsx";
import {useListState, usePrevious} from "@mantine/hooks";
import {useEffect, useState} from "react";
import MockReceiptApi from "../../Api/MockReceiptApi.ts";

const receiptApi = new MockReceiptApi();

export type UploadedImage = {
  id: string,
  isActive: boolean,
  previewUrl: string,
  textracting: boolean,
  textractData: any,
};

const Receiptmajigger = () => {
  const [uploadedImages, uploadedImagesHandler] = useListState<UploadedImage>([]);
  const previousUploadedImages = usePrevious(uploadedImages);

  const updateActiveImage = (activeIndex: number): void => {
    //set the currently active one to false and the new index to true
    //this should only result in 2 state calls which should be better than doing a one liner
    for (let i: number = 0; i < uploadedImages.length; i++) {
      if (uploadedImages[i].isActive && i !== activeIndex) {
        uploadedImagesHandler.setItemProp(i, 'isActive', false);
      } else if (i === activeIndex) {
        uploadedImagesHandler.setItemProp(i, 'isActive', true);
      }
    }
  };

  const handleDrop = (files: Array<File>) => {
    const toAdd: Array<UploadedImage> = [];
    const currentImageCount = uploadedImages.length;

    for (let i: number = 0; i < files.length; i++) {
      toAdd.push({
        //todo should add duplicate id check
        id: Math.random().toFixed(20).replace('0.', ''),
        isActive: false,
        previewUrl: URL.createObjectURL(files[i]),
        textracting: true,
        textractData: undefined,
      });

      //upload the image to the OCR api then save the resulting data
      receiptApi.uploadReceipt(files[i]).then((resp) => {
        uploadedImagesHandler.setItemProp(i + currentImageCount, 'textracting', false);

        if (resp.success) {
          uploadedImagesHandler.setItemProp(i + currentImageCount, 'textractData', resp.data);
        }
      });
    }

    //set all existing images to inactive
    uploadedImagesHandler.apply((image: UploadedImage) => {
      image.isActive = false;
      return image;
    });
    //set the first of the newly uploaded image to be active
    toAdd[0].isActive = true;
    uploadedImagesHandler.append(...toAdd);
  };

  const handleThumbnailClick = (id: string) => {
    updateActiveImage(uploadedImages.findIndex((image: UploadedImage) => image.id === id));
  };

  useEffect(() => {
    if (uploadedImages.length > previousUploadedImages) {
      updateActiveImage(uploadedImages.length - 1);
    } else if (uploadedImages.length < previousUploadedImages) {
      //todo deal with deleting images later
    }
  }, [uploadedImages]);

  return (
    <>
      <button onClick={() => console.log(uploadedImages)}>awd</button>
      <ImageViewer
        images={uploadedImages}
        onDrop={handleDrop}
        onDelete={() => console.log(1)}
        onThumbnailClick={handleThumbnailClick}
      />
    </>
  );
};

export default Receiptmajigger;