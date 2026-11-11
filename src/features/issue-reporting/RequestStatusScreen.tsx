import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Phone,
} from "lucide-react"
import { ServiceRequest } from "./types"

const stages = ["Submitted", "Assigned", "In progress", "Resolved"] as const

function completedStage(request: ServiceRequest) {
  if (request.status === "Resolved") return 3
  if (
    request.status === "In progress" ||
    request.status === "Awaiting customer"
  )
    return 2
  if (request.status === "Assigned") return 1
  return 0
}

export default function RequestStatusScreen({
  request,
  confirmation = false,
  onBack,
  onHome,
}: {
  request: ServiceRequest
  confirmation?: boolean
  onBack: () => void
  onHome: () => void
}) {
  const active = completedStage(request)
  const evidenceCount = request.intake?.evidence.length ?? 0

  if (confirmation) {
    return (
      <div className="report-success">
        <div className="report-success-icon">
          <CheckCircle2 aria-hidden="true" size={36} />
        </div>
        <span className="eyebrow">Report submitted</span>
        <h1>PPCWD staff will review your concern.</h1>
        <p>
          Your evidence and suggested request details were sent for human
          review. Keep your reference for follow-up.
        </p>
        <div className="report-reference">
          <span>Service request</span>
          <strong>{request.id}</strong>
          <dl>
            <div>
              <dt>Type</dt>
              <dd>{request.type}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>{request.area}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{request.status}</dd>
            </div>
          </dl>
        </div>
        <div className="report-success-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={onBack}
          >
            Track request <ChevronRight aria-hidden="true" size={18} />
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={onHome}
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-stack request-status-screen">
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
          <span className="eyebrow">{request.id}</span>
          <h1>Request status</h1>
        </div>
      </header>

      {request.status === "Awaiting customer" ? (
        <div className="alert alert-warning" role="status">
          <AlertCircle aria-hidden="true" size={20} />
          <div>
            <strong>PPCWD needs more information</strong>
            <p>Contact the service desk and provide your request reference.</p>
          </div>
        </div>
      ) : null}

      <section className="request-status-hero">
        <span className="request-status-icon">
          <Clock3 aria-hidden="true" size={22} />
        </span>
        <div>
          <span>Current status</span>
          <strong>{request.status}</strong>
          <p>Last updated in this prototype session</p>
        </div>
      </section>

      <section className="surface-card">
        <h2>Progress</h2>
        <ol className="request-timeline">
          {stages.map((stage, index) => (
            <li className={index <= active ? "complete" : ""} key={stage}>
              <span>{index <= active ? <Check size={14} /> : index + 1}</span>
              <div>
                <strong>{stage}</strong>
                <small>
                  {index === 0
                    ? "Report received for review"
                    : index === active
                      ? "Current step"
                      : "Not started"}
                </small>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="surface-card request-summary-card">
        <div>
          <FileText aria-hidden="true" size={20} />
          <h2>Submitted report</h2>
        </div>
        <strong>{request.type}</strong>
        <p>{request.description}</p>
        <span>
          {evidenceCount} evidence item{evidenceCount === 1 ? "" : "s"} ·{" "}
          {request.area}
        </span>
      </section>

      <a
        className="button button-secondary report-call-action"
        href="tel:+63484332408"
      >
        <Phone aria-hidden="true" size={18} />
        Call PPCWD for urgent follow-up
      </a>
    </div>
  )
}
