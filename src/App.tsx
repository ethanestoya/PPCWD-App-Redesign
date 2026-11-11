import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  BellRing,
  Building2,
  Camera,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  CreditCard,
  Droplets,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  History,
  Home,
  Info,
  Landmark,
  Link2,
  LoaderCircle,
  LogOut,
  LucideIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  UserRound,
  WalletCards,
  X,
} from "lucide-react"
import { FormEvent, lazy, ReactNode, Suspense, useState } from "react"
import ReportIssueFlow from "./features/issue-reporting/ReportIssueFlow"
import ReportedIssuesScreen from "./features/issue-reporting/ReportedIssuesScreen"
import RequestStatusScreen from "./features/issue-reporting/RequestStatusScreen"
import { ServiceRequest } from "./features/issue-reporting/types"

const AdminApp = lazy(() => import("./admin/AdminApp"))

type Screen = "welcome" | "link" | "home" | "bills" | "bill-detail" | "payments" | "payment-detail" | "payment-pending" | "advisories" | "advisory-detail" | "account" | "report-issue" | "report-success" | "reported-issues" | "request-status"

type BillStatus = "Due soon" | "Paid" | "Pending"
type AdvisoryStatus = "Active" | "Scheduled" | "Resolved"

interface Bill {
  id: string
  period: string
  shortPeriod: string
  previousReading: number
  currentReading: number
  consumption: number
  currentBill: number
  penalty: number
  arrears: number
  discount: number
  amount: number
  dueDate: string
  status: BillStatus
}

interface Advisory {
  id: string
  title: string
  status: AdvisoryStatus
  affectedAreas: string
  schedule: string
  updated: string
  summary: string
  timeline: { time: string; detail: string }[]
}

interface PaymentMethod {
  id: string
  category: "E-wallet" | "Payment center" | "PPCWD office"
  name: string
  description: string
  timing: string
  icon: LucideIcon
  steps: string[]
}

const bills: Bill[] = [
  {
    id: "nov-2025",
    period: "Oct 3 – Nov 2, 2025",
    shortPeriod: "November 2025",
    previousReading: 1628,
    currentReading: 1649,
    consumption: 21,
    currentBill: 611.7,
    penalty: 61.17,
    arrears: 649.12,
    discount: 0,
    amount: 1321.99,
    dueDate: "Nov 18, 2025",
    status: "Due soon",
  },
  {
    id: "oct-2025",
    period: "Sep 3 – Oct 2, 2025",
    shortPeriod: "October 2025",
    previousReading: 1610,
    currentReading: 1628,
    consumption: 18,
    currentBill: 519.2,
    penalty: 0,
    arrears: 0,
    discount: 0,
    amount: 519.2,
    dueDate: "Oct 18, 2025",
    status: "Paid",
  },
  {
    id: "sep-2025",
    period: "Aug 3 – Sep 2, 2025",
    shortPeriod: "September 2025",
    previousReading: 1590,
    currentReading: 1610,
    consumption: 20,
    currentBill: 579,
    penalty: 0,
    arrears: 0,
    discount: 0,
    amount: 579,
    dueDate: "Sep 18, 2025",
    status: "Paid",
  },
  {
    id: "aug-2025",
    period: "Jul 3 – Aug 2, 2025",
    shortPeriod: "August 2025",
    previousReading: 1573,
    currentReading: 1590,
    consumption: 17,
    currentBill: 489.3,
    penalty: 0,
    arrears: 0,
    discount: 0,
    amount: 489.3,
    dueDate: "Aug 18, 2025",
    status: "Paid",
  },
  {
    id: "jul-2025",
    period: "Jun 3 – Jul 2, 2025",
    shortPeriod: "July 2025",
    previousReading: 1552,
    currentReading: 1573,
    consumption: 21,
    currentBill: 617.7,
    penalty: 0,
    arrears: 0,
    discount: 0,
    amount: 617.7,
    dueDate: "Jul 18, 2025",
    status: "Paid",
  },
]

const advisories: Advisory[] = [
  {
    id: "maintenance",
    title: "Scheduled pressure reduction",
    status: "Scheduled",
    affectedAreas: "Brgys. San Manuel, Tiniguiban, and nearby areas",
    schedule: "Nov 15, 10:00 PM – Nov 16, 4:00 AM",
    updated: "Updated 35 minutes ago",
    summary:
      "Water pressure may be lower than usual while crews complete preventive maintenance on a main distribution line.",
    timeline: [
      {
        time: "10:00 PM",
        detail: "Pressure reduction begins in the affected service areas.",
      },
      {
        time: "1:00 AM",
        detail:
          "Main line inspection and valve maintenance are expected to finish.",
      },
      {
        time: "4:00 AM",
        detail: "Normal pressure is expected to return gradually.",
      },
    ],
  },
  {
    id: "resolved-leak",
    title: "Pipeline repair completed",
    status: "Resolved",
    affectedAreas: "Brgy. Sicsican",
    schedule: "Resolved Nov 12 at 6:30 PM",
    updated: "Updated 2 days ago",
    summary:
      "Repairs are complete and water service has been restored. Some households may briefly experience cloudy water.",
    timeline: [
      {
        time: "2:15 PM",
        detail: "Emergency leak repair began along the national highway.",
      },
      {
        time: "6:30 PM",
        detail: "Repair completed and service restoration started.",
      },
    ],
  },
]

const paymentMethods: PaymentMethod[] = [
  {
    id: "gcash",
    category: "E-wallet",
    name: "GCash",
    description: "Pay through Bills in the GCash app",
    timing: "Posts in 2–3 business days",
    icon: Smartphone,
    steps: [
      "Open GCash and select Bills.",
      "Choose Water Utilities, then Puerto Princesa City Water District.",
      "Enter your account number, account name, and amount due.",
      "Review the details before confirming payment.",
      "Keep the digital receipt until payment appears in your PPCWD account.",
    ],
  },
  {
    id: "palawanpay",
    category: "E-wallet",
    name: "PalawanPay",
    description: "Pay through the PalawanPay mobile app",
    timing: "Posts in 2–3 business days",
    icon: WalletCards,
    steps: [
      "Open PalawanPay and choose Pay Bills.",
      "Search for Puerto Princesa City Water District.",
      "Enter the account number and exact amount due.",
      "Confirm the account details and complete the payment.",
    ],
  },
  {
    id: "payment-centers",
    category: "Payment center",
    name: "Authorized payment centers",
    description: "Palawan Pawnshop, ECPay, SM Bills Pay, M Lhuillier, and USSC",
    timing: "Bring your account number and bill amount",
    icon: Landmark,
    steps: [
      "Visit an authorized PPCWD payment partner.",
      "Provide your PPCWD account number and account name.",
      "Pay the exact amount shown on your current statement.",
      "Keep your validated receipt as proof of payment.",
    ],
  },
  {
    id: "ppcwd-office",
    category: "PPCWD office",
    name: "PPCWD collection offices",
    description: "Main Office, Drive-Thru, or Rizal Office",
    timing: "Monday–Friday, 8:00 AM–5:00 PM",
    icon: Building2,
    steps: [
      "Visit the PPCWD Main Office, Drive-Thru, or Rizal Office.",
      "Present your account number or latest statement.",
      "Pay at the collection counter and keep your official receipt.",
    ],
  },
]

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

function Heading({
  level,
  children,
  className = "",
}: {
  level: 1 | 2 | 3
  children: ReactNode
  className?: string
}) {
  if (level === 1) {
    return <h1 className={className}>{children}</h1>
  }
  if (level === 2) {
    return <h2 className={className}>{children}</h2>
  }
  return <h3 className={className}>{children}</h3>
}

function Button({
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
      className={`button button-${variant} ${className}`}
      type="button"
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" size={18} strokeWidth={2.2} /> : null}
      <span>{children}</span>
    </button>
  )
}

function IconButton({
  label,
  icon: Icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  icon: LucideIcon
}) {
  return (
    <button className="icon-button" type="button" aria-label={label} {...props}>
      <Icon aria-hidden="true" size={21} />
    </button>
  )
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`surface-card ${className}`}>{children}</div>
}

function StatusBadge({ status }: { status: BillStatus | AdvisoryStatus }) {
  const Icon =
    status === "Paid" || status === "Resolved"
      ? CheckCircle2
      : status === "Due soon" || status === "Scheduled"
        ? Clock3
        : Info
  return (
    <span
      className={`status-badge status-${status.toLowerCase().replace(" ", "-")}`}
    >
      <Icon aria-hidden="true" size={13} />
      {status}
    </span>
  )
}

function TextField({
  label,
  hint,
  icon: Icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  icon: LucideIcon
  error?: string
}) {
  const id = props.id ?? props.name
  const helpId = `${id}-help`
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <span className={`field-control ${error ? "field-control-error" : ""}`}>
        <Icon aria-hidden="true" size={19} />
        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? helpId : undefined}
        />
      </span>
      {error ? (
        <span className="field-error" id={helpId}>
          <TriangleAlert aria-hidden="true" size={14} />
          {error}
        </span>
      ) : hint ? (
        <span className="field-hint" id={helpId}>
          {hint}
        </span>
      ) : null}
    </label>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <img src="/assets/ppcwd-seal.png" alt="PPCWD seal" />
      <div>
        <strong>PPCWD</strong>
        <span>Puerto Princesa City Water District</span>
      </div>
    </div>
  )
}

function ScreenHeader({
  title,
  subtitle,
  onBack,
  trailing,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
  trailing?: ReactNode
}) {
  return (
    <header className="screen-header">
      <div className="screen-header-row">
        {onBack ? (
          <IconButton label="Go back" icon={ArrowLeft} onClick={onBack} />
        ) : null}
        <div className="screen-header-copy">
          <Heading level={1}>{title}</Heading>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {trailing ? (
          <div className="screen-header-trailing">{trailing}</div>
        ) : null}
      </div>
    </header>
  )
}

function BottomNav({
  active,
  onNavigate,
}: {
  active: "home" | "bills" | "advisories" | "account"
  onNavigate: (screen: Screen) => void
}) {
  const items: { id: typeof active; label: string; icon: LucideIcon }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "bills", label: "Bills", icon: ReceiptText },
    { id: "advisories", label: "Advisories", icon: Bell },
    { id: "account", label: "Account", icon: UserRound },
  ]
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={isActive ? "bottom-nav-item active" : "bottom-nav-item"}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <Icon
              aria-hidden="true"
              size={21}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function AppFrame({
  children,
  active,
  onNavigate,
}: {
  children: ReactNode
  active?: "home" | "bills" | "advisories" | "account"
  onNavigate: (screen: Screen) => void
}) {
  return (
    <div className="app-frame">
      <main className={active ? "app-content with-nav" : "app-content"}>
        {children}
      </main>
      {active ? <BottomNav active={active} onNavigate={onNavigate} /> : null}
    </div>
  )
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
}) {
  return (
    <button className="quick-action" type="button" onClick={onClick}>
      <span className="quick-action-icon">
        <Icon aria-hidden="true" size={21} />
      </span>
      <span>{label}</span>
    </button>
  )
}

function WelcomeScreen({
  onContinue,
  onStaffAccess,
}: {
  onContinue: () => void
  onStaffAccess: () => void
}) {
  return (
    <div className="welcome-screen">
      <div className="welcome-art" aria-hidden="true">
        <span className="water-orbit orbit-one" />
        <span className="water-orbit orbit-two" />
        <span className="water-orbit orbit-three" />
        <div className="seal-glow">
          <img src="/assets/ppcwd-seal.png" alt="" />
        </div>
      </div>
      <div className="welcome-copy">
        <span className="eyebrow">Your water service, simplified</span>
        <Heading level={1}>Stay informed. Pay on time. Worry less.</Heading>
        <p>
          View your bill, track water use, find payment options, and receive
          official service updates in one place.
        </p>
      </div>
      <div className="welcome-actions">
        <Button onClick={onContinue} className="button-full">
          Link my account
        </Button>
        <button
          className="staff-access-link"
          type="button"
          onClick={onStaffAccess}
        >
          <ShieldCheck aria-hidden="true" size={17} />
          Staff access
          <ArrowRight aria-hidden="true" size={16} />
        </button>
        <div className="trust-note">
          <ShieldCheck aria-hidden="true" size={18} />
          <span>
            Your account details are protected and used only to show your
            service information.
          </span>
        </div>
      </div>
    </div>
  )
}

function LinkAccountScreen({
  onBack,
  onSuccess,
}: {
  onBack: () => void
  onSuccess: () => void
}) {
  const [accountNumber, setAccountNumber] = useState("")
  const [meterNumber, setMeterNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!/^\d{8}$/.test(accountNumber)) {
      nextErrors.account =
        "Enter the 8-digit account number shown on your bill."
    }
    if (!/^M-\d{6}$/i.test(meterNumber)) {
      nextErrors.meter = "Use the format M-123456."
    }
    setErrors(nextErrors)
    setServerError("")
    if (Object.keys(nextErrors).length > 0) return
    if (accountNumber === "00000000") {
      setServerError(
        "We couldn’t match those details. Check your latest statement or contact PPCWD for help.",
      )
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      onSuccess()
    }, 700)
  }

  const useDemo = () => {
    setAccountNumber("00123456")
    setMeterNumber("M-458921")
    setErrors({})
    setServerError("")
  }

  return (
    <div className="screen-stack link-screen">
      <ScreenHeader
        title="Link your account"
        subtitle="Use the details on your latest water bill."
        onBack={onBack}
      />
      <Card className="link-card">
        <div className="step-marker">
          <span>1</span>
          <div>
            <strong>Verify your service</strong>
            <p>This prototype uses demo information only.</p>
          </div>
        </div>
        {serverError ? (
          <div className="alert alert-error" role="alert">
            <TriangleAlert aria-hidden="true" size={20} />
            <div>
              <strong>Account not found</strong>
              <p>{serverError}</p>
            </div>
          </div>
        ) : null}
        <form onSubmit={submit} noValidate>
          <TextField
            id="account-number"
            name="account-number"
            label="Account number"
            icon={UserRound}
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 00123456"
            value={accountNumber}
            onChange={(event) =>
              setAccountNumber(
                event.target.value.replace(/\D/g, "").slice(0, 8),
              )
            }
            error={errors.account}
            hint="Find this near the top of your PPCWD statement."
          />
          <TextField
            id="meter-number"
            name="meter-number"
            label="Meter number"
            icon={Gauge}
            autoComplete="off"
            placeholder="e.g. M-458921"
            value={meterNumber}
            onChange={(event) =>
              setMeterNumber(event.target.value.toUpperCase().slice(0, 8))
            }
            error={errors.meter}
          />
          <Button type="submit" className="button-full" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle className="spin" aria-hidden="true" size={18} />
                Checking details…
              </>
            ) : (
              "Link account"
            )}
          </Button>
        </form>
        <button className="demo-link" type="button" onClick={useDemo}>
          <BadgeCheck aria-hidden="true" size={17} />
          Fill demo account details
        </button>
      </Card>
      <div className="help-strip">
        <CircleHelp aria-hidden="true" size={19} />
        <p>
          Can’t find these details?{" "}
          <button type="button">Get account help</button>
        </p>
      </div>
    </div>
  )
}

function HomeScreen({
  go,
  pendingPayment,
  activeRequest,
  requestCount,
  onOpenRequest,
}: {
  go: (screen: Screen) => void
  pendingPayment: boolean
  activeRequest?: ServiceRequest
  requestCount: number
  onOpenRequest: (request: ServiceRequest) => void
}) {
  const currentBill = bills[0]
  return (
    <div className="screen-stack home-screen">
      <header className="home-header">
        <Brand compact />
        <IconButton
          label="Notifications"
          icon={Bell}
          onClick={() => go("advisories")}
        />
      </header>
      <section className="greeting">
        <span className="eyebrow">Good morning, Maria</span>
        <Heading level={1}>Here’s your water service at a glance.</Heading>
      </section>

      <button
        className="service-banner"
        type="button"
        onClick={() => go("advisory-detail")}
      >
        <span className="service-banner-icon">
          <Droplets aria-hidden="true" size={21} />
        </span>
        <span className="service-banner-copy">
          <strong>Service is normal at your address</strong>
          <span>1 scheduled advisory nearby</span>
        </span>
        <ChevronRight aria-hidden="true" size={20} />
      </button>

      {pendingPayment ? (
        <div className="alert alert-info" role="status">
          <Clock3 aria-hidden="true" size={20} />
          <div>
            <strong>Payment confirmation pending</strong>
            <p>
              Payment channels may take 2–3 business days to update your
              account.
            </p>
          </div>
        </div>
      ) : null}

      {activeRequest ? (
        <section className="active-request-section">
          <div className="section-heading">
            <Heading level={2}>Your reported issues</Heading>
            <button
              type="button"
              className="text-button"
              onClick={() => go("reported-issues")}
            >
              View all ({requestCount})
            </button>
          </div>
          <button
            className="active-request-card"
            type="button"
            onClick={() => onOpenRequest(activeRequest)}
          >
            <span className="active-request-icon">
              <Camera aria-hidden="true" size={21} />
            </span>
            <span className="active-request-copy">
              <span className="card-label">
                Latest report · {activeRequest.id}
              </span>
              <strong>{activeRequest.type}</strong>
              <small>
                <b>{activeRequest.status}</b> · {activeRequest.area}
              </small>
            </span>
            <ChevronRight aria-hidden="true" size={19} />
          </button>
        </section>
      ) : null}

      <Card className="bill-hero">
        <div className="bill-hero-top">
          <div>
            <span className="card-label">Total amount due</span>
            <p className="amount-display">
              {currency.format(currentBill.amount)}
            </p>
          </div>
          <StatusBadge
            status={pendingPayment ? "Pending" : currentBill.status}
          />
        </div>
        <div className="due-row">
          <CalendarDays aria-hidden="true" size={18} />
          <span>Due {currentBill.dueDate}</span>
          <span className="due-pill">3 days left</span>
        </div>
        <div className="bill-hero-actions">
          <Button onClick={() => go("payments")} icon={CreditCard}>
            Pay bill
          </Button>
          <Button variant="secondary" onClick={() => go("bill-detail")}>
            View details
          </Button>
        </div>
      </Card>

      <section>
        <div className="section-heading">
          <Heading level={2}>Quick actions</Heading>
        </div>
        <div className="quick-grid">
          <QuickAction
            label="Bill details"
            icon={FileText}
            onClick={() => go("bill-detail")}
          />
          <QuickAction
            label="Payment options"
            icon={WalletCards}
            onClick={() => go("payments")}
          />
          <QuickAction
            label="Usage history"
            icon={History}
            onClick={() => go("bills")}
          />
          <QuickAction
            label="Report issue"
            icon={Camera}
            onClick={() => go("report-issue")}
          />
        </div>
      </section>

      <Card className="usage-card">
        <div className="section-heading">
          <div>
            <span className="card-label">This billing period</span>
            <Heading level={2}>Water consumption</Heading>
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => go("bills")}
          >
            View history
          </button>
        </div>
        <div className="usage-summary">
          <div className="usage-gauge" aria-hidden="true">
            <Droplets size={22} />
          </div>
          <div>
            <strong>21 m³</strong>
            <span>3 m³ more than last month</span>
          </div>
          <span className="trend-pill">+17%</span>
        </div>
      </Card>

      <section>
        <div className="section-heading">
          <Heading level={2}>Latest advisory</Heading>
          <button
            type="button"
            className="text-button"
            onClick={() => go("advisories")}
          >
            See all
          </button>
        </div>
        <AdvisoryCard
          advisory={advisories[0]}
          onClick={() => go("advisory-detail")}
        />
      </section>
    </div>
  )
}

function AdvisoryCard({
  advisory,
  onClick,
}: {
  advisory: Advisory
  onClick: () => void
}) {
  return (
    <button className="advisory-card" type="button" onClick={onClick}>
      <span className="advisory-icon">
        {advisory.status === "Resolved" ? (
          <CheckCircle2 aria-hidden="true" size={21} />
        ) : (
          <Clock3 aria-hidden="true" size={21} />
        )}
      </span>
      <span className="advisory-copy">
        <span className="advisory-meta">
          <StatusBadge status={advisory.status} />
          <span>{advisory.updated}</span>
        </span>
        <strong>{advisory.title}</strong>
        <span>{advisory.affectedAreas}</span>
      </span>
      <ChevronRight aria-hidden="true" size={19} />
    </button>
  )
}

function BillDetailScreen({
  bill,
  onBack,
  go,
}: {
  bill: Bill
  onBack: () => void
  go: (screen: Screen) => void
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="screen-stack">
      <ScreenHeader
        title="Bill details"
        subtitle={bill.shortPeriod}
        onBack={onBack}
      />
      <Card className="bill-summary-card">
        <StatusBadge status={bill.status} />
        <span className="card-label">Total amount</span>
        <p className="amount-display">{currency.format(bill.amount)}</p>
        <div className="bill-summary-meta">
          <div>
            <span>Due date</span>
            <strong>{bill.dueDate}</strong>
          </div>
          <div>
            <span>Billing period</span>
            <strong>{bill.period}</strong>
          </div>
        </div>
      </Card>

      <Card>
        <div className="section-heading">
          <Heading level={2}>Charge breakdown</Heading>
          <ReceiptText aria-hidden="true" size={20} />
        </div>
        <dl className="detail-list">
          <div>
            <dt>Current water bill</dt>
            <dd>{currency.format(bill.currentBill)}</dd>
          </div>
          {bill.arrears > 0 ? (
            <div>
              <dt>Previous balance</dt>
              <dd>{currency.format(bill.arrears)}</dd>
            </div>
          ) : null}
          {bill.penalty > 0 ? (
            <div>
              <dt>Penalty</dt>
              <dd>{currency.format(bill.penalty)}</dd>
            </div>
          ) : null}
          <div>
            <dt>Senior discount</dt>
            <dd>−{currency.format(bill.discount)}</dd>
          </div>
          <div className="detail-total">
            <dt>Total amount due</dt>
            <dd>{currency.format(bill.amount)}</dd>
          </div>
        </dl>
      </Card>

      <Card className="meter-card">
        <button
          className="disclosure"
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          <span>
            <Gauge aria-hidden="true" size={21} />
            <span>
              <strong>Meter & account details</strong>
              <small>Consumption: {bill.consumption} m³</small>
            </span>
          </span>
          <ChevronDown
            className={expanded ? "rotate" : ""}
            aria-hidden="true"
            size={20}
          />
        </button>
        {expanded ? (
          <dl className="account-detail-grid">
            <div>
              <dt>Account number</dt>
              <dd>00123456</dd>
            </div>
            <div>
              <dt>Meter number</dt>
              <dd>M-458921</dd>
            </div>
            <div>
              <dt>Previous reading</dt>
              <dd>{bill.previousReading} m³</dd>
            </div>
            <div>
              <dt>Current reading</dt>
              <dd>{bill.currentReading} m³</dd>
            </div>
          </dl>
        ) : null}
      </Card>

      {bill.status !== "Paid" ? (
        <Button
          className="button-full sticky-action"
          icon={CreditCard}
          onClick={() => go("payments")}
        >
          Choose payment method
        </Button>
      ) : (
        <div className="alert alert-success">
          <CheckCircle2 aria-hidden="true" size={20} />
          <div>
            <strong>This bill is paid</strong>
            <p>Your payment has been posted to this billing period.</p>
          </div>
        </div>
      )}
      <Button
        variant="secondary"
        className="button-full"
        onClick={() => go("bills")}
      >
        View billing history
      </Button>
    </div>
  )
}

function ConsumptionChart() {
  return (
    <div className="chart-wrap">
      <div className="chart-summary">
        <div>
          <span className="card-label">Current usage</span>
          <strong>21 m³</strong>
        </div>
        <span className="trend-pill">+17% vs last month</span>
      </div>
      <svg
        className="usage-chart"
        viewBox="0 0 340 145"
        role="img"
        aria-labelledby="chart-title chart-description"
      >
        <title id="chart-title">Water consumption over five months</title>
        <desc id="chart-description">
          Consumption was 21 cubic meters in July, 17 in August, 20 in
          September, 18 in October, and 21 in November.
        </desc>
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-cyan)"
              stopOpacity="0.28"
            />
            <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="18" x2="326" y1="108" y2="108" className="chart-grid" />
        <line x1="18" x2="326" y1="66" y2="66" className="chart-grid" />
        <path
          d="M20 54 L96 86 L172 62 L248 78 L324 54 L324 110 L20 110 Z"
          fill="url(#chartFill)"
        />
        <polyline
          points="20,54 96,86 172,62 248,78 324,54"
          className="chart-line"
        />
        {[
          ["20", "54"],
          ["96", "86"],
          ["172", "62"],
          ["248", "78"],
          ["324", "54"],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="4" className="chart-dot" />
        ))}
        {[
          ["20", "Jul"],
          ["96", "Aug"],
          ["172", "Sep"],
          ["248", "Oct"],
          ["324", "Nov"],
        ].map(([x, label]) => (
          <text
            key={label}
            x={x}
            y="136"
            textAnchor="middle"
            className="chart-label"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}

function BillsScreen({ onSelect }: { onSelect: (bill: Bill) => void }) {
  return (
    <div className="screen-stack">
      <ScreenHeader
        title="Bills & usage"
        subtitle="Track your statements and water consumption."
      />
      <Card>
        <ConsumptionChart />
      </Card>
      <div className="comparison-strip">
        <div>
          <Droplets aria-hidden="true" size={20} />
          <span>
            <strong>3 m³ higher</strong>
            <small>than October</small>
          </span>
        </div>
        <p>Tip: Check for dripping taps and running toilets.</p>
      </div>
      <section>
        <div className="section-heading">
          <Heading level={2}>Billing history</Heading>
          <span className="small-muted">Latest first</span>
        </div>
        <div className="bill-list">
          {bills.map((bill) => (
            <button
              className="bill-row"
              type="button"
              key={bill.id}
              onClick={() => onSelect(bill)}
            >
              <span className="bill-row-date">
                <strong>{bill.shortPeriod.split(" ")[0].slice(0, 3)}</strong>
                <span>{bill.shortPeriod.split(" ")[1]}</span>
              </span>
              <span className="bill-row-copy">
                <strong>{currency.format(bill.amount)}</strong>
                <span>{bill.consumption} m³ consumed</span>
              </span>
              <StatusBadge status={bill.status} />
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function PaymentsScreen({
  onBack,
  onSelect,
}: {
  onBack: () => void
  onSelect: (method: PaymentMethod) => void
}) {
  const categories = ["E-wallet", "Payment center", "PPCWD office"] as const
  return (
    <div className="screen-stack">
      <ScreenHeader
        title="Payment options"
        subtitle="Choose the method that works best for you."
        onBack={onBack}
      />
      <Card className="payment-total">
        <div>
          <span className="card-label">Amount due</span>
          <strong>{currency.format(bills[0].amount)}</strong>
        </div>
        <span>Due Nov 18</span>
      </Card>
      <div className="alert alert-info">
        <Info aria-hidden="true" size={20} />
        <div>
          <strong>Pay at least 2 days before the due date</strong>
          <p>Third-party payments may take time to appear in your account.</p>
        </div>
      </div>
      {categories.map((category) => (
        <section key={category}>
          <div className="section-heading">
            <Heading level={2}>{category}</Heading>
          </div>
          <div className="method-list">
            {paymentMethods
              .filter((method) => method.category === category)
              .map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    type="button"
                    className="method-row"
                    onClick={() => onSelect(method)}
                  >
                    <span className="method-icon">
                      <Icon aria-hidden="true" size={22} />
                    </span>
                    <span className="method-copy">
                      <strong>{method.name}</strong>
                      <span>{method.description}</span>
                      <small>{method.timing}</small>
                    </span>
                    <ChevronRight aria-hidden="true" size={20} />
                  </button>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}

function PaymentDetailScreen({
  method,
  onBack,
  onComplete,
}: {
  method: PaymentMethod
  onBack: () => void
  onComplete: () => void
}) {
  const Icon = method.icon
  const [copied, setCopied] = useState(false)
  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText("00123456")
    } catch {
      // Clipboard can be unavailable in embedded previews; the visual feedback remains useful.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="screen-stack">
      <ScreenHeader
        title={method.name}
        subtitle={method.category}
        onBack={onBack}
      />
      <Card className="method-hero">
        <span className="method-hero-icon">
          <Icon aria-hidden="true" size={28} />
        </span>
        <div>
          <span className="card-label">Payment amount</span>
          <p className="amount-display">{currency.format(bills[0].amount)}</p>
          <span>{method.timing}</span>
        </div>
      </Card>
      <Card>
        <div className="section-heading">
          <Heading level={2}>Account reference</Heading>
        </div>
        <div className="copy-row">
          <div>
            <span>PPCWD account number</span>
            <strong>00123456</strong>
          </div>
          <Button
            variant="secondary"
            icon={copied ? Check : Copy}
            onClick={copyAccount}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Card>
      <section>
        <div className="section-heading">
          <Heading level={2}>How to pay</Heading>
        </div>
        <ol className="steps-list">
          {method.steps.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="alert alert-warning">
        <TriangleAlert aria-hidden="true" size={20} />
        <div>
          <strong>This is a design prototype</strong>
          <p>
            No payment will be sent. Continue only to preview the confirmation
            state.
          </p>
        </div>
      </div>
      <Button className="button-full" icon={ExternalLink} onClick={onComplete}>
        I’ve completed payment
      </Button>
    </div>
  )
}

function PaymentPendingScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="completion-screen">
      <div className="completion-icon">
        <Clock3 aria-hidden="true" size={34} />
      </div>
      <span className="eyebrow">Awaiting confirmation</span>
      <Heading level={1}>
        Your account will update after payment is posted.
      </Heading>
      <p>
        This prototype did not process a real payment. In the live experience,
        third-party channels may take 2–3 business days to send confirmation.
      </p>
      <Card className="reference-card">
        <div>
          <span>Account</span>
          <strong>•••• 3456</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong>{currency.format(bills[0].amount)}</strong>
        </div>
        <div>
          <span>Status</span>
          <StatusBadge status="Pending" />
        </div>
      </Card>
      <Button className="button-full" onClick={onDone}>
        Return home
      </Button>
    </div>
  )
}

function AdvisoriesScreen({
  onSelect,
  notifications,
  setNotifications,
}: {
  onSelect: (advisory: Advisory) => void
  notifications: boolean
  setNotifications: (value: boolean) => void
}) {
  return (
    <div className="screen-stack">
      <ScreenHeader
        title="Service advisories"
        subtitle="Official updates for your area."
        trailing={
          <IconButton
            label={
              notifications
                ? "Turn advisory notifications off"
                : "Turn advisory notifications on"
            }
            icon={notifications ? BellRing : Bell}
            onClick={() => setNotifications(!notifications)}
          />
        }
      />
      <Card className="all-clear-card">
        <span className="all-clear-icon">
          <CheckCircle2 aria-hidden="true" size={22} />
        </span>
        <div>
          <strong>No active interruption at your address</strong>
          <p>Water service is operating normally.</p>
        </div>
      </Card>
      <div className="notification-row">
        <div>
          <Bell aria-hidden="true" size={20} />
          <span>
            <strong>Advisory notifications</strong>
            <small>
              {notifications
                ? "On for your service area"
                : "Currently turned off"}
            </small>
          </span>
        </div>
        <button
          type="button"
          className={`switch ${notifications ? "on" : ""}`}
          role="switch"
          aria-checked={notifications}
          onClick={() => setNotifications(!notifications)}
        >
          <span />
        </button>
      </div>
      <section>
        <div className="section-heading">
          <Heading level={2}>Nearby & recent</Heading>
        </div>
        <div className="advisory-list">
          {advisories.map((advisory) => (
            <AdvisoryCard
              key={advisory.id}
              advisory={advisory}
              onClick={() => onSelect(advisory)}
            />
          ))}
        </div>
      </section>
      <div className="help-strip">
        <Info aria-hidden="true" size={19} />
        <p>Updates are based on your linked service address in San Manuel.</p>
      </div>
    </div>
  )
}

function AdvisoryDetailScreen({
  advisory,
  onBack,
}: {
  advisory: Advisory
  onBack: () => void
}) {
  return (
    <div className="screen-stack">
      <ScreenHeader title="Advisory details" onBack={onBack} />
      <div
        className={`advisory-hero ${
          advisory.status === "Resolved" ? "resolved" : ""
        }`}
      >
        <StatusBadge status={advisory.status} />
        <Heading level={1}>{advisory.title}</Heading>
        <p>{advisory.summary}</p>
        <span>{advisory.updated}</span>
      </div>
      <Card>
        <dl className="advisory-facts">
          <div>
            <MapPin aria-hidden="true" size={19} />
            <dt>Affected areas</dt>
            <dd>{advisory.affectedAreas}</dd>
          </div>
          <div>
            <Clock3 aria-hidden="true" size={19} />
            <dt>Expected schedule</dt>
            <dd>{advisory.schedule}</dd>
          </div>
        </dl>
      </Card>
      <section>
        <div className="section-heading">
          <Heading level={2}>What to expect</Heading>
        </div>
        <ol className="timeline">
          {advisory.timeline.map((item) => (
            <li key={item.time}>
              <span aria-hidden="true" />
              <div>
                <strong>{item.time}</strong>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <div className="alert alert-info">
        <Droplets aria-hidden="true" size={20} />
        <div>
          <strong>After service resumes</strong>
          <p>
            Let water run briefly if it appears cloudy, then check again before
            use.
          </p>
        </div>
      </div>
    </div>
  )
}

function ActionRow({
  icon: Icon,
  label,
  detail,
  onClick,
}: {
  icon: LucideIcon
  label: string
  detail: string
  onClick: () => void
}) {
  return (
    <button className="action-row" type="button" onClick={onClick}>
      <span className="action-row-icon">
        <Icon aria-hidden="true" size={20} />
      </span>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <ExternalLink aria-hidden="true" size={17} />
    </button>
  )
}

function AccountScreen({
  notifications,
  setNotifications,
  onUnlink,
  notify,
  onReportIssue,
}: {
  notifications: boolean
  setNotifications: (value: boolean) => void
  onUnlink: () => void
  notify: (message: string) => void
  onReportIssue: () => void
}) {
  const contact = (value: string) => {
    if (value.startsWith("http")) {
      window.open(value, "_blank", "noopener,noreferrer")
    } else {
      window.location.href = value
    }
  }
  return (
    <div className="screen-stack">
      <ScreenHeader
        title="Account & help"
        subtitle="Manage your linked service."
      />
      <Card className="profile-card">
        <div className="avatar">MS</div>
        <div>
          <Heading level={2}>Maria Santos</Heading>
          <p>Account •••• 3456</p>
          <span className="verified-line">
            <BadgeCheck aria-hidden="true" size={15} /> Linked service
          </span>
        </div>
      </Card>
      <Card>
        <div className="address-block">
          <MapPin aria-hidden="true" size={20} />
          <div>
            <span className="card-label">Service address</span>
            <strong>
              South National Highway, Brgy. San Manuel, Puerto Princesa City
            </strong>
          </div>
        </div>
        <div className="account-mini-grid">
          <div>
            <span>Meter no.</span>
            <strong>M-458921</strong>
          </div>
          <div>
            <span>Service</span>
            <strong>Active</strong>
          </div>
        </div>
      </Card>
      <button
        className="report-entry-card"
        type="button"
        onClick={onReportIssue}
      >
        <span>
          <Camera aria-hidden="true" size={23} />
        </span>
        <span>
          <strong>Report a water issue</strong>
          <small>Share a photo, voice note, description, and location.</small>
        </span>
        <ChevronRight aria-hidden="true" size={20} />
      </button>
      <div className="notification-row">
        <div>
          <Bell aria-hidden="true" size={20} />
          <span>
            <strong>Service notifications</strong>
            <small>Billing and advisory updates</small>
          </span>
        </div>
        <button
          type="button"
          className={`switch ${notifications ? "on" : ""}`}
          role="switch"
          aria-checked={notifications}
          onClick={() => setNotifications(!notifications)}
        >
          <span />
        </button>
      </div>
      <section>
        <div className="section-heading">
          <Heading level={2}>Contact PPCWD</Heading>
          <span className="small-muted">Mon–Fri, 8 AM–5 PM</span>
        </div>
        <div className="action-list">
          <ActionRow
            icon={Phone}
            label="Call landline"
            detail="(048) 433-2408"
            onClick={() => contact("tel:+63484332408")}
          />
          <ActionRow
            icon={MessageSquare}
            label="Send a message"
            detail="0917-310-5282"
            onClick={() => contact("sms:+639173105282")}
          />
          <ActionRow
            icon={Mail}
            label="Email support"
            detail="ppcwd@ppcwater.gov.ph"
            onClick={() => contact("mailto:ppcwd@ppcwater.gov.ph")}
          />
          <ActionRow
            icon={MessageSquare}
            label="Facebook"
            detail="@PPCWATER"
            onClick={() => contact("https://facebook.com/PPCWATER")}
          />
          <ActionRow
            icon={Globe2}
            label="Visit website"
            detail="ppcwater.gov.ph"
            onClick={() => contact("https://www.ppcwater.gov.ph")}
          />
        </div>
      </section>
      <section>
        <div className="section-heading">
          <Heading level={2}>More</Heading>
        </div>
        <div className="simple-list">
          <button
            type="button"
            onClick={() =>
              notify("Privacy information opened in prototype mode.")
            }
          >
            <ShieldCheck aria-hidden="true" size={20} />
            <span>Privacy & data use</span>
            <ChevronRight aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            onClick={() => notify("PPCWD mobile prototype · Version 1.0")}
          >
            <Info aria-hidden="true" size={20} />
            <span>About this app</span>
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </section>
      <Button
        variant="danger"
        className="button-full"
        icon={LogOut}
        onClick={onUnlink}
      >
        Unlink this account
      </Button>
    </div>
  )
}

function ConfirmSheet({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlink-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <IconButton label="Close" icon={X} onClick={onCancel} />
        <span className="sheet-icon">
          <Link2 aria-hidden="true" size={24} />
        </span>
        <Heading level={2} className="sheet-title">
          <span id="unlink-title">Unlink this account?</span>
        </Heading>
        <p>You’ll need your account and meter numbers to link it again.</p>
        <div className="sheet-actions">
          <Button variant="danger" onClick={onConfirm}>
            Yes, unlink
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Keep account
          </Button>
        </div>
      </div>
    </div>
  )
}

function ConsumerApp({
  onStaffAccess,
  submittedRequests,
  onSubmitRequest,
}: {
  onStaffAccess: () => void
  submittedRequests: ServiceRequest[]
  onSubmitRequest: (request: ServiceRequest) => void
}) {
  const [screen, setScreen] = useState<Screen>("welcome")
  const [history, setHistory] = useState<Screen[]>([])
  const [selectedBill, setSelectedBill] = useState<Bill>(bills[0])
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory>(
    advisories[0],
  )
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    paymentMethods[0],
  )
  const [notifications, setNotifications] = useState(true)
  const [pendingPayment, setPendingPayment] = useState(false)
  const [showUnlink, setShowUnlink] = useState(false)
  const [toast, setToast] = useState("")
  const activeRequest = submittedRequests[0]
  const [selectedRequestId, setSelectedRequestId] = useState<string>()
  const selectedRequest =
    submittedRequests.find((request) => request.id === selectedRequestId) ??
    activeRequest

  const go = (next: Screen) => {
    setHistory((items) => [...items, screen])
    setScreen(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navigateTab = (next: Screen) => {
    setHistory([])
    setScreen(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const back = () => {
    const next = history.at(-1) ?? "home"
    setHistory((items) => items.slice(0, -1))
    setScreen(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2400)
  }

  const activeTab =
    screen === "home" ||
    screen === "bills" ||
    screen === "advisories" ||
    screen === "account"
      ? screen
      : undefined

  let content: ReactNode
  if (screen === "welcome") {
    content = (
      <WelcomeScreen
        onContinue={() => go("link")}
        onStaffAccess={onStaffAccess}
      />
    )
  } else if (screen === "link") {
    content = (
      <LinkAccountScreen onBack={back} onSuccess={() => navigateTab("home")} />
    )
  } else if (screen === "home") {
    content = (
      <HomeScreen
        go={go}
        pendingPayment={pendingPayment}
        activeRequest={activeRequest}
        requestCount={submittedRequests.length}
        onOpenRequest={(request) => {
          setSelectedRequestId(request.id)
          go("request-status")
        }}
      />
    )
  } else if (screen === "bills") {
    content = (
      <BillsScreen
        onSelect={(bill) => {
          setSelectedBill(bill)
          go("bill-detail")
        }}
      />
    )
  } else if (screen === "bill-detail") {
    content = <BillDetailScreen bill={selectedBill} onBack={back} go={go} />
  } else if (screen === "payments") {
    content = (
      <PaymentsScreen
        onBack={back}
        onSelect={(method) => {
          setSelectedMethod(method)
          go("payment-detail")
        }}
      />
    )
  } else if (screen === "payment-detail") {
    content = (
      <PaymentDetailScreen
        method={selectedMethod}
        onBack={back}
        onComplete={() => go("payment-pending")}
      />
    )
  } else if (screen === "payment-pending") {
    content = (
      <PaymentPendingScreen
        onDone={() => {
          setPendingPayment(true)
          navigateTab("home")
        }}
      />
    )
  } else if (screen === "advisories") {
    content = (
      <AdvisoriesScreen
        notifications={notifications}
        setNotifications={setNotifications}
        onSelect={(advisory) => {
          setSelectedAdvisory(advisory)
          go("advisory-detail")
        }}
      />
    )
  } else if (screen === "advisory-detail") {
    content = <AdvisoryDetailScreen advisory={selectedAdvisory} onBack={back} />
  } else if (screen === "report-issue") {
    content = (
      <ReportIssueFlow
        referenceId={`SR-${2486 + submittedRequests.length}`}
        onBack={back}
        onViewAdvisory={() => {
          setSelectedAdvisory(advisories[0])
          go("advisory-detail")
        }}
        onSubmit={(request) => {
          setSelectedRequestId(request.id)
          onSubmitRequest(request)
          go("report-success")
        }}
      />
    )
  } else if (screen === "report-success" && selectedRequest) {
    content = (
      <RequestStatusScreen
        request={selectedRequest}
        confirmation
        onBack={() => go("request-status")}
        onHome={() => navigateTab("home")}
      />
    )
  } else if (screen === "reported-issues") {
    content = (
      <ReportedIssuesScreen
        requests={submittedRequests}
        onBack={back}
        onReportAnother={() => go("report-issue")}
        onSelect={(request) => {
          setSelectedRequestId(request.id)
          go("request-status")
        }}
      />
    )
  } else if (screen === "request-status" && selectedRequest) {
    content = (
      <RequestStatusScreen
        request={selectedRequest}
        onBack={back}
        onHome={() => navigateTab("home")}
      />
    )
  } else {
    content = (
      <AccountScreen
        notifications={notifications}
        setNotifications={setNotifications}
        onUnlink={() => setShowUnlink(true)}
        notify={notify}
        onReportIssue={() => go("report-issue")}
      />
    )
  }

  return (
    <div className="preview-shell">
      <AppFrame active={activeTab} onNavigate={navigateTab}>
        {content}
      </AppFrame>
      {showUnlink ? (
        <ConfirmSheet
          onCancel={() => setShowUnlink(false)}
          onConfirm={() => {
            setShowUnlink(false)
            setPendingPayment(false)
            setHistory([])
            setScreen("welcome")
          }}
        />
      ) : null}
      {toast ? (
        <div className="toast" role="status">
          <CheckCircle2 aria-hidden="true" size={18} />
          {toast}
        </div>
      ) : null}
    </div>
  )
}

export default function App() {
  const [experience, setExperience] = useState<"consumer" | "staff">("consumer")
  const [submittedRequests, setSubmittedRequests] = useState<ServiceRequest[]>(
    [],
  )

  const updateSubmittedRequest = (request: ServiceRequest) => {
    setSubmittedRequests((items) =>
      items.map((item) => (item.id === request.id ? request : item)),
    )
  }

  if (experience === "staff") {
    return (
      <Suspense
        fallback={
          <div className="staff-portal-loading" role="status">
            <img src="/assets/ppcwd-seal.png" alt="" />
            <LoaderCircle className="spin" aria-hidden="true" size={22} />
            <span>Opening staff workspace…</span>
          </div>
        }
      >
        <AdminApp
          onExit={() => setExperience("consumer")}
          submittedRequests={submittedRequests}
          onUpdateSubmittedRequest={updateSubmittedRequest}
        />
      </Suspense>
    )
  }

  return (
    <ConsumerApp
      onStaffAccess={() => setExperience("staff")}
      submittedRequests={submittedRequests}
      onSubmitRequest={(request) =>
        setSubmittedRequests((items) => [
          request,
          ...items.filter((item) => item.id !== request.id),
        ])
      }
    />
  )
}
