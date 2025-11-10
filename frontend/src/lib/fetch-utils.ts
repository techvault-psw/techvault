import { API_URL } from "./api-url";

interface FetchConfig extends Omit<RequestInit, 'body' | 'method'> {
  body?: unknown;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

async function fetchWrapper<T = unknown>(
  endpoint: string,
  { body, ...customConfig }: FetchConfig = {}
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const url = API_URL + (endpoint.startsWith('/') ? endpoint : `/${endpoint}`)
    const response = await fetch(url, config)
    
    if (response.ok) {
      const data = await response.json()
      return data as T
    }
    console.log(await response.json())
    throw new Error("Ocorreu um erro inesperado, aguarde e tente novamente.")
  } catch (err) {
    const error = err as Error;
    return Promise.reject(error.message ? error.message : "Ocorreu um erro inesperado, aguarde e tente novamente.")
  }
}

export async function httpGet<T = unknown>(
  endpoint: string,
  customConfig: Omit<FetchConfig, 'body' | 'method'> = {}
): Promise<T> {
  return fetchWrapper<T>(endpoint, { ...customConfig, method: 'GET' })
}

export async function httpPost<T = unknown>(
  endpoint: string,
  body: unknown,
  customConfig: Omit<FetchConfig, 'body' | 'method'> = {}
): Promise<T> {
  return fetchWrapper<T>(endpoint, { body, ...customConfig, method: 'POST' })
}

export async function httpPut<T = unknown>(
  endpoint: string,
  body: unknown,
  customConfig: Omit<FetchConfig, 'body' | 'method'> = {}
): Promise<T> {
  return fetchWrapper<T>(endpoint, { body, ...customConfig, method: 'PUT' })
}

export async function httpDelete<T = unknown>(
  endpoint: string,
  customConfig: Omit<FetchConfig, 'body' | 'method'> = {}
): Promise<T> {
  return fetchWrapper<T>(endpoint, { ...customConfig, method: 'DELETE' })
}

export async function httpPatch<T = unknown>(
  endpoint: string,
  body: unknown,
  customConfig: Omit<FetchConfig, 'body' | 'method'> = {}
): Promise<T> {
  return fetchWrapper<T>(endpoint, { body, ...customConfig, method: 'PATCH' })
}