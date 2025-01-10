"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function ImageUpload() {
  const [image, setImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <section className="bg-white dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Upload Food Image
        </h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? "bg-blue-50 dark:bg-gray-700" : ""
          }`}
        >
          <input {...getInputProps()} />
          {image ? (
            <div className="relative w-full h-64">
              <Image
                src={image}
                alt="Uploaded food"
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Drag and drop an image here, or click to select a file
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
