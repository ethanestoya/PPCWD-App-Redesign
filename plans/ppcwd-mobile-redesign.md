# PPCWD Mobile Application UI/UX Redesign Plan

## Objective

Create a polished, interactive mobile-first React prototype that redesigns PPCWD’s consumer experience around the four questions users most urgently need answered:

1. How much do I owe?
2. When is payment due?
3. How can I pay?
4. Is my water service affected by an advisory?

The prototype will cover the selected **core service journey** and modernize PPCWD’s existing institutional identity rather than replacing it. It will use representative local mock data and client-side interactions only; no authentication, PPCWD API, live payment gateway, or persistent backend is in scope.

## Grounded Findings From the Current App

The implementation should directly address these observed issues from the Google Play listing and screenshots:

- The dashboard emphasizes aggregate counts instead of the user’s next task.
- Amount due, due date, status, and payment action compete visually with secondary account details.
- Important sections are hidden behind hamburger navigation.
- Account linking has limited guidance, weak field labeling, and no visible validation or recovery states.
- Payment instructions are dense, document-like, and hard to scan on mobile.
- Billing history combines a compressed chart with a small, crowded table.
- Advisories are listed as a key product capability but are not prominent in the supplied screens.
- Contact details are passive text rather than direct actions.
- Small gray text, low contrast, tight spacing, and undersized targets reduce accessibility.
- Gradients, shadows, cards, spacing, and hierarchy are inconsistent across screens.

## Product Scope

### Included screens and states

1. **Welcome / account-linking flow**
   - Short branded welcome state explaining the app’s value.
   - Account number and meter number fields with persistent labels, format hints, visibility/help affordances, and inline validation.
   - Privacy reassurance explaining how account information is used.
   - Loading/submitting state.
   - Successful linked-account transition into the home dashboard.
   - Representative invalid-details error state that can be triggered and recovered from.

2. **Home dashboard**
   - Greeting and compact PPCWD brand header.
   - Service-status module with a clear normal/advisory state.
   - Primary bill card showing amount due, due date, billing period, status, and a strong `Pay bill` action.
   - Contextual urgency messaging without relying on color alone.
   - Quick actions for bill details, billing history, payment options, and contact/help.
   - Latest advisory preview.
   - Compact consumption comparison showing current usage versus the previous month.

3. **Bill details / statement of account**
   - Hero summary for amount due, due date, and bill status.
   - Clear fee breakdown with current bill, arrears, penalties, discounts, and total.
   - Collapsible secondary account and meter details.
   - Billing period and readings shown in plain language.
   - Primary `Choose payment method` action and secondary `View billing history` action.

4. **Payment flow**
   - Scannable categories for e-wallet, payment centers, and PPCWD collection offices.
   - Selectable payment methods with recognizable labels and supporting metadata.
   - Focused instructions view for the selected option instead of displaying every instruction at once.
   - Amount summary, service/processing note, and explicit “payment happens outside this prototype” handoff.
   - Completion acknowledgement that returns to Home and shows a temporary pending-payment status; it must not imply a real transaction occurred.

5. **Billing history**
   - Readable consumption trend with an accessible summary and simple CSS/SVG visualization.
   - Current-versus-previous-month comparison.
   - Tap-friendly chronological bill cards showing period, consumption, amount, and payment status.
   - Bill selection opens the bill detail screen with the chosen historical record.

6. **Advisories**
   - Dedicated advisory feed reachable from bottom navigation.
   - Severity/status, affected areas, schedule, and update time.
   - Advisory detail view with an easy-to-scan timeline and service guidance.
   - Notification preference toggle represented locally in the UI.
   - Both active-advisory and all-clear states represented in mock data/state.

7. **Account and help**
   - Linked service-account summary.
   - Notification preference control.
   - Direct contact action rows for phone, SMS, email, Facebook, website, and office directions.
   - “Switch/unlink account” confirmation; unlinking returns to the account-linking flow.
   - About/privacy/support links presented as prototype actions with non-disruptive feedback.

### Explicitly excluded

- Real PPCWD login, identity verification, API calls, or database persistence.
- Real payment processing or third-party payment app launches beyond illustrative link behavior.
- Multiple linked accounts beyond showing where a future account switcher would live.
- Production analytics, push notifications, maps, customer-support chat, or downloadable official receipts.
- Admin/staff workflows.

## Information Architecture and Navigation

Use a persistent four-item bottom navigation after an account is linked:

- **Home**
- **Bills**
- **Advisories**
- **Account**

Use contextual headers with back buttons for detail screens. Keep a small client-side navigation stack so browser-like forward/back flows are predictable without adding a routing dependency. Primary transitions:

- Welcome → Link account → Home
- Home bill card → Current bill details
- Home `Pay bill` or Bill details CTA → Payment methods → Payment instructions → Pending acknowledgement → Home
- Home consumption module or Bills tab → Billing history → Historical bill details
- Home advisory preview or Advisories tab → Advisory detail
- Account → Contact/help actions or Unlink confirmation → Welcome

Bottom-nav items should preserve their local scroll position where practical. Detail-screen back actions return to the originating screen, not always Home.

## Visual and Interaction Direction

### Brand system

- Preserve PPCWD’s official deep blue as the anchor color.
- Add restrained water-inspired cyan/teal accents for interactive and informational states.
- Use warm amber/red only for due-soon, overdue, or disruptive advisory states.
- Use the official PPCWD seal/app identity from the referenced listing as a local asset where resolution is adequate; do not fabricate a replacement seal.
- Avoid the current heavy gradient/shadow treatment. Use a light cool-gray canvas, crisp white surfaces, subtle borders, and selective soft elevation.

### Typography and layout

- Use a clean public Google sans-serif suitable for dense numeric and civic-service content, wired through `src/index.css`.
- Establish clear display, title, body, label, and numeric styles with tabular numerals for amounts/readings.
- Design first for approximately 390px mobile width, with safe-area-aware top and bottom spacing.
- Cap the app shell to a phone-like maximum width on larger previews while allowing the surrounding desktop canvas to remain neutral.
- Use an 8px spacing rhythm, generous section gaps, and minimum 44px interactive targets.

### Components

Create reusable, locally defined UI primitives rather than repeating screen-specific markup:

- App shell and screen header
- Bottom navigation
- Button variants
- Card/surface
- Status badge
- Amount display
- Form field and inline error
- Modal/bottom sheet for confirmations
- Quick-action tile
- Advisory card
- Bill row/card
- Payment method row
- Toast/inline feedback
- Simple consumption chart

Use a consistent icon family. Add `lucide-react` as the only new runtime dependency if no icon library exists; do not use emoji or text glyphs as interface icons.

## Data and State Model

Keep typed representative data in `src/App.tsx` or a small local module only if separation materially improves readability:

- `ConsumerAccount`: account number, meter number, consumer name, service address, account status.
- `Bill`: id, period, previous/current reading, consumption, line items, amount, due date, status.
- `Advisory`: id, title, severity, status, affected areas, start/end timing, updated time, details/timeline.
- `PaymentMethod`: id, category, name, description, steps, processing note.

Use React state for:

- Current screen and navigation stack.
- Linked/unlinked account state.
- Form values, validation, and simulated submission.
- Selected bill, advisory, and payment method.
- Notification preference.
- Pending-payment acknowledgement.
- Confirmation sheet and transient feedback.

Use deterministic seeded mock records based on the current screenshots’ structure, but avoid exposing real personal data. Format Philippine peso amounts and local dates consistently. Buttons that cannot perform real-world actions should either use safe `tel:`, `mailto:`, or external links where appropriate, or show explicit prototype feedback rather than failing silently.

## Error, Empty, and Edge States

- Required and malformed account-link fields show inline, field-specific errors and move focus to the first invalid field.
- A documented demo input or explicit demo-action allows reviewers to trigger a successful link without guessing credentials.
- A simulated invalid account response is recoverable without clearing both fields.
- Long consumer names, addresses, advisory titles, and currency values wrap without breaking layout.
- Payment acknowledgement clearly says “pending confirmation” and never claims PPCWD received funds.
- Overdue, due-soon, paid, and pending statuses use text plus icon/color.
- Advisory cards support active, scheduled, resolved, and all-clear states.
- The prototype remains usable if motion is reduced and avoids critical interactions that depend on hover.

## Accessibility Requirements

- Semantic headings, navigation, buttons, forms, lists, and expandable controls.
- Visible keyboard focus and logical tab order.
- Programmatic labels and error associations on all inputs.
- `aria-current` on bottom navigation and expanded state on disclosures.
- At least WCAG AA contrast for text and controls.
- Minimum 44px touch targets.
- Status is never communicated through color alone.
- Chart includes a textual summary and labeled values so meaning is not visual-only.
- Respect `prefers-reduced-motion`; keep transitions short and functional.

## Repository Changes

### `src/App.tsx`

Replace the empty scaffold with the complete interactive prototype, reusable local components, typed mock data, navigation/state handling, and screen composition. Keep complexity in one file only while it remains readable; split into focused modules only if the implementation becomes difficult to maintain.

### `src/index.css`

Keep the Tailwind v4 import first. Add the Google font import if used, design tokens/custom properties, body/root defaults, safe-area handling, reduced-motion behavior, and any narrowly scoped styles needed for the chart or app shell. Use Tailwind utilities in JSX for the majority of styling.

### `public/`

Add a locally stored PPCWD identity asset sourced from the referenced public app listing if it is used in the UI. Preserve aspect ratio and provide meaningful alt text where the image conveys identity.

### `package.json` / lockfile

Add `lucide-react` for a coherent icon system if required by implementation. Do not add routing, charting, form, or component-framework dependencies for this prototype.

## Implementation Sequence

1. Establish tokens, font, app shell, representative mock data, and state/navigation model.
2. Build reusable controls and navigation primitives with accessibility behavior.
3. Implement welcome/account linking and its validation/success/error states.
4. Implement the task-focused Home dashboard.
5. Implement current and historical bill detail plus billing history visualization.
6. Implement payment selection, instructions, and pending acknowledgement.
7. Implement advisories feed/detail and account/help destinations.
8. Add confirmation, toast/feedback, empty/resolved states, safe-area behavior, and reduced-motion handling.
9. Polish responsive behavior, text wrapping, focus states, consistency, and interaction transitions.

## Verification

Because this is a broad UI implementation, run the repository’s prescribed checks after implementation:

1. `pnpm run build` — must complete successfully with TypeScript and Vite production output.
2. `pnpm run format` — run the repository formatter, then review the diff to ensure formatting did not introduce unintended changes.
3. Re-run `pnpm run build` if formatting changed source files.
4. Use the already-running Figma Make preview; do not start another development server.
5. Manually verify at narrow mobile width and a larger desktop preview:
   - Successful and invalid account linking.
   - Bottom navigation and contextual back behavior.
   - Current bill → payment method → instructions → pending acknowledgement.
   - Billing history → historical bill detail.
   - Advisory feed → detail and notification toggle.
   - Account contact actions and unlink confirmation.
   - Keyboard focus visibility, long-text wrapping, touch-target sizing, and no horizontal overflow.
   - Reduced-motion behavior and readable status treatment without color dependence.

## Acceptance Criteria

- The prototype presents a coherent end-to-end core consumer journey, not disconnected static screens.
- Amount due, due date, payment CTA, and active service advisory are understandable within seconds of reaching Home.
- Users can link a demo account, inspect a bill, choose a payment channel, review payment instructions, inspect billing history, read an advisory, and manage basic account/help options.
- Visual language clearly belongs to PPCWD while feeling substantially more modern, consistent, readable, and trustworthy than the current screenshots.
- No action misleadingly claims to perform real authentication, payment, notification enrollment, or account mutation.
- Mobile layout has no horizontal overflow, controls meet touch-size expectations, and primary flows work with keyboard input.
- Production build succeeds using the repository’s existing toolchain.
