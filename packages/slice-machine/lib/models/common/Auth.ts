/** Status Auth routes SM API contract */

export type CheckAuthStatusResponse = {
  status: "error" | "ok" | "pending";
  userId?: string;
};
