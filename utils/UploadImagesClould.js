import FormData from "form-data";
import { Uploadimages } from "../request/uploadimg";

export default async function UploadImagesClould(images) {
  const uploadedImages = [];

  for (const imageUrl of images) {
    try {
      const formData = new FormData();
      formData.append("file", imageUrl);
      formData.append("upload_preset", "ml_default");
      formData.append("cloud_name", "dtasegoef");

      const uploadedImage = await Uploadimages(formData);
      uploadedImages.push(uploadedImage);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
 
  return uploadedImages;
}
