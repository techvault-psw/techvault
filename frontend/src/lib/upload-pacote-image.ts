import { API_URL } from "./api-url";

let getState: (() => import("@/redux/root-reducer").RootState) | null = null;

export function configureUploadAuth(storeGetState: () => import("@/redux/root-reducer").RootState) {
  getState = storeGetState;
}

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

  const token = getState?.().clienteReducer.token;
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const uploadResponse = await fetch(`${API_URL}/pacotes/upload-image`, {
      method: 'POST',
      body: formData,
      headers
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