export type AdminRole = "staff" | "admin"

export type Capability = "consumers:view" | "consumers:note" | "billing:view" | "billing:request-adjustment" | "billing:approve" | "requests:manage" | "advisories:draft" | "advisories:publish" | "reports:view" | "reports:organization" | "team:manage" | "audit:view" | "settings:manage"

export type AdminScreen = "overview" | "consumers" | "consumer-detail" | "billing" | "requests" | "request-detail" | "advisories" | "advisory-editor" | "approvals" | "reports" | "team" | "audit" | "settings" | "profile"

export interface StaffUser {
  id: string
  name: string
  initials: string
  role: AdminRole
  title: string
  team: string
  status: "Active" | "Suspended"
  lastActive: string
}

export interface ConsumerRecord {
  id: string
  name: string
  accountNumber: string
  meterNumber: string
  address: string
  barangay: string
  mobile: string
  status: "Active" | "For disconnection" | "Disconnected"
  balance: number
  consumption: number
  openRequests: number
}

export interface PaymentRecord {
  id: string
  accountNumber: string
  consumer: string
  reference: string
  channel: string
  amount: number
  submittedAt: string
  status: "Verified" | "Pending review" | "Flagged"
}

export type { ServiceRequest } from "../features/issue-reporting/types"

export interface ManagedAdvisory {
  id: string
  title: string
  areas: string
  schedule: string
  status: "Draft" | "In review" | "Scheduled" | "Active" | "Resolved"
  author: string
  severity: "Information" | "Service impact" | "Urgent"
  guidance: string
}

export interface ApprovalRequest {
  id: string
  type: "Payment correction" | "Bill adjustment" | "Advisory publication"
  title: string
  submittedBy: string
  submittedAt: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
}

export interface AuditEvent {
  id: string
  actor: string
  role: AdminRole
  action: string
  record: string
  timestamp: string
  result: "Success" | "Pending" | "Rejected"
}
