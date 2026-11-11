import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Plus,
} from "lucide-react"
import { ServiceRequest } from "./types"

function statusIcon(status: ServiceRequest["status"]) {
  if (status === "Resolved") return CheckCircle2
  if (status === "Awaiting customer") return AlertCircle
  return Clock3
}

export default function ReportedIssuesScreen({
  requests,
  onBack,
  onSelect,
  onReportAnother,
}: {
  requests: ServiceRequest[]
  onBack: () => void
  onSelect: (request: ServiceRequest) => void
  onReportAnother: () => void
}) {
  const openCount = requests.filter(
    (request) => request.status !== "Resolved",
  ).length
  const resolvedCount = requests.length - openCount

  return (
    <div className="screen-stack reported-issues-screen">
      <header className="report-screen-header">
        <button
          type="button"
          className="icon-button"
          onClick={onBack}
          aria-label="Go back"
        >
          <ChevronRight
            className="report-back-icon"
            aria-hidden="true"
            size={21}
          />
        </button>
        <div>
          <span className="eyebrow">Service requests</span>
          <h1>Reported issues</h1>
          <p>Review every water issue reported from this account.</p>
        </div>
      </header>

      <section className="reported-issues-summary" aria-label="Issue summary">
        <div>
          <strong>{requests.length}</strong>
          <span>Total reports</span>
        </div>
        <div>
          <strong>{openCount}</strong>
          <span>Open</span>
        </div>
        <div>
          <strong>{resolvedCount}</strong>
          <span>Resolved</span>
        </div>
      </section>

      <section>
        <div className="report-section-heading">
          <span>
            <FileText aria-hidden="true" size={15} />
          </span>
          <div>
            <h2>All reports</h2>
            <p>Most recently submitted first</p>
          </div>
        </div>
        <div className="reported-issues-list">
          {requests.map((request) => {
            const StatusIcon = statusIcon(request.status)
            const evidenceCount = request.intake?.evidence.length ?? 0
            return (
              <button
                type="button"
                key={request.id}
                onClick={() => onSelect(request)}
              >
                <span
                  className={`reported-issue-icon status-${request.status
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  <StatusIcon aria-hidden="true" size={20} />
                </span>
                <span className="reported-issue-copy">
                  <span>
                    <strong>{request.type}</strong>
                    <em>{request.status}</em>
                  </span>
                  <small>
                    {request.id} · {request.area}
                  </small>
                  <p>{request.description}</p>
                  <small>
                    {evidenceCount} evidence item
                    {evidenceCount === 1 ? "" : "s"} · {request.createdAt}
                  </small>
                </span>
                <ChevronRight aria-hidden="true" size={19} />
              </button>
            )
          })}
        </div>
      </section>

      <button
        className="button button-secondary button-full"
        type="button"
        onClick={onReportAnother}
      >
        <Plus aria-hidden="true" size={18} />
        Report another issue
      </button>
    </div>
  )
}
