export type LocalizedText = { en: string; ar: string };

export type PortalNotificationCategory =
  | "platform"
  | "student"
  | "administration"
  | "request";

export interface PortalNotification {
  id: string;
  category: PortalNotificationCategory;
  title: LocalizedText;
  message: LocalizedText;
  createdAt: string;
  read: boolean;
  important: boolean;
  emailSent: boolean;
  link?: string;
}

export type AdminRequestKind = "request" | "feedback";
export type AdminRequestCategory =
  | "technical"
  | "account"
  | "content"
  | "students"
  | "other";
export type AdminRequestStatus =
  | "submitted"
  | "inReview"
  | "resolved"
  | "rejected";

export interface AdminRequestResponse {
  id: string;
  author: LocalizedText;
  message: LocalizedText;
  createdAt: string;
}

export interface AdminRequest {
  id: string;
  kind: AdminRequestKind;
  category: AdminRequestCategory;
  subject: string;
  message: string;
  status: AdminRequestStatus;
  createdAt: string;
  updatedAt: string;
  responses: AdminRequestResponse[];
}
