import "server-only";
import { randomUUID } from "crypto";

export function getNhostAdminSecret(): string {
  const secret = process.env.NHOST_ADMIN_SECRET;
  if (!secret || secret === "your-hasura-admin-secret") {
    throw new Error("NHOST_ADMIN_SECRET is not configured");
  }
  return secret;
}

export function getStorageBucket(): string {
  return process.env.NHOST_STORAGE_BUCKET ?? "cam-bucket";
}

export function getNhostStorageBaseUrl(): string {
  const subdomain = process.env.NHOST_SUBDOMAIN;
  const region = process.env.NHOST_REGION;
  if (!subdomain || !region) {
    throw new Error("NHOST_SUBDOMAIN and NHOST_REGION are required");
  }
  return `https://${subdomain}.storage.${region}.nhost.run/v1`;
}

export function buildNhostFileUrl(fileId: string): string {
  return `${getNhostStorageBaseUrl()}/files/${fileId}`;
}

export function isNhostStorageConfigured(): boolean {
  return Boolean(
    process.env.NHOST_SUBDOMAIN &&
      process.env.NHOST_REGION &&
      process.env.NHOST_ADMIN_SECRET &&
      process.env.NHOST_ADMIN_SECRET !== "your-hasura-admin-secret"
  );
}

interface UploadedFile {
  id: string;
  name: string;
  mimeType?: string;
}

interface UploadResponse {
  processedFiles?: UploadedFile[];
}

export async function postMultipartToNhostStorage(
  fileName: string,
  fileBytes: Buffer,
  mimeType: string
): Promise<UploadedFile> {
  const boundary = `----NhostFormBoundary${randomUUID().replace(/-/g, "")}`;
  const bucket = getStorageBucket();
  const adminSecret = getNhostAdminSecret();
  const storageUrl = `${getNhostStorageBaseUrl()}/files`;

  const preamble = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="bucket-id"\r\n\r\n` +
      `${bucket}\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file[]"; filename="${fileName}"\r\n` +
      `Content-Type: ${mimeType}\r\n\r\n`
  );
  const epilogue = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([preamble, fileBytes, epilogue]);

  const response = await fetch(storageUrl, {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": String(body.length),
      "x-hasura-admin-secret": adminSecret,
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Storage upload failed (${response.status}): ${text}`);
  }

  const json = (await response.json()) as UploadResponse;
  const uploaded = json.processedFiles?.[0];
  if (!uploaded?.id) {
    throw new Error("Storage upload returned no file id");
  }
  return uploaded;
}

export async function fetchNhostStorageFile(fileId: string): Promise<Response> {
  const adminSecret = getNhostAdminSecret();
  const url = `${getNhostStorageBaseUrl()}/files/${fileId}`;
  return fetch(url, {
    headers: { "x-hasura-admin-secret": adminSecret },
  });
}
