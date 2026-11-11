import { AdminRole, Capability } from "./types"

const roleCapabilities: Record<AdminRole, Capability[]> = {
  staff: [
    "consumers:view",
    "consumers:note",
    "billing:view",
    "billing:request-adjustment",
    "requests:manage",
    "advisories:draft",
    "reports:view",
    "audit:view",
  ],
  admin: [
    "consumers:view",
    "consumers:note",
    "billing:view",
    "billing:request-adjustment",
    "billing:approve",
    "requests:manage",
    "advisories:draft",
    "advisories:publish",
    "reports:view",
    "reports:organization",
    "team:manage",
    "audit:view",
    "settings:manage",
  ],
}

export function can(role: AdminRole, capability: Capability) {
  return roleCapabilities[role].includes(capability)
}

export function capabilitySummary(role: AdminRole) {
  if (role === "admin") {
    return "Full operational access, approvals, publishing, team management, and settings."
  }
  return "Consumer assistance, billing review, service requests, and advisory drafting."
}
