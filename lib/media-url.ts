export function getMediaDisplayUrl(media: {
  file_url: string;
  storage_file_id?: string | null;
}): string | null {
  if (media.storage_file_id) {
    return `/api/admin/media/file/${media.storage_file_id}`;
  }
  if (media.file_url.startsWith("http://") || media.file_url.startsWith("https://")) {
    return media.file_url;
  }
  return null;
}

export function getMediaCanonicalUrl(media: { file_url: string }): string {
  return media.file_url;
}
