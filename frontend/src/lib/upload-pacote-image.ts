import { API_URL } from "./api-url";

export async function uploadPacoteImage(imageUrl: string): Promise<{ url: string | null }> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File(
    [blob],
    'pacote-image.jpg',
    { type: blob.type }
  );

  const formData = new FormData();  
  formData.append('file', file);

  try {
    const uploadResponse = await fetch(`${API_URL}/pacotes/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const data = await uploadResponse.json() as {
      url: string
    } | {
      success: boolean
      message: string
    };

    return {
      url: 'url' in data ? data.url : null
    }
  } catch {
    return {
      url: null
    }
  }
}