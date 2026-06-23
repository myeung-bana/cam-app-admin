import { toast } from "sonner";

export const SUCCESS_MESSAGES = {
  clientCreated: "Client created successfully",
  clientUpdated: "Client saved successfully",
  clientArchived: "Client archived",
  eventCreated: "Event created successfully",
  eventUpdated: "Event saved successfully",
  taxonomyCreated: "Taxonomy item created successfully",
  taxonomyUpdated: "Changes saved successfully",
  adminUserCreated: "Admin user invited successfully",
  adminUserUpdated: "Admin user saved successfully",
} as const;

export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;

export const FLASH_QUERY_PARAM = "flash";

export function isSuccessMessageKey(value: string): value is SuccessMessageKey {
  return value in SUCCESS_MESSAGES;
}

export function showSuccessToast(key: SuccessMessageKey): void {
  toast.success(SUCCESS_MESSAGES[key]);
}

export function getSuccessMessage(key: SuccessMessageKey): string {
  return SUCCESS_MESSAGES[key];
}
