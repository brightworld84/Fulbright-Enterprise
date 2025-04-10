// lib/queryClient.ts

export async function apiRequest(
  method: string,
  url: string,
  body?: any
): Promise<any> {
  // This is a simplified fetch wrapper for Expo
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }

  return await response.json();
}
