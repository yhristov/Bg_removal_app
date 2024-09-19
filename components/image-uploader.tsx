'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { removeBgAction } from '../app/actions/removeBg'
import * as fal from "@fal-ai/serverless-client";
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

// Initialize fal client with the API key
fal.config({
  credentials: process.env.FAL_KEY,
});

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
    setIsLoading(true);
    try {
      const uploadedUrl = await fal.storage.upload(file);
      const result = await removeBgAction(uploadedUrl);
      setProcessedImage(result);
    } catch (error) {
      console.error('Error processing image:', error);
      alert(`Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag & drop an image here, or click to select one</p>
          </div>
          {image && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Original Image</h3>
              <Image src={image} alt="Original" width={400} height={400} className="mx-auto max-w-full h-auto" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-center">Processing image...</p>}
          {processedImage && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Processed Image (Background Removed)</h3>
              <Image src={processedImage} alt="Processed" width={400} height={400} className="mx-auto max-w-full h-auto" />
              <Button className="mt-4" onClick={() => window.open(processedImage, '_blank')}>
                Download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}