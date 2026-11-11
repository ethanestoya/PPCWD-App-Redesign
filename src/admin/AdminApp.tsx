import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Download,
  Droplets,
  Eye,
  EyeOff,
  FileClock,
  FileText,
  Filter,
  Gauge,
  Home,
  Info,
  LayoutGrid,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  LucideIcon,
  Menu,
  MessageSquare,
  Mic,
  MapPin,
  MoreHorizontal,
  PencilLine,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  WalletCards,
  X,
  XCircle,
} from "lucide-react"
import { FormEvent, ReactNode, useMemo, useState } from "react"
import {
  initialAdvisories,
  initialApprovals,
  initialAuditEvents,
  initialPayments,
  initialRequests,
  consumers,
  team as initialTeam,
} from "./mockData"
import { can, capabilitySummary } from "./permissions"
import {
  AdminRole,
  AdminScreen,
  ApprovalRequest,
  AuditEvent,
  ConsumerRecord,
  ManagedAdvisory,
  PaymentRecord,
  ServiceRequest,
  StaffUser,
} from "./types"
import "../admin.css"

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

type ModalState = {
  kind: "approval"
  item: ApprovalRequest
  decision: "Approved" | "Rejected"
} | { kind: "adjustment"; payment: PaymentRecord } | {
  kind: "team"
  member: StaffUser
} | { kind: "signout" } | null

interface Session {
  role: AdminRole
  user: StaffUser
}

function OpsButton({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  icon?: LucideIcon
}) {
  return (
    <button
      className={`ops-button ops-button-${variant} ${className}`}
      type="button"
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" size={17} /> : null}
      <span>{children}</span>
    </button>
  )
}

function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase().replace(/ /g, "-")
  const Icon = [
    "active",
    "verified",
    "approved",
    "resolved",
    "success",
  ].includes(normalized)
    ? CheckCircle2
    : ["urgent", "flagged", "rejected", "disconnected"].includes(normalized)
      ? AlertTriangle
      : Clock3
  return (
    <span className={`ops-status ops-status-${normalized}`}>
      <Icon aria-hidden="true" size={13} />
      {value}
    </span>
  )
}

function OpsCard({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`ops-card ${className}`}>{children}</div>
}

function PageTitle({
  eyebrow,
  title,
  description,
  actions,
  onBack,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  onBack?: () => void
}) {
  return (
    <header className="ops-page-title">
      {onBack ? (
        <button
          className="ops-round-button"
          type="button"
          onClick={onBack}
          aria-label="Go back"
        >
          <ArrowLeft aria-hidden="true" size={20} />
        </button>
      ) : null}
      <div>
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="ops-title-actions">{actions}</div> : null}
    </header>
  )
}

function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="ops-search">
      <span className="sr-only">Search</span>
      <Search aria-hidden="true" size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X aria-hidden="true" size={16} />
        </button>
      ) : null}
    </label>
  )
}

function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: LucideIcon
  title: string
  message: string
}) {
  return (
    <div className="ops-empty">
      <span>
        <Icon aria-hidden="true" size={24} />
      </span>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  )
}

function StaffSignIn({
  onSignIn,
  onBack,
}: {
  onSignIn: (role: AdminRole) => void
  onBack: () => void
}) {
  const [staffId, setStaffId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!staffId.trim() || !password.trim()) {
      setError("Enter your staff ID and password.")
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (staffId.toLowerCase() === "invalid") {
        setError(
          "We couldn’t verify those credentials. Try a demo account instead.",
        )
      } else {
        onSignIn("staff")
      }
    }, 600)
  }

  return (
    <div className="ops-signin">
      <section className="ops-signin-brand">
        <button type="button" onClick={onBack} className="ops-back-consumer">
          <ArrowLeft aria-hidden="true" size={17} />
          Consumer app
        </button>
        <div className="ops-signin-mark">
          <img src="/assets/ppcwd-seal.png" alt="PPCWD seal" />
        </div>
        <span className="ops-eyebrow">Authorized personnel portal</span>
        <h1>Serve the city with clarity and speed.</h1>
        <p>
          Manage consumer concerns, review account activity, coordinate service
          operations, and publish trusted updates.
        </p>
        <div className="ops-trust-list">
          <span>
            <ShieldCheck aria-hidden="true" size={18} /> Role-based access
          </span>
          <span>
            <Activity aria-hidden="true" size={18} /> Auditable actions
          </span>
          <span>
            <Droplets aria-hidden="true" size={18} /> PPCWD operations
          </span>
        </div>
      </section>
      <section className="ops-signin-panel">
        <div className="ops-signin-form">
          <div>
            <span className="ops-eyebrow">Staff workspace</span>
            <h2>Sign in to continue</h2>
            <p>
              This interactive prototype does not authenticate real staff
              accounts.
            </p>
          </div>
          {error ? (
            <div className="ops-alert ops-alert-danger" role="alert">
              <AlertTriangle aria-hidden="true" size={19} />
              <span>{error}</span>
            </div>
          ) : null}
          <form onSubmit={submit} noValidate>
            <label className="ops-field">
              <span>Staff ID or email</span>
              <div>
                <UserRound aria-hidden="true" size={18} />
                <input
                  value={staffId}
                  onChange={(event) => setStaffId(event.target.value)}
                  placeholder="e.g. ST-014"
                  autoComplete="username"
                />
              </div>
            </label>
            <label className="ops-field">
              <span>Password</span>
              <div>
                <LockKeyhole aria-hidden="true" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            <OpsButton
              type="submit"
              className="ops-full-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={17} />
                  Verifying…
                </>
              ) : (
                "Sign in"
              )}
            </OpsButton>
          </form>
          <div className="ops-demo-divider">
            <span>Or preview a role</span>
          </div>
          <div className="ops-demo-grid">
            <button type="button" onClick={() => onSignIn("staff")}>
              <span className="ops-role-icon">
                <UserRound aria-hidden="true" size={20} />
              </span>
              <span>
                <strong>Continue as Staff</strong>
                <small>Customer service workflow</small>
              </span>
              <ChevronRight aria-hidden="true" size={18} />
            </button>
            <button type="button" onClick={() => onSignIn("admin")}>
              <span className="ops-role-icon ops-role-icon-admin">
                <ShieldCheck aria-hidden="true" size={20} />
              </span>
              <span>
                <strong>Continue as Admin</strong>
                <small>Full operations access</small>
              </span>
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

const navigation: {
  id: AdminScreen
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "consumers", label: "Consumers", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "requests", label: "Service requests", icon: ListChecks },
  { id: "advisories", label: "Advisories", icon: Bell },
  {
    id: "approvals",
    label: "Approvals",
    icon: ClipboardCheck,
    adminOnly: true,
  },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "team", label: "Team & roles", icon: ShieldCheck, adminOnly: true },
  { id: "audit", label: "Audit log", icon: FileClock },
  { id: "settings", label: "Settings", icon: Settings, adminOnly: true },
]

function AdminShell({
  session,
  screen,
  pendingApprovals,
  children,
  onNavigate,
  onSignOut,
}: {
  session: Session
  screen: AdminScreen
  pendingApprovals: number
  children: ReactNode
  onNavigate: (screen: AdminScreen) => void
  onSignOut: () => void
}) {
  const [moreOpen, setMoreOpen] = useState(false)
  const permittedNavigation = navigation.filter(
    (item) => !item.adminOnly || session.role === "admin",
  )
  const mobilePrimary: AdminScreen[] = ["overview", "consumers", "requests"]
  const currentLabel =
    navigation.find((item) => item.id === screen)?.label ??
    (screen.includes("detail") ? "Record details" : "Operations")

  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <div className="ops-brand">
          <img src="/assets/ppcwd-seal.png" alt="PPCWD seal" />
          <div>
            <strong>PPCWD</strong>
            <span>Operations portal</span>
          </div>
        </div>
        <div className="ops-role-card">
          <span className={session.role === "admin" ? "admin" : ""}>
            {session.role === "admin" ? (
              <ShieldCheck size={16} />
            ) : (
              <UserRound size={16} />
            )}
            {session.role}
          </span>
          <small>{session.user.title}</small>
        </div>
        <nav aria-label="Staff portal">
          {permittedNavigation.map((item) => {
            const Icon = item.icon
            const active =
              screen === item.id ||
              (item.id === "consumers" && screen === "consumer-detail") ||
              (item.id === "requests" && screen === "request-detail") ||
              (item.id === "advisories" && screen === "advisory-editor")
            return (
              <button
                key={item.id}
                type="button"
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(item.id)}
              >
                <Icon aria-hidden="true" size={19} />
                <span>{item.label}</span>
                {item.id === "approvals" && pendingApprovals ? (
                  <em>{pendingApprovals}</em>
                ) : null}
              </button>
            )
          })}
        </nav>
        <button
          className="ops-sidebar-profile"
          type="button"
          onClick={() => onNavigate("profile")}
        >
          <span>{session.user.initials}</span>
          <div>
            <strong>{session.user.name}</strong>
            <small>{session.user.id}</small>
          </div>
          <MoreHorizontal aria-hidden="true" size={18} />
        </button>
      </aside>

      <div className="ops-main">
        <header className="ops-mobile-header">
          <div className="ops-mobile-brand">
            <img src="/assets/ppcwd-seal.png" alt="PPCWD seal" />
            <div>
              <strong>{currentLabel}</strong>
              <span>
                {session.role === "admin"
                  ? "Admin workspace"
                  : "Staff workspace"}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Open profile"
            onClick={() => onNavigate("profile")}
          >
            {session.user.initials}
          </button>
        </header>
        <div className="ops-desktop-toolbar">
          <div className="ops-global-search">
            <Search aria-hidden="true" size={18} />
            <span>Search account, request, or payment</span>
            <kbd>⌘ K</kbd>
          </div>
          <button
            type="button"
            className="ops-notification-button"
            aria-label="Notifications"
          >
            <Bell aria-hidden="true" size={19} />
            {pendingApprovals ? <span>{pendingApprovals}</span> : null}
          </button>
        </div>
        <main className="ops-content">{children}</main>
      </div>

      <nav className="ops-mobile-nav" aria-label="Staff mobile navigation">
        {mobilePrimary.map((id) => {
          const item = navigation.find((entry) => entry.id === id)!
          const Icon = item.icon
          const active =
            screen === id ||
            (id === "consumers" && screen === "consumer-detail") ||
            (id === "requests" && screen === "request-detail")
          return (
            <button
              key={id}
              type="button"
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
              onClick={() => onNavigate(id)}
            >
              <Icon aria-hidden="true" size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          className={moreOpen ? "active" : ""}
          onClick={() => setMoreOpen(true)}
        >
          <Menu aria-hidden="true" size={20} />
          <span>More</span>
        </button>
      </nav>

      {moreOpen ? (
        <div
          className="ops-sheet-backdrop"
          role="presentation"
          onMouseDown={() => setMoreOpen(false)}
        >
          <section
            className="ops-more-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ops-more-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ops-sheet-handle" />
            <div className="ops-sheet-title">
              <div>
                <span className="ops-eyebrow">PPCWD operations</span>
                <h2 id="ops-more-title">More tools</h2>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="ops-more-list">
              {permittedNavigation
                .filter((item) => !mobilePrimary.includes(item.id))
                .map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMoreOpen(false)
                        onNavigate(item.id)
                      }}
                    >
                      <span>
                        <Icon aria-hidden="true" size={19} />
                      </span>
                      <strong>{item.label}</strong>
                      {item.id === "approvals" && pendingApprovals ? (
                        <em>{pendingApprovals}</em>
                      ) : (
                        <ChevronRight aria-hidden="true" size={18} />
                      )}
                    </button>
                  )
                })}
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false)
                  onNavigate("profile")
                }}
              >
                <span>
                  <UserRound aria-hidden="true" size={19} />
                </span>
                <strong>Profile & access</strong>
                <ChevronRight aria-hidden="true" size={18} />
              </button>
              <button type="button" className="danger" onClick={onSignOut}>
                <span>
                  <LogOut aria-hidden="true" size={19} />
                </span>
                <strong>Sign out</strong>
                <ChevronRight aria-hidden="true" size={18} />
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "blue",
  trend = "",
  trendDirection = "up",
}: {
  label: string
  value: string | number
  note: string
  icon: LucideIcon
  tone?: "blue" | "cyan" | "amber" | "red"
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
}) {
  const TrendIcon =
    trendDirection === "down" ? ArrowDownRight : ArrowUpRight
  return (
    <OpsCard className="ops-stat-card">
      <div className="ops-stat-top">
        <span className={`ops-stat-icon ${tone}`}>
          <Icon aria-hidden="true" size={19} />
        </span>
        {trend ? (
          <span className={`ops-stat-trend ${trendDirection}`}>
            {trendDirection !== "neutral" ? (
              <TrendIcon aria-hidden="true" size={12} />
            ) : null}
            {trend}
          </span>
        ) : null}
      </div>
      <div className="ops-stat-body">
        <span className="ops-stat-label">{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </OpsCard>
  )
}

function OverviewScreen({
  session,
  requests,
  payments,
  approvals,
  audit,
  go,
}: {
  session: Session
  requests: ServiceRequest[]
  payments: PaymentRecord[]
  approvals: ApprovalRequest[]
  audit: AuditEvent[]
  go: (screen: AdminScreen) => void
}) {
  const pendingApprovals = approvals.filter(
    (item) => item.status === "Pending",
  ).length
  const myRequests = requests.filter(
    (item) =>
      item.status !== "Resolved" &&
      (session.role === "admin" ||
        item.assignee === session.user.name ||
        item.status === "New"),
  )
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow={`Good morning, ${session.user.name.split(" ")[0]}`}
        title={
          session.role === "admin" ? "Operations overview" : "Your service desk"
        }
        description={
          session.role === "admin"
            ? "Monitor service delivery, approvals, and team activity."
            : "Focus on consumers and requests that need your attention."
        }
        actions={
          <OpsButton icon={Search} onClick={() => go("consumers")}>
            Find consumer
          </OpsButton>
        }
      />
      <section className="ops-stat-grid" aria-label="Operations summary">
        <StatCard
          label={
            session.role === "admin" ? "Open requests" : "My open requests"
          }
          value={myRequests.length}
          note="2 need attention today"
          icon={ListChecks}
          tone="blue"
          trend="+4 today"
        />
        <StatCard
          label="Payments to review"
          value={payments.filter((item) => item.status !== "Verified").length}
          note="Includes one flagged record"
          icon={WalletCards}
          tone="cyan"
          trend="2 new"
        />
        <StatCard
          label="Service advisories"
          value="2"
          note="1 scheduled, 1 in review"
          icon={Bell}
          tone="amber"
          trend="1 active"
        />
        {session.role === "admin" ? (
          <StatCard
            label="Pending approvals"
            value={pendingApprovals}
            note="Oldest waiting 1 hour"
            icon={ClipboardCheck}
            tone="red"
            trend="1h oldest"
            trendDirection="neutral"
          />
        ) : (
          <StatCard
            label="Overdue follow-ups"
            value="6"
            note="Across 3 service areas"
            icon={Clock3}
            tone="red"
            trend="3 areas"
            trendDirection="down"
          />
        )}
      </section>

      <div className="ops-dashboard-grid">
        <OpsCard className="ops-priority-card">
          <div className="ops-section-heading">
            <div>
              <span className="ops-eyebrow">Live queue</span>
              <h2>Needs attention</h2>
            </div>
            <button type="button" onClick={() => go("requests")}>
              View all <ArrowLeft className="ops-arrow-forward" size={16} />
            </button>
          </div>
          <div className="ops-priority-list">
            {myRequests.slice(0, 3).map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => go("requests")}
              >
                <span
                  className={`ops-priority-dot ${request.priority.toLowerCase()}`}
                />
                <span>
                  <strong>{request.type}</strong>
                  <small>
                    {request.id} · {request.area}
                  </small>
                </span>
                <StatusPill value={request.priority} />
                <ChevronRight aria-hidden="true" size={17} />
              </button>
            ))}
          </div>
        </OpsCard>

        <OpsCard className="ops-collection-card">
          <div className="ops-section-heading">
            <div>
              <span className="ops-eyebrow">November to date</span>
              <h2>Collections</h2>
            </div>
            <StatusPill value="Active" />
          </div>
          <div className="ops-collection-total">
            <strong>₱2.84M</strong>
            <span>+8.2% from October</span>
          </div>
          <div
            className="ops-bar-chart"
            aria-label="Collections increased over the last seven days"
          >
            {[38, 56, 48, 64, 72, 58, 86].map((height, index) => (
              <span
                key={index}
                style={{ "--bar-height": `${height}%` } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="ops-chart-labels">
            <span>Nov 8</span>
            <span>Nov 14</span>
          </div>
        </OpsCard>

        <OpsCard className="ops-activity-card">
          <div className="ops-section-heading">
            <div>
              <span className="ops-eyebrow">Latest actions</span>
              <h2>Recent activity</h2>
            </div>
            <button type="button" onClick={() => go("audit")}>
              Audit log <ArrowLeft className="ops-arrow-forward" size={16} />
            </button>
          </div>
          <div className="ops-activity-list">
            {audit.slice(0, 4).map((event) => (
              <div key={event.id}>
                <span className="ops-activity-avatar">
                  {event.actor
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <strong>{event.action}</strong>
                  <p>
                    {event.actor} · {event.record}
                  </p>
                </div>
                <time>{event.timestamp.split(", ")[1]}</time>
              </div>
            ))}
          </div>
        </OpsCard>
      </div>
    </div>
  )
}

function ConsumersScreen({
  onSelect,
}: {
  onSelect: (consumer: ConsumerRecord) => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const filtered = consumers.filter((consumer) => {
    const matchesQuery = [
      consumer.name,
      consumer.accountNumber,
      consumer.meterNumber,
      consumer.address,
    ].some((value) => value.toLowerCase().includes(query.toLowerCase()))
    return matchesQuery && (filter === "All" || consumer.status === filter)
  })
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Consumer records"
        title="Consumers"
        description="Search accounts and review service history."
        actions={
          <OpsButton variant="secondary" icon={Download}>
            Export list
          </OpsButton>
        }
      />
      <div className="ops-filter-bar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search account, meter, name, or address"
        />
        <div className="ops-filter-chips" aria-label="Filter by account status">
          {["All", "Active", "For disconnection", "Disconnected"].map(
            (item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <OpsButton variant="secondary" icon={SlidersHorizontal}>
          More filters
        </OpsButton>
      </div>
      <OpsCard className="ops-data-card">
        <div className="ops-result-header">
          <strong>{filtered.length} consumer accounts</strong>
          <span>Updated a few seconds ago</span>
        </div>
        {filtered.length ? (
          <>
            <div className="ops-table-wrap">
              <table className="ops-table">
                <caption className="sr-only">PPCWD consumer accounts</caption>
                <thead>
                  <tr>
                    <th>Consumer</th>
                    <th>Account / meter</th>
                    <th>Service area</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>
                      <span className="sr-only">Open record</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((consumer) => (
                    <tr key={consumer.id}>
                      <td>
                        <button
                          type="button"
                          className="ops-name-cell"
                          onClick={() => onSelect(consumer)}
                        >
                          <span>
                            {consumer.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>
                          <span>
                            <strong>{consumer.name}</strong>
                            <small>{consumer.mobile}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        <strong>{consumer.accountNumber}</strong>
                        <small>{consumer.meterNumber}</small>
                      </td>
                      <td>
                        <strong>{consumer.barangay}</strong>
                        <small>{consumer.address}</small>
                      </td>
                      <td>
                        <strong>{money.format(consumer.balance)}</strong>
                        <small>{consumer.openRequests} open request(s)</small>
                      </td>
                      <td>
                        <StatusPill value={consumer.status} />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="ops-row-action"
                          onClick={() => onSelect(consumer)}
                          aria-label={`Open ${consumer.name}`}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ops-mobile-cards">
              {filtered.map((consumer) => (
                <button
                  key={consumer.id}
                  type="button"
                  onClick={() => onSelect(consumer)}
                >
                  <span className="ops-mobile-card-top">
                    <span>
                      <strong>{consumer.name}</strong>
                      <small>Account {consumer.accountNumber}</small>
                    </span>
                    <StatusPill value={consumer.status} />
                  </span>
                  <span className="ops-mobile-card-meta">
                    <span>
                      Balance <strong>{money.format(consumer.balance)}</strong>
                    </span>
                    <span>
                      Area <strong>{consumer.barangay}</strong>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={Search}
            title="No consumers found"
            message="Try a different account number, name, address, or status."
          />
        )}
      </OpsCard>
    </div>
  )
}

function ConsumerDetailScreen({
  consumer,
  onBack,
  onCreateRequest,
  notify,
}: {
  consumer: ConsumerRecord
  onBack: () => void
  onCreateRequest: () => void
  notify: (message: string) => void
}) {
  const [tab, setTab] = useState("Overview")
  const [notes, setNotes] = useState([
    "Consumer requested SMS updates for future service interruptions.",
  ])
  const [note, setNote] = useState("")
  const tabs = ["Overview", "Bills", "Payments", "Requests", "Internal notes"]
  const addNote = () => {
    if (!note.trim()) return
    setNotes((items) => [note.trim(), ...items])
    setNote("")
    notify("Internal note added.")
  }
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow={`Account ${consumer.accountNumber}`}
        title={consumer.name}
        description={consumer.address}
        onBack={onBack}
        actions={
          <OpsButton icon={Plus} onClick={onCreateRequest}>
            Create request
          </OpsButton>
        }
      />
      <OpsCard className="ops-consumer-hero">
        <div className="ops-consumer-avatar">
          {consumer.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>
        <div>
          <span>Service account</span>
          <strong>{consumer.accountNumber}</strong>
          <small>{consumer.meterNumber}</small>
        </div>
        <div>
          <span>Current balance</span>
          <strong>{money.format(consumer.balance)}</strong>
          <small>{consumer.consumption} m³ this period</small>
        </div>
        <div>
          <span>Service status</span>
          <StatusPill value={consumer.status} />
          <small>{consumer.openRequests} open request(s)</small>
        </div>
      </OpsCard>
      <div className="ops-tabs" role="tablist" aria-label="Consumer details">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Overview" ? (
        <div className="ops-detail-grid">
          <OpsCard>
            <div className="ops-section-heading">
              <h2>Account information</h2>
              <StatusPill value={consumer.status} />
            </div>
            <dl className="ops-definition-list">
              <div>
                <dt>Account number</dt>
                <dd>{consumer.accountNumber}</dd>
              </div>
              <div>
                <dt>Meter number</dt>
                <dd>{consumer.meterNumber}</dd>
              </div>
              <div>
                <dt>Mobile</dt>
                <dd>{consumer.mobile}</dd>
              </div>
              <div>
                <dt>Service area</dt>
                <dd>{consumer.barangay}</dd>
              </div>
            </dl>
          </OpsCard>
          <OpsCard>
            <div className="ops-section-heading">
              <h2>Consumption trend</h2>
              <span className="ops-trend">+17%</span>
            </div>
            <div className="ops-consumption">
              <strong>{consumer.consumption} m³</strong>
              <span>Current billing period</span>
              <div>
                {[44, 62, 54, 72, 65, 82].map((height, index) => (
                  <i
                    key={index}
                    style={
                      { "--bar-height": `${height}%` } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          </OpsCard>
        </div>
      ) : tab === "Internal notes" ? (
        <OpsCard>
          <div className="ops-section-heading">
            <div>
              <h2>Internal notes</h2>
              <p>Visible only to authorized PPCWD personnel.</p>
            </div>
          </div>
          <div className="ops-note-composer">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add context for the next staff member…"
            />
            <OpsButton icon={Send} onClick={addNote}>
              Add note
            </OpsButton>
          </div>
          <div className="ops-note-list">
            {notes.map((item, index) => (
              <div key={`${item}-${index}`}>
                <span>AR</span>
                <div>
                  <strong>Ana Reyes</strong>
                  <p>{item}</p>
                  <small>{index === 0 ? "Just now" : "Nov 12, 2:18 PM"}</small>
                </div>
              </div>
            ))}
          </div>
        </OpsCard>
      ) : (
        <OpsCard>
          <EmptyState
            icon={
              tab === "Bills"
                ? ReceiptText
                : tab === "Payments"
                  ? CreditCard
                  : ListChecks
            }
            title={`${tab} for ${consumer.name}`}
            message={`Representative ${tab.toLowerCase()} records are available in the related operations workspace.`}
          />
        </OpsCard>
      )}
    </div>
  )
}

function BillingScreen({
  role,
  payments,
  onRequestAdjustment,
  notify,
}: {
  role: AdminRole
  payments: PaymentRecord[]
  onRequestAdjustment: (payment: PaymentRecord) => void
  notify: (message: string) => void
}) {
  const [filter, setFilter] = useState("All")
  const [query, setQuery] = useState("")
  const visible = payments.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter
    const matchesQuery = [
      item.consumer,
      item.accountNumber,
      item.reference,
      item.channel,
    ].some((value) => value.toLowerCase().includes(query.toLowerCase()))
    return matchesFilter && matchesQuery
  })
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Commercial services"
        title="Billing & payments"
        description="Review recent payment records and posting exceptions."
        actions={
          <OpsButton
            variant="secondary"
            icon={Download}
            onClick={() => notify("Demo CSV prepared.")}
          >
            Export CSV
          </OpsButton>
        }
      />
      <section className="ops-stat-grid ops-stat-grid-three">
        <StatCard
          label="Posted today"
          value="₱284K"
          note="186 transactions"
          icon={CheckCircle2}
        />
        <StatCard
          label="Pending review"
          value={
            payments.filter((item) => item.status === "Pending review").length
          }
          note="Within posting window"
          icon={Clock3}
          tone="amber"
        />
        <StatCard
          label="Flagged"
          value={payments.filter((item) => item.status === "Flagged").length}
          note="Needs manual review"
          icon={AlertTriangle}
          tone="red"
        />
      </section>
      <div className="ops-filter-bar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search payment reference or account"
        />
        <div className="ops-filter-chips">
          {["All", "Pending review", "Flagged", "Verified"].map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <OpsCard className="ops-data-card">
        <div className="ops-table-wrap">
          <table className="ops-table">
            <caption className="sr-only">Recent PPCWD payment records</caption>
            <thead>
              <tr>
                <th>Consumer</th>
                <th>Reference</th>
                <th>Channel</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <strong>{payment.consumer}</strong>
                    <small>{payment.accountNumber}</small>
                  </td>
                  <td>
                    <strong>{payment.reference}</strong>
                    <small>{payment.submittedAt}</small>
                  </td>
                  <td>{payment.channel}</td>
                  <td>
                    <strong>{money.format(payment.amount)}</strong>
                  </td>
                  <td>
                    <StatusPill value={payment.status} />
                  </td>
                  <td>
                    {payment.status !== "Verified" ? (
                      <OpsButton
                        variant="secondary"
                        onClick={() =>
                          role === "admin"
                            ? notify("Open Approvals to decide this record.")
                            : onRequestAdjustment(payment)
                        }
                      >
                        {role === "admin" ? "Review" : "Request correction"}
                      </OpsButton>
                    ) : (
                      <span className="ops-muted">No action needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ops-mobile-cards">
          {visible.map((payment) => (
            <div key={payment.id} className="ops-payment-mobile">
              <span className="ops-mobile-card-top">
                <span>
                  <strong>{payment.consumer}</strong>
                  <small>{payment.reference}</small>
                </span>
                <StatusPill value={payment.status} />
              </span>
              <span className="ops-mobile-card-meta">
                <span>
                  Amount <strong>{money.format(payment.amount)}</strong>
                </span>
                <span>
                  Channel <strong>{payment.channel}</strong>
                </span>
              </span>
              {payment.status !== "Verified" ? (
                <OpsButton
                  variant="secondary"
                  onClick={() =>
                    role === "admin"
                      ? notify("Open Approvals to decide this record.")
                      : onRequestAdjustment(payment)
                  }
                >
                  {role === "admin" ? "Review record" : "Request correction"}
                </OpsButton>
              ) : null}
            </div>
          ))}
        </div>
      </OpsCard>
    </div>
  )
}

function RequestsScreen({
  requests,
  onSelect,
  onCreate,
}: {
  requests: ServiceRequest[]
  onSelect: (request: ServiceRequest) => void
  onCreate: () => void
}) {
  const [status, setStatus] = useState("Open")
  const [query, setQuery] = useState("")
  const visible = requests.filter((request) => {
    const matchesStatus =
      status === "Open"
        ? request.status !== "Resolved"
        : status === "All"
          ? true
          : request.status === status
    const matchesQuery = [
      request.id,
      request.consumer,
      request.accountNumber,
      request.type,
      request.area,
      request.intake?.transcript ?? "",
      ...(request.intake?.observations ?? []),
    ].some((value) => value.toLowerCase().includes(query.toLowerCase()))
    return matchesStatus && matchesQuery
  })
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Customer care"
        title="Service requests"
        description="Triage, assign, and resolve consumer concerns."
        actions={
          <OpsButton icon={Plus} onClick={onCreate}>
            New request
          </OpsButton>
        }
      />
      <div className="ops-request-board">
        <div className="ops-filter-bar">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search request or account"
          />
          <div className="ops-filter-chips">
            {["Open", "New", "Assigned", "In progress", "Resolved", "All"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={status === item ? "active" : ""}
                  onClick={() => setStatus(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="ops-request-list">
          {visible.map((request) => (
            <button
              key={request.id}
              type="button"
              onClick={() => onSelect(request)}
            >
              <span
                className={`ops-request-priority ${request.priority.toLowerCase()}`}
              >
                {request.priority === "Urgent" ? (
                  <AlertTriangle size={18} />
                ) : (
                  <Gauge size={18} />
                )}
              </span>
              <span className="ops-request-main">
                <span>
                  <strong>{request.type}</strong>
                  <StatusPill value={request.priority} />
                </span>
                {request.intake ? (
                  <span className="ops-intake-meta">
                    <Sparkles aria-hidden="true" size={12} />
                    Multimodal intake · {request.intake.evidence.length}{" "}
                    evidence item
                    {request.intake.evidence.length === 1 ? "" : "s"}
                  </span>
                ) : null}
                <small>
                  {request.id} · {request.consumer} · {request.area}
                </small>
                <p>{request.description}</p>
              </span>
              <span className="ops-request-owner">
                <StatusPill value={request.status} />
                <small>{request.assignee}</small>
              </span>
              <ChevronRight aria-hidden="true" size={19} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RequestDetailScreen({
  request,
  onBack,
  onUpdate,
  session,
  onAcceptTriage,
}: {
  request: ServiceRequest
  onBack: () => void
  onUpdate: (request: ServiceRequest) => void
  session: Session
  onAcceptTriage: (request: ServiceRequest) => void
}) {
  const [note, setNote] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string>()
  const updateStatus = (status: ServiceRequest["status"]) =>
    onUpdate({ ...request, status })
  const addNote = () => {
    if (!note.trim()) return
    onUpdate({ ...request, notes: [...request.notes, note.trim()] })
    setNote("")
  }
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow={request.id}
        title={request.type}
        description={`${request.consumer} · Account ${request.accountNumber}`}
        onBack={onBack}
        actions={
          request.assignee === "Unassigned" ? (
            <OpsButton
              icon={UserRound}
              onClick={() =>
                onUpdate({
                  ...request,
                  assignee: session.user.name,
                  status: "Assigned",
                })
              }
            >
              Assign to me
            </OpsButton>
          ) : (
            <StatusPill value={request.status} />
          )
        }
      />
      <div className="ops-detail-grid ops-request-detail-grid">
        <OpsCard>
          <div className="ops-section-heading">
            <h2>Request details</h2>
            <StatusPill value={request.priority} />
          </div>
          <dl className="ops-definition-list">
            <div>
              <dt>Consumer</dt>
              <dd>{request.consumer}</dd>
            </div>
            <div>
              <dt>Service area</dt>
              <dd>{request.area}</dd>
            </div>
            <div>
              <dt>Assigned to</dt>
              <dd>{request.assignee}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{request.createdAt}</dd>
            </div>
          </dl>
          <div className="ops-description-block">
            <span>Consumer report</span>
            <p>{request.description}</p>
          </div>
        </OpsCard>
        {request.intake ? (
          <OpsCard className="ops-ai-intake-card">
            <div className="ops-ai-intake-head">
              <span>
                <Sparkles aria-hidden="true" size={18} />
                AI-assisted intake
              </span>
              <em>{request.intake.provenance}</em>
            </div>
            <div className="ops-alert ops-alert-info">
              <Info aria-hidden="true" size={18} />
              <span>
                Review original evidence before operational action. These are
                suggestions, not confirmed findings.
              </span>
            </div>
            <div className="ops-triage-grid">
              <div>
                <span>Suggested category</span>
                <strong>{request.intake.suggestedType}</strong>
              </div>
              <div>
                <span>Suggested priority</span>
                <StatusPill value={request.intake.suggestedPriority} />
              </div>
              <div>
                <span>Analysis readiness</span>
                <strong>
                  {request.intake.needsMoreDetail
                    ? "Needs more detail"
                    : "Ready to review"}
                </strong>
              </div>
              <div>
                <span>Confidence band</span>
                <strong className="ops-capitalize">
                  {request.intake.confidence}
                </strong>
              </div>
            </div>
            <div className="ops-ai-rationale">
              <span>Attention rationale</span>
              <p>{request.intake.priorityRationale}</p>
            </div>
            <div className="ops-observation-list">
              <span>Extracted observations</span>
              <div>
                {request.intake.observations.map((observation) => (
                  <em key={observation}>{observation}</em>
                ))}
              </div>
            </div>
            {request.type !== request.intake.suggestedType ||
            request.priority !== request.intake.suggestedPriority ? (
              <OpsButton icon={Check} onClick={() => onAcceptTriage(request)}>
                Accept suggested triage
              </OpsButton>
            ) : (
              <div className="ops-triage-aligned">
                <CheckCircle2 aria-hidden="true" size={17} />
                Current request matches the suggested triage.
              </div>
            )}
          </OpsCard>
        ) : null}
        <OpsCard>
          <div className="ops-section-heading">
            <h2>Update status</h2>
          </div>
          <div className="ops-status-actions">
            {([
              "Assigned",
              "In progress",
              "Awaiting customer",
              "Resolved",
            ] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={request.status === item ? "active" : ""}
                onClick={() => updateStatus(item)}
              >
                {request.status === item ? <Check size={16} /> : <span />}
                {item}
              </button>
            ))}
          </div>
        </OpsCard>
      </div>
      {request.intake ? (
        <OpsCard className="ops-evidence-review">
          <div className="ops-section-heading">
            <div>
              <h2>Original consumer evidence</h2>
              <p>Captured at submission and kept separate from the summary.</p>
            </div>
            <span className="ops-intake-badge">
              <Sparkles size={13} /> Multimodal intake
            </span>
          </div>
          <div className="ops-evidence-grid">
            {request.intake.evidence.map((evidence) =>
              evidence.kind === "image" ? (
                <button
                  type="button"
                  className="ops-image-evidence"
                  key={evidence.id}
                  onClick={() => setMediaPreview(evidence.previewUrl)}
                >
                  <img
                    src={evidence.previewUrl}
                    alt="Consumer-submitted water issue evidence"
                  />
                  <span>
                    <Eye aria-hidden="true" size={16} />
                    Open image · {evidence.name}
                  </span>
                </button>
              ) : (
                <div className="ops-audio-evidence" key={evidence.id}>
                  <span>
                    <Mic aria-hidden="true" size={19} />
                  </span>
                  <div>
                    <strong>{evidence.name}</strong>
                    <small>{evidence.durationSeconds ?? 0} seconds</small>
                  </div>
                  {evidence.previewUrl ? (
                    <audio controls src={evidence.previewUrl} />
                  ) : (
                    <em>Demo audio</em>
                  )}
                </div>
              ),
            )}
          </div>
          <div className="ops-evidence-copy-grid">
            {request.intake.transcript ? (
              <div>
                <span>Voice transcript</span>
                <p>{request.intake.transcript}</p>
              </div>
            ) : null}
            {request.intake.typedDescription ? (
              <div>
                <span>Typed description</span>
                <p>{request.intake.typedDescription}</p>
              </div>
            ) : null}
            <div>
              <span>
                <MapPin aria-hidden="true" size={15} /> Reported location
              </span>
              <p>{request.intake.location.label}</p>
              {request.intake.location.precisionShared ? (
                <small>
                  Shared coordinates:{" "}
                  {request.intake.location.latitude?.toFixed(4)},{" "}
                  {request.intake.location.longitude?.toFixed(4)}
                </small>
              ) : null}
            </div>
            {request.intake.advisoryMatch ? (
              <div>
                <span>Possible advisory match</span>
                <p>{request.intake.advisoryMatch.title}</p>
                <small>
                  Possible relationship only; causality was not inferred.
                </small>
              </div>
            ) : null}
          </div>
        </OpsCard>
      ) : null}
      <OpsCard>
        <div className="ops-section-heading">
          <div>
            <h2>Internal activity</h2>
            <p>Notes are visible only to PPCWD staff.</p>
          </div>
        </div>
        <div className="ops-note-composer">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add an operational note…"
          />
          <OpsButton icon={MessageSquare} onClick={addNote}>
            Add note
          </OpsButton>
        </div>
        <div className="ops-note-list">
          {request.notes.map((item, index) => (
            <div key={`${item}-${index}`}>
              <span>{session.user.initials}</span>
              <div>
                <strong>{session.user.name}</strong>
                <p>{item}</p>
                <small>Internal note</small>
              </div>
            </div>
          ))}
        </div>
      </OpsCard>
      {mediaPreview ? (
        <div
          className="ops-media-backdrop"
          role="presentation"
          onMouseDown={() => setMediaPreview(undefined)}
        >
          <div
            className="ops-media-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Consumer evidence preview"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMediaPreview(undefined)}
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
            <img
              src={mediaPreview}
              alt="Full-size consumer-submitted evidence"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AdvisoriesScreen({
  role,
  advisories,
  onEdit,
}: {
  role: AdminRole
  advisories: ManagedAdvisory[]
  onEdit: (advisory?: ManagedAdvisory) => void
}) {
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Public information"
        title="Advisories"
        description="Draft, review, and publish official service updates."
        actions={
          <OpsButton icon={Plus} onClick={() => onEdit()}>
            Create advisory
          </OpsButton>
        }
      />
      <div className="ops-advisory-summary">
        <span>
          <i className="active" /> 0 active
        </span>
        <span>
          <i className="scheduled" /> 1 scheduled
        </span>
        <span>
          <i className="review" /> 1 awaiting review
        </span>
      </div>
      <div className="ops-advisory-grid">
        {advisories.map((advisory) => (
          <OpsCard key={advisory.id} className="ops-advisory-card">
            <div className="ops-advisory-card-top">
              <StatusPill value={advisory.status} />
              <button
                type="button"
                onClick={() => onEdit(advisory)}
                aria-label={`Edit ${advisory.title}`}
              >
                <PencilLine size={17} />
              </button>
            </div>
            <span className="ops-eyebrow">{advisory.severity}</span>
            <h2>{advisory.title}</h2>
            <p>{advisory.guidance}</p>
            <dl>
              <div>
                <dt>Affected areas</dt>
                <dd>{advisory.areas}</dd>
              </div>
              <div>
                <dt>Schedule</dt>
                <dd>{advisory.schedule}</dd>
              </div>
            </dl>
            <div className="ops-advisory-footer">
              <span>By {advisory.author}</span>
              <button type="button" onClick={() => onEdit(advisory)}>
                {role === "admin" && advisory.status === "In review"
                  ? "Review"
                  : "Open"}
                <ChevronRight size={16} />
              </button>
            </div>
          </OpsCard>
        ))}
      </div>
    </div>
  )
}

function AdvisoryEditorScreen({
  role,
  advisory,
  onBack,
  onSave,
}: {
  role: AdminRole
  advisory?: ManagedAdvisory
  onBack: () => void
  onSave: (
    advisory: ManagedAdvisory,
    action: "draft" | "review" | "publish",
  ) => void
}) {
  const [title, setTitle] = useState(advisory?.title ?? "")
  const [areas, setAreas] = useState(advisory?.areas ?? "")
  const [schedule, setSchedule] = useState(advisory?.schedule ?? "")
  const [guidance, setGuidance] = useState(advisory?.guidance ?? "")
  const [error, setError] = useState("")
  const makeRecord = (): ManagedAdvisory => ({
    id: advisory?.id ?? `adv-${Date.now()}`,
    title,
    areas,
    schedule,
    guidance,
    status: advisory?.status ?? "Draft",
    severity: advisory?.severity ?? "Service impact",
    author: advisory?.author ?? "Ana Reyes",
  })
  const save = (action: "draft" | "review" | "publish") => {
    if (
      !title.trim() ||
      !areas.trim() ||
      !schedule.trim() ||
      !guidance.trim()
    ) {
      setError(
        "Complete the title, affected areas, schedule, and public guidance.",
      )
      return
    }
    onSave(makeRecord(), action)
  }
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow={advisory ? advisory.id.toUpperCase() : "New public update"}
        title={advisory ? "Edit advisory" : "Create advisory"}
        description="Prepare clear, actionable guidance for affected consumers."
        onBack={onBack}
      />
      {error ? (
        <div className="ops-alert ops-alert-danger" role="alert">
          <AlertTriangle size={19} />
          <span>{error}</span>
        </div>
      ) : null}
      <div className="ops-editor-grid">
        <OpsCard className="ops-editor-form">
          <div className="ops-section-heading">
            <div>
              <h2>Advisory details</h2>
              <p>All fields below are visible in the public preview.</p>
            </div>
          </div>
          <label className="ops-field">
            <span>Advisory title</span>
            <div>
              <FileText size={18} />
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Scheduled pressure reduction"
              />
            </div>
          </label>
          <label className="ops-field">
            <span>Affected areas</span>
            <div>
              <Home size={18} />
              <input
                value={areas}
                onChange={(event) => setAreas(event.target.value)}
                placeholder="Barangays or service areas"
              />
            </div>
          </label>
          <label className="ops-field">
            <span>Schedule</span>
            <div>
              <Clock3 size={18} />
              <input
                value={schedule}
                onChange={(event) => setSchedule(event.target.value)}
                placeholder="Date and expected time window"
              />
            </div>
          </label>
          <label className="ops-textarea-field">
            <span>Public guidance</span>
            <textarea
              value={guidance}
              onChange={(event) => setGuidance(event.target.value)}
              placeholder="Explain what consumers should expect and do."
            />
          </label>
          <div className="ops-editor-actions">
            <OpsButton variant="secondary" onClick={() => save("draft")}>
              Save draft
            </OpsButton>
            {role === "admin" ? (
              <OpsButton icon={Send} onClick={() => save("publish")}>
                Publish advisory
              </OpsButton>
            ) : (
              <OpsButton icon={Send} onClick={() => save("review")}>
                Submit for review
              </OpsButton>
            )}
          </div>
        </OpsCard>
        <div className="ops-preview-panel">
          <span className="ops-eyebrow">Consumer preview</span>
          <div className="ops-public-preview">
            <StatusPill value={role === "admin" ? "Scheduled" : "In review"} />
            <span>Service advisory</span>
            <h2>{title || "Your advisory title"}</h2>
            <p>
              {guidance || "Public guidance will appear here as you write."}
            </p>
            <dl>
              <div>
                <dt>Affected areas</dt>
                <dd>{areas || "No areas selected"}</dd>
              </div>
              <div>
                <dt>Expected schedule</dt>
                <dd>{schedule || "No schedule provided"}</dd>
              </div>
            </dl>
          </div>
          <div className="ops-alert ops-alert-info">
            <Eye size={18} />
            <span>
              This preview follows the current consumer advisory design.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ApprovalsScreen({
  approvals,
  onDecide,
}: {
  approvals: ApprovalRequest[]
  onDecide: (item: ApprovalRequest, decision: "Approved" | "Rejected") => void
}) {
  const pending = approvals.filter((item) => item.status === "Pending")
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Admin control"
        title="Approval center"
        description="Review sensitive financial and publishing requests."
      />
      {pending.length ? (
        <div className="ops-approval-list">
          {pending.map((item) => (
            <OpsCard key={item.id} className="ops-approval-card">
              <div className="ops-approval-icon">
                {item.type === "Advisory publication" ? (
                  <Bell size={21} />
                ) : (
                  <CreditCard size={21} />
                )}
              </div>
              <div className="ops-approval-main">
                <span className="ops-eyebrow">{item.type}</span>
                <h2>{item.title}</h2>
                <p>{item.reason}</p>
                <small>
                  Submitted by {item.submittedBy} · {item.submittedAt}
                </small>
              </div>
              <div className="ops-approval-actions">
                <OpsButton
                  variant="secondary"
                  icon={XCircle}
                  onClick={() => onDecide(item, "Rejected")}
                >
                  Reject
                </OpsButton>
                <OpsButton
                  icon={CheckCircle2}
                  onClick={() => onDecide(item, "Approved")}
                >
                  Approve
                </OpsButton>
              </div>
            </OpsCard>
          ))}
        </div>
      ) : (
        <OpsCard>
          <EmptyState
            icon={CheckCircle2}
            title="Approval queue is clear"
            message="New financial and advisory requests will appear here."
          />
        </OpsCard>
      )}
    </div>
  )
}

function ReportsScreen({
  role,
  notify,
}: {
  role: AdminRole
  notify: (message: string) => void
}) {
  const metrics = [
    {
      label: "Collections",
      value: "₱2.84M",
      change: "+8.2%",
      height: [42, 50, 47, 65, 72, 84],
    },
    {
      label: "Open balance",
      value: "₱681K",
      change: "−3.6%",
      height: [86, 78, 72, 68, 62, 55],
    },
    {
      label: "Requests resolved",
      value: "91%",
      change: "+4.1%",
      height: [52, 60, 58, 72, 79, 88],
    },
  ]
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow={role === "admin" ? "Organization-wide" : "Operations summary"}
        title="Reports"
        description="Track collections, service demand, and team performance."
        actions={
          <OpsButton
            variant="secondary"
            icon={Download}
            onClick={() => notify("Demo report exported.")}
          >
            Export report
          </OpsButton>
        }
      />
      <div className="ops-report-filters">
        <button type="button">
          Nov 1 – Nov 14, 2025 <ChevronDown size={16} />
        </button>
        <button type="button">
          All service areas <ChevronDown size={16} />
        </button>
        <button type="button">
          <RefreshCw size={16} /> Refresh data
        </button>
      </div>
      <div className="ops-report-grid">
        {metrics.map((metric) => (
          <OpsCard key={metric.label} className="ops-report-card">
            <span>{metric.label}</span>
            <div>
              <strong>{metric.value}</strong>
              <em>{metric.change}</em>
            </div>
            <div
              className="ops-report-bars"
              aria-label={`${metric.label} trend`}
            >
              {metric.height.map((height, index) => (
                <i
                  key={index}
                  style={
                    { "--bar-height": `${height}%` } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </OpsCard>
        ))}
      </div>
      <div className="ops-detail-grid">
        <OpsCard>
          <div className="ops-section-heading">
            <div>
              <span className="ops-eyebrow">By category</span>
              <h2>Service request volume</h2>
            </div>
          </div>
          <div className="ops-ranked-list">
            {[
              ["Low pressure", 38, "38%"],
              ["Billing inquiry", 27, "27%"],
              ["Meter concern", 19, "19%"],
              ["No water", 16, "16%"],
            ].map(([label, value, percent]) => (
              <div key={label}>
                <span>
                  <strong>{label}</strong>
                  <small>{value} requests</small>
                </span>
                <span className="ops-rank-track">
                  <i
                    style={{ "--rank-width": percent } as React.CSSProperties}
                  />
                </span>
                <em>{percent}</em>
              </div>
            ))}
          </div>
        </OpsCard>
        <OpsCard>
          <div className="ops-section-heading">
            <div>
              <span className="ops-eyebrow">Resolution performance</span>
              <h2>Service levels</h2>
            </div>
          </div>
          <div className="ops-service-level">
            <div className="ops-donut">
              <strong>91%</strong>
              <span>within SLA</span>
            </div>
            <ul>
              <li>
                <span className="success" /> Within target <strong>91</strong>
              </li>
              <li>
                <span className="warning" /> Near target <strong>6</strong>
              </li>
              <li>
                <span className="danger" /> Over target <strong>3</strong>
              </li>
            </ul>
          </div>
        </OpsCard>
      </div>
    </div>
  )
}

function TeamScreen({
  team,
  currentUserId,
  onManage,
  notify,
}: {
  team: StaffUser[]
  currentUserId: string
  onManage: (member: StaffUser) => void
  notify: (message: string) => void
}) {
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Access administration"
        title="Team & roles"
        description="Manage staff access and operational responsibility."
        actions={
          <OpsButton
            icon={Plus}
            onClick={() =>
              notify("Staff invitation created in prototype mode.")
            }
          >
            Invite staff
          </OpsButton>
        }
      />
      <div className="ops-team-grid">
        {team.map((member) => (
          <OpsCard key={member.id} className="ops-team-card">
            <div className="ops-team-card-head">
              <span className="ops-team-avatar">{member.initials}</span>
              <StatusPill value={member.status} />
            </div>
            <h2>{member.name}</h2>
            <p>{member.title}</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd className={member.role}>{member.role}</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>{member.team}</dd>
              </div>
              <div>
                <dt>Last active</dt>
                <dd>{member.lastActive}</dd>
              </div>
            </dl>
            <OpsButton
              variant="secondary"
              className="ops-full-button"
              disabled={member.id === currentUserId}
              onClick={() => onManage(member)}
            >
              {member.id === currentUserId
                ? "Current session"
                : "Manage access"}
            </OpsButton>
          </OpsCard>
        ))}
      </div>
    </div>
  )
}

function AuditScreen({
  audit,
  role,
}: {
  audit: AuditEvent[]
  role: AdminRole
}) {
  const [query, setQuery] = useState("")
  const visible = audit.filter((event) =>
    `${event.actor} ${event.action} ${event.record}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Immutable activity history"
        title="Audit log"
        description={
          role === "admin"
            ? "Review organization-wide actions and outcomes."
            : "Review activity for operational records you can access."
        }
      />
      <div className="ops-filter-bar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search actor, action, or record"
        />
        <OpsButton variant="secondary" icon={Filter}>
          Filter events
        </OpsButton>
      </div>
      <OpsCard className="ops-data-card">
        <div className="ops-audit-list">
          {visible.map((event) => (
            <div key={event.id}>
              <span className={`ops-audit-icon ${event.result.toLowerCase()}`}>
                {event.result === "Success" ? (
                  <Check size={17} />
                ) : (
                  <FileClock size={17} />
                )}
              </span>
              <div>
                <strong>{event.action}</strong>
                <p>
                  {event.actor} · {event.role} · {event.record}
                </p>
              </div>
              <time>{event.timestamp}</time>
              <StatusPill value={event.result} />
            </div>
          ))}
        </div>
      </OpsCard>
    </div>
  )
}

function SettingsScreen({ notify }: { notify: (message: string) => void }) {
  const [office, setOffice] = useState("(048) 433-2408")
  const [hours, setHours] = useState("Monday–Friday, 8:00 AM–5:00 PM")
  const [dirty, setDirty] = useState(false)
  const update = (setter: (value: string) => void, value: string) => {
    setter(value)
    setDirty(true)
  }
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Admin configuration"
        title="Settings"
        description="Manage organization-wide information shown in the prototype."
        actions={
          <OpsButton
            icon={Check}
            disabled={!dirty}
            onClick={() => {
              setDirty(false)
              notify("Organization settings saved locally.")
            }}
          >
            Save changes
          </OpsButton>
        }
      />
      {dirty ? (
        <div className="ops-alert ops-alert-warning" role="status">
          <Info size={18} />
          <span>
            You have unsaved changes. These values remain local to this
            prototype.
          </span>
        </div>
      ) : null}
      <div className="ops-settings-layout">
        <OpsCard>
          <div className="ops-section-heading">
            <div>
              <h2>Public contact information</h2>
              <p>Used in the consumer app’s contact and support area.</p>
            </div>
          </div>
          <label className="ops-field">
            <span>Main office phone</span>
            <div>
              <MessageSquare size={18} />
              <input
                value={office}
                onChange={(event) => update(setOffice, event.target.value)}
              />
            </div>
          </label>
          <label className="ops-field">
            <span>Collection office hours</span>
            <div>
              <Clock3 size={18} />
              <input
                value={hours}
                onChange={(event) => update(setHours, event.target.value)}
              />
            </div>
          </label>
        </OpsCard>
        <OpsCard>
          <div className="ops-section-heading">
            <div>
              <h2>Payment channels</h2>
              <p>Control which channels are shown to consumers.</p>
            </div>
          </div>
          <div className="ops-setting-toggles">
            {[
              "GCash",
              "PalawanPay",
              "Authorized payment centers",
              "PPCWD offices",
            ].map((channel) => (
              <label key={channel}>
                <span>
                  <strong>{channel}</strong>
                  <small>Visible in consumer payment options</small>
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={() => setDirty(true)}
                />
              </label>
            ))}
          </div>
        </OpsCard>
      </div>
    </div>
  )
}

function ProfileScreen({
  session,
  onSwitchRole,
  onSignOut,
}: {
  session: Session
  onSwitchRole: (role: AdminRole) => void
  onSignOut: () => void
}) {
  return (
    <div className="ops-page">
      <PageTitle
        eyebrow="Signed-in staff"
        title="Profile & access"
        description="Review your identity, role, and prototype session."
      />
      <div className="ops-profile-layout">
        <OpsCard className="ops-profile-card">
          <span className="ops-profile-avatar">{session.user.initials}</span>
          <h2>{session.user.name}</h2>
          <p>{session.user.title}</p>
          <StatusPill value={session.role === "admin" ? "Admin" : "Staff"} />
          <dl>
            <div>
              <dt>Staff ID</dt>
              <dd>{session.user.id}</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>{session.user.team}</dd>
            </div>
          </dl>
        </OpsCard>
        <div className="ops-profile-stack">
          <OpsCard>
            <div className="ops-section-heading">
              <h2>Role capabilities</h2>
              <ShieldCheck size={20} />
            </div>
            <p className="ops-profile-description">
              {capabilitySummary(session.role)}
            </p>
          </OpsCard>
          <OpsCard>
            <div className="ops-section-heading">
              <div>
                <h2>Prototype persona</h2>
                <p>Switch roles to review permission behavior.</p>
              </div>
            </div>
            <div className="ops-persona-switch">
              <button
                type="button"
                className={session.role === "staff" ? "active" : ""}
                onClick={() => onSwitchRole("staff")}
              >
                <UserRound size={18} /> Staff
              </button>
              <button
                type="button"
                className={session.role === "admin" ? "active" : ""}
                onClick={() => onSwitchRole("admin")}
              >
                <ShieldCheck size={18} /> Admin
              </button>
            </div>
          </OpsCard>
          <OpsButton variant="danger" icon={LogOut} onClick={onSignOut}>
            Sign out of staff portal
          </OpsButton>
        </div>
      </div>
    </div>
  )
}

function ReasonModal({
  modal,
  onClose,
  onConfirm,
}: {
  modal: Exclude<ModalState, null>
  onClose: () => void
  onConfirm: (reason: string) => void
}) {
  const [reason, setReason] = useState("")
  const isSignOut = modal.kind === "signout"
  const title =
    modal.kind === "approval"
      ? `${modal.decision === "Approved" ? "Approve" : "Reject"} this request?`
      : modal.kind === "adjustment"
        ? "Request payment correction?"
        : modal.kind === "team"
          ? `${
              modal.member.status === "Active" ? "Suspend" : "Reactivate"
            } ${modal.member.name}?`
          : "Sign out of the staff portal?"
  return (
    <div
      className="ops-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="ops-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ops-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>
        <span className="ops-modal-icon">
          {isSignOut ? <LogOut size={23} /> : <ShieldCheck size={23} />}
        </span>
        <h2 id="ops-modal-title">{title}</h2>
        <p>
          {isSignOut
            ? "Your local prototype session will end."
            : "This simulated action will update related records and add an audit event."}
        </p>
        {!isSignOut ? (
          <label className="ops-textarea-field">
            <span>Reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Provide a concise operational reason…"
            />
          </label>
        ) : null}
        <div className="ops-modal-actions">
          <OpsButton variant="secondary" onClick={onClose}>
            Cancel
          </OpsButton>
          <OpsButton
            variant={
              modal.kind === "approval" && modal.decision === "Approved"
                ? "primary"
                : "danger"
            }
            disabled={!isSignOut && !reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            {isSignOut ? "Sign out" : "Confirm action"}
          </OpsButton>
        </div>
      </section>
    </div>
  )
}

export default function AdminApp({
  onExit,
  submittedRequests,
  onUpdateSubmittedRequest,
}: {
  onExit: () => void
  submittedRequests: ServiceRequest[]
  onUpdateSubmittedRequest: (request: ServiceRequest) => void
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [screen, setScreen] = useState<AdminScreen>("overview")
  const [previousScreen, setPreviousScreen] = useState<AdminScreen>("overview")
  const [selectedConsumer, setSelectedConsumer] = useState<ConsumerRecord>(
    consumers[0],
  )
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest>(
    submittedRequests[0] ?? initialRequests[0],
  )
  const [selectedAdvisory, setSelectedAdvisory] =
    useState<ManagedAdvisory | undefined>()
  const [payments, setPayments] = useState(initialPayments)
  const [requests, setRequests] = useState(initialRequests)
  const [advisories, setAdvisories] = useState(initialAdvisories)
  const [approvals, setApprovals] = useState(initialApprovals)
  const [team, setTeam] = useState(initialTeam)
  const [audit, setAudit] = useState<AuditEvent[]>(() => [
    ...submittedRequests.map(
      (request): AuditEvent => ({
        id: `log-intake-${request.id}`,
        actor: request.consumer,
        role: "staff",
        action: "Consumer multimodal request received",
        record: request.id,
        timestamp: "Just now",
        result: "Success",
      }),
    ),
    ...initialAuditEvents,
  ])
  const [modal, setModal] = useState<ModalState>(null)
  const [toast, setToast] = useState("")

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2600)
  }

  const signIn = (role: AdminRole) => {
    const user = role === "admin" ? initialTeam[2] : initialTeam[0]
    setSession({ role, user })
    setScreen("overview")
  }

  const navigate = (next: AdminScreen) => {
    if (!session) return
    const restricted =
      (next === "approvals" && !can(session.role, "billing:approve")) ||
      (next === "team" && !can(session.role, "team:manage")) ||
      (next === "settings" && !can(session.role, "settings:manage"))
    if (restricted) {
      setScreen("overview")
      notify("That area requires Admin access.")
      return
    }
    setPreviousScreen(screen)
    setScreen(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const addAudit = (
    action: string,
    record: string,
    result: AuditEvent["result"],
  ) => {
    if (!session) return
    setAudit((items) => [
      {
        id: `log-${Date.now()}`,
        actor: session.user.name,
        role: session.role,
        action,
        record,
        timestamp: "Just now",
        result,
      },
      ...items,
    ])
  }

  const updateRequest = (next: ServiceRequest) => {
    if (submittedRequests.some((item) => item.id === next.id)) {
      onUpdateSubmittedRequest(next)
    } else {
      setRequests((items) =>
        items.map((item) => (item.id === next.id ? next : item)),
      )
    }
    setSelectedRequest(next)
    addAudit(`Updated service request to ${next.status}`, next.id, "Success")
    notify(`Request ${next.id} updated.`)
  }

  const acceptSuggestedTriage = (request: ServiceRequest) => {
    if (!request.intake) return
    const next = {
      ...request,
      type: request.intake.suggestedType,
      priority: request.intake.suggestedPriority,
    }
    if (submittedRequests.some((item) => item.id === request.id)) {
      onUpdateSubmittedRequest(next)
    } else {
      setRequests((items) =>
        items.map((item) => (item.id === next.id ? next : item)),
      )
    }
    setSelectedRequest(next)
    addAudit("Accepted AI-assisted triage suggestion", next.id, "Success")
    notify(`Suggested triage accepted for ${next.id}.`)
  }

  const saveAdvisory = (
    advisory: ManagedAdvisory,
    action: "draft" | "review" | "publish",
  ) => {
    if (!session) return
    const status: ManagedAdvisory["status"] =
      action === "publish"
        ? "Scheduled"
        : action === "review"
          ? "In review"
          : "Draft"
    const next = { ...advisory, status, author: session.user.name }
    setAdvisories((items) => {
      const exists = items.some((item) => item.id === next.id)
      return exists
        ? items.map((item) => (item.id === next.id ? next : item))
        : [next, ...items]
    })
    if (action === "review") {
      setApprovals((items) => [
        {
          id: `APR-${Date.now()}`,
          type: "Advisory publication",
          title: `${next.title} · ${next.areas}`,
          submittedBy: session.user.name,
          submittedAt: "Just now",
          reason: "Draft is ready for public review and scheduling.",
          status: "Pending",
        },
        ...items,
      ])
    }
    addAudit(
      action === "publish"
        ? "Published scheduled advisory"
        : action === "review"
          ? "Submitted advisory for review"
          : "Saved advisory draft",
      next.id.toUpperCase(),
      action === "review" ? "Pending" : "Success",
    )
    notify(
      action === "publish"
        ? "Advisory published in prototype mode."
        : action === "review"
          ? "Advisory submitted for Admin review."
          : "Draft saved locally.",
    )
    navigate("advisories")
  }

  const confirmModal = (reason: string) => {
    if (!modal || !session) return
    if (modal.kind === "signout") {
      setModal(null)
      setSession(null)
      setScreen("overview")
      return
    }
    if (modal.kind === "approval") {
      setApprovals((items) =>
        items.map((item) =>
          item.id === modal.item.id
            ? { ...item, status: modal.decision }
            : item,
        ),
      )
      if (
        modal.item.type === "Payment correction" &&
        modal.decision === "Approved"
      ) {
        setPayments((items) =>
          items.map((item) =>
            modal.item.title.includes(item.reference)
              ? { ...item, status: "Verified" }
              : item,
          ),
        )
      }
      if (
        modal.item.type === "Advisory publication" &&
        modal.decision === "Approved"
      ) {
        setAdvisories((items) =>
          items.map((item) =>
            modal.item.title.includes(item.title)
              ? { ...item, status: "Scheduled" }
              : item,
          ),
        )
      }
      addAudit(
        `${modal.decision} ${modal.item.type.toLowerCase()}: ${reason}`,
        modal.item.id,
        modal.decision === "Approved" ? "Success" : "Rejected",
      )
      notify(`Request ${modal.decision.toLowerCase()}.`)
    } else if (modal.kind === "adjustment") {
      setApprovals((items) => [
        {
          id: `APR-${Date.now()}`,
          type: "Payment correction",
          title: `${modal.payment.channel} reference ${modal.payment.reference}`,
          submittedBy: session.user.name,
          submittedAt: "Just now",
          reason,
          status: "Pending",
        },
        ...items,
      ])
      addAudit(
        "Submitted payment correction",
        modal.payment.id.toUpperCase(),
        "Pending",
      )
      notify("Correction request sent for Admin approval.")
    } else if (modal.kind === "team") {
      const nextStatus =
        modal.member.status === "Active" ? "Suspended" : "Active"
      setTeam((items) =>
        items.map((item) =>
          item.id === modal.member.id ? { ...item, status: nextStatus } : item,
        ),
      )
      addAudit(
        `${nextStatus} staff account: ${reason}`,
        modal.member.id,
        "Success",
      )
      notify(`${modal.member.name} is now ${nextStatus.toLowerCase()}.`)
    }
    setModal(null)
  }

  const pendingApprovals = approvals.filter(
    (item) => item.status === "Pending",
  ).length
  const allRequests = useMemo(
    () => [
      ...submittedRequests,
      ...requests.filter(
        (request) =>
          !submittedRequests.some((submitted) => submitted.id === request.id),
      ),
    ],
    [requests, submittedRequests],
  )

  const content = useMemo(() => {
    if (!session) return null
    if (screen === "overview")
      return (
        <OverviewScreen
          session={session}
          requests={allRequests}
          payments={payments}
          approvals={approvals}
          audit={audit}
          go={navigate}
        />
      )
    if (screen === "consumers")
      return (
        <ConsumersScreen
          onSelect={(consumer) => {
            setSelectedConsumer(consumer)
            navigate("consumer-detail")
          }}
        />
      )
    if (screen === "consumer-detail")
      return (
        <ConsumerDetailScreen
          consumer={selectedConsumer}
          onBack={() =>
            setScreen(
              previousScreen === "consumer-detail"
                ? "consumers"
                : previousScreen,
            )
          }
          onCreateRequest={() => {
            notify("New request form opened with this consumer preselected.")
            navigate("requests")
          }}
          notify={notify}
        />
      )
    if (screen === "billing")
      return (
        <BillingScreen
          role={session.role}
          payments={payments}
          onRequestAdjustment={(payment) =>
            setModal({ kind: "adjustment", payment })
          }
          notify={notify}
        />
      )
    if (screen === "requests")
      return (
        <RequestsScreen
          requests={allRequests}
          onCreate={() => notify("New request form opened in prototype mode.")}
          onSelect={(request) => {
            setSelectedRequest(request)
            navigate("request-detail")
          }}
        />
      )
    if (screen === "request-detail")
      return (
        <RequestDetailScreen
          request={selectedRequest}
          onBack={() => setScreen("requests")}
          onUpdate={updateRequest}
          session={session}
          onAcceptTriage={acceptSuggestedTriage}
        />
      )
    if (screen === "advisories")
      return (
        <AdvisoriesScreen
          role={session.role}
          advisories={advisories}
          onEdit={(advisory) => {
            setSelectedAdvisory(advisory)
            navigate("advisory-editor")
          }}
        />
      )
    if (screen === "advisory-editor")
      return (
        <AdvisoryEditorScreen
          role={session.role}
          advisory={selectedAdvisory}
          onBack={() => setScreen("advisories")}
          onSave={saveAdvisory}
        />
      )
    if (screen === "approvals")
      return (
        <ApprovalsScreen
          approvals={approvals}
          onDecide={(item, decision) =>
            setModal({ kind: "approval", item, decision })
          }
        />
      )
    if (screen === "reports")
      return <ReportsScreen role={session.role} notify={notify} />
    if (screen === "team")
      return (
        <TeamScreen
          team={team}
          currentUserId={session.user.id}
          onManage={(member) => setModal({ kind: "team", member })}
          notify={notify}
        />
      )
    if (screen === "audit")
      return <AuditScreen audit={audit} role={session.role} />
    if (screen === "settings") return <SettingsScreen notify={notify} />
    return (
      <ProfileScreen
        session={session}
        onSwitchRole={signIn}
        onSignOut={() => setModal({ kind: "signout" })}
      />
    )
  }, [
    session,
    screen,
    allRequests,
    payments,
    approvals,
    audit,
    selectedConsumer,
    selectedRequest,
    previousScreen,
    advisories,
    selectedAdvisory,
    team,
  ])

  if (!session) {
    return <StaffSignIn onSignIn={signIn} onBack={onExit} />
  }

  return (
    <AdminShell
      session={session}
      screen={screen}
      pendingApprovals={pendingApprovals}
      onNavigate={navigate}
      onSignOut={() => setModal({ kind: "signout" })}
    >
      {content}
      {modal ? (
        <ReasonModal
          modal={modal}
          onClose={() => setModal(null)}
          onConfirm={confirmModal}
        />
      ) : null}
      {toast ? (
        <div className="ops-toast" role="status">
          <CheckCircle2 aria-hidden="true" size={18} />
          {toast}
        </div>
      ) : null}
    </AdminShell>
  )
}
