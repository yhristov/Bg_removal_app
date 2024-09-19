'use server'

import * as fal from "@fal-ai/serverless-client";

interface FalResult {
  image: {
    url: string;
  };
}

export async function removeBgAction(imageUrl: string) {
  try {
    // Ensure imageUrl is a string
    if (typeof imageUrl !== 'string') {
      throw new Error('Invalid image URL');
    }

    const result = await fal.subscribe('fal-ai/birefnet', {
      input: {
        image_url: imageUrl,
      },
    }) as FalResult;

    // Check if result is valid
    if (!result || !result.image || !result.image.url) {
      throw new Error('Invalid result from background removal');
    }

    return result.image.url;
  } catch (error) {
    console.error('Error removing background:', error);
    throw new Error('Failed to remove background');
  }
}