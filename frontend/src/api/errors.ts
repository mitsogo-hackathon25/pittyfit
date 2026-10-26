import axios from 'axios';

function flattenFieldErrors(data: Record<string, unknown>): string[] {
  return Object.entries(data).flatMap(([field, value]) => {
    if (Array.isArray(value)) {
      return value.map((item) => (field === 'detail' ? String(item) : `${field}: ${item}`));
    }
    if (value && typeof value === 'object') {
      return flattenFieldErrors(value as Record<string, unknown>);
    }
    return [`${field}: ${String(value)}`];
  });
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 401) {
    return 'Your session expired. Log in again as an admin user.';
  }
  if (status === 403) {
    return 'Admin access required. Use a staff/superuser account.';
  }
  if (status === 413) {
    return (
      'Upload blocked by the server (HTTP 413): the request body is larger than nginx allows (often 1MB). ' +
      'Deploy the latest admin build (uploads one image per request). On the VPS, also set client_max_body_size 10M; in server and location /api/, then sudo nginx -t && sudo systemctl reload nginx.'
    );
  }
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (data && typeof data === 'object') {
    const messages = flattenFieldErrors(data as Record<string, unknown>);
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }
  if (error.message === 'Network Error') {
    return 'Could not reach the API. Check VITE_API_URL and that the backend is running.';
  }

  return fallback;
}
