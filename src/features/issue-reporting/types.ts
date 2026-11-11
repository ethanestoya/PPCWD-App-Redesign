export type RequestStatus = "New" | "Assigned" | "In progress" | "Awaiting customer" | "Resolved"

export type RequestPriority = "Normal" | "High" | "Urgent"

export interface RequestEvidence {
  id: string
  kind: "image" | "audio"
  name: string
  mimeType: string
  previewUrl?: string
  durationSeconds?: number
}

export interface RequestLocation {
  label: string
  barangay: string
  latitude?: number
  longitude?: number
  precisionShared: boolean
}

export interface AdvisoryMatch {
  id: string
  title: string
}

export interface MultimodalIntake {
  source: "consumer-multimodal"
  transcript?: string
  typedDescription?: string
  evidence: RequestEvidence[]
  location: RequestLocation
  observations: string[]
  suggestedType: string
  suggestedPriority: RequestPriority
  priorityRationale: string
  confidence: "high" | "medium" | "low"
  needsMoreDetail: boolean
  advisoryMatch?: AdvisoryMatch
  provenance: "Prototype analysis"
  consentedAt: string
}

export interface ServiceRequest {
  id: string
  accountNumber: string
  consumer: string
  type: string
  area: string
  priority: RequestPriority
  status: RequestStatus
  assignee: string
  createdAt: string
  description: string
  notes: string[]
  intake?: MultimodalIntake
}

export interface IssueReportDraft {
  category: string
  typedDescription: string
  transcript: string
  photo?: RequestEvidence
  audio?: RequestEvidence
  usedDemoEvidence: boolean
  locationMode: "service" | "nearby"
  alternateLocation: string
  sharedLocation?: RequestLocation
}

export interface MultimodalAnalysisInput {
  draft: IssueReportDraft
}

export interface MultimodalAnalysisResult {
  transcript: string
  language: "English" | "Filipino / English"
  suggestedType: string
  summary: string
  observations: string[]
  suggestedPriority: RequestPriority
  priorityRationale: string
  confidence: "high" | "medium" | "low"
  needsMoreDetail: boolean
  advisoryMatch?: AdvisoryMatch
  provenance: "Prototype analysis"
}

export interface MultimodalAnalyzer {
  analyze(input: MultimodalAnalysisInput): Promise<MultimodalAnalysisResult>
}

export type LocationResult = { ok: true; location: RequestLocation } | {
  ok: false
  reason: "denied" | "unavailable" | "unsupported"
}

export interface LocationProvider {
  getCurrentLocation(): Promise<LocationResult>
}
