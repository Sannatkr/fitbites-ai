// utils/imageConverter.js
const isHeicImage = (file) => {
  const fileName = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif")
  );
};

const createImageBitmap = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  return window.createImageBitmap(blob);
};

const bitmapToJpegFile = async (bitmap, fileName) => {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const newFile = new File(
            [blob],
            fileName.replace(/\.(heic|heif)$/i, ".jpg"),
            { type: "image/jpeg" }
          );
          resolve(newFile);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      "image/jpeg",
      0.85
    );
  });
};

const resizeImage = async (file, maxWidth = 1200) => {
  const bitmap = await createImageBitmap(file);

  let width = bitmap.width;
  let height = bitmap.height;

  if (width > maxWidth) {
    height = Math.floor(height * (maxWidth / width));
    width = maxWidth;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const newFile = new File(
          [blob],
          file.name.replace(/\.[^/.]+$/, ".jpg"),
          { type: "image/jpeg" }
        );
        resolve(newFile);
      },
      "image/jpeg",
      0.85
    );
  });
};

export const processImageForUpload = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    if (isHeicImage(file)) {
      try {
        // Try native conversion first
        const bitmap = await createImageBitmap(file);
        return await bitmapToJpegFile(bitmap, file.name);
      } catch (error) {
        console.error("Native HEIC conversion failed:", error);
        // Let it fall through to regular processing
      }
    }

    // Regular image processing
    return await resizeImage(file);
  } catch (error) {
    console.error("Image processing error:", {
      error,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
    });
    throw error;
  }
};
