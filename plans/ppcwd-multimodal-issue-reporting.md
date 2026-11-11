# PPCWD Multimodal Issue Reporting — Implementation Plan

## Objective

Add an AI-assisted **Report a Water Issue** journey that lets a linked consumer combine a photo, voice description, typed notes, and location context into a structured PPCWD service request. The same request must then appear in the existing Staff/Admin Service Requests workspace with the original evidence, an editable AI triage summary, and clear provenance.

This phase is an interactive prototype with production-ready seams:

- Local capture and preview interactions are real where browser APIs allow.
- Multimodal interpretation is deterministic and simulated so the demo is fast, repeatable, and does not require credentials or a backend.
- Analysis and request-storage behavior sit behind typed adapters that can later be replaced by secure server-side inference, upload storage, and durable persistence.
- AI assists with transcription, summarization, categorization, and urgency signals, but never silently submits, closes, or dispatches a request.

## Grounded Repository Findings

- The project is a frontend-only React 19 + Vite prototype. It has no backend, routing library, persistence layer, AI SDK, or test framework.
- Consumer navigation is state-driven in `src/App.tsx`, with a history stack and four bottom tabs: Home, Bills, Advisories, and Account.
- Home already contains a four-item Quick Actions grid; “Get help” currently routes to Account & Help.
- Account & Help provides PPCWD phone, SMS, email, Facebook, and website channels, making it a second natural entry point for issue reporting.
- Staff/Admin is lazy-loaded from `src/admin/AdminApp.tsx`, has role-based permissions, and already supports service-request search, filtering, details, assignment, status changes, notes, audit entries, and responsive desktop/mobile layouts.
- `ServiceRequest` currently stores only structured text fields and notes. Staff request state is local to `AdminApp`, while the consumer and staff experiences are selected one at a time by the top-level `App`.
- The existing visual system uses Manrope, PPCWD navy/deep navy, cyan accents, shared cards/buttons/status treatments, and Lucide icons.
- The repository’s prescribed verification commands are `pnpm run format` and `pnpm run build`; the development server is already supervised and must not be started manually.

## Product Scope

### Primary demo scenario

Maria Santos reports a suspected leak or low-pressure issue at her linked San Manuel service address:

1. She opens **Report issue** from Home.
2. She adds a photo or uses a deterministic demo photo, records a short voice note or uses demo narration, and confirms the linked service address.
3. The prototype analyzes the inputs and produces a transcript, concise summary, suggested category, urgency signal, extracted observations, and a possible match to a nearby advisory.
4. Maria reviews and edits every structured field before submission.
5. She receives a service-request reference and can track its status from Home.
6. Switching to Staff Access in the same browser session shows the submitted request at the top of Service Requests.
7. Staff can inspect original evidence and AI suggestions, assign the request, update its status, and add internal notes.
8. Returning to the consumer experience reflects the updated request status.

### Included

- Entry points from Home Quick Actions and Account & Help.
- A short, guided consumer flow optimized for mobile:
  - issue introduction and privacy guidance;
  - photo input with camera/gallery support and local preview;
  - voice recording controls with typed-description fallback;
  - linked-address confirmation and optional location detail;
  - deterministic analysis/loading state;
  - editable review;
  - explicit consent and submission;
  - confirmation and request-status view.
- A deterministic “Use demo evidence” path for desktop browsers, denied permissions, and repeatable presentations.
- Bilingual input treatment: English and Filipino voice/text may be represented in the transcript; the generated operational summary remains concise English for staff consistency. The user can edit both transcript/description and summary-derived fields before submission.
- Cross-check messaging for a possible related advisory. It must be phrased as a possible match and must not block submission.
- Session-level shared request state between consumer and lazy-loaded staff experiences.
- Staff evidence review, AI provenance, confidence/attention labels, and standard request-management actions.
- Failure, empty, permission-denied, low-confidence, offline-like, and unsupported-browser prototype states.
- Accessible keyboard, screen-reader, reduced-motion, and touch behavior.

### Explicitly excluded from this phase

- Real AI or speech-to-text API calls.
- A server, database, Payload CMS, cloud object storage, authentication changes, or cross-device persistence.
- Background uploads, push/SMS notifications, maps, reverse geocoding, or real dispatch integration.
- Automatic emergency classification, automatic crew dispatch, automatic request closure, or automatic advisory publication.
- Face recognition, identity inference, meter-number OCR as an authoritative account-linking mechanism, or retaining media beyond the current page session.
- Changes to Staff/Admin role permissions; both existing Staff and Admin roles may manage service requests under `requests:manage`.

## Information Architecture and Navigation

### Consumer screen additions

Extend the consumer `Screen` union with:

- `report-issue`
- `report-review`
- `report-success`
- `request-status`

Use the existing history-stack behavior for back navigation. Keep the four bottom tabs unchanged to avoid displacing core billing/advisory navigation.

### Entry points

- Replace Home’s **Get help** quick action with **Report issue**, using an appropriate Lucide camera/message or wrench-related icon.
- Add a prominent **Report a water issue** card above the contact-channel list on Account & Help.
- Preserve all existing contact methods as escalation/fallback options.
- After the first submission, show a compact **Active request** card on Home with reference, type, current status, and a “View request” action.

### Staff entry

- Do not add a new staff navigation destination.
- Insert consumer-submitted records into the existing **Service requests** list, sorted ahead of older mock records.
- Add a “Multimodal intake” source label and evidence count to relevant list rows without making standard text-only records look incomplete.

## Consumer Experience

### 1. Report issue intake

Use one guided screen with clearly separated evidence cards rather than a long generic form.

Header:

- Title: “Report a water issue”
- Subtitle: “Share what you see or hear. You’ll review everything before sending.”
- Back action using the existing `ScreenHeader`.

Issue prompt:

- Optional quick categories: Leak, No water, Low pressure, Meter concern, Water quality, Other.
- Category selection is optional before analysis; the simulator can suggest one.
- Include a compact safety note: for hazards involving electrical lines, flooding that threatens safety, or immediate danger, call the PPCWD emergency/contact number rather than relying only on the app.

Photo evidence:

- Native `<input type="file" accept="image/*" capture="environment">`.
- Show a thumbnail preview, filename, replace action, and remove action.
- Accept one photo in this prototype to keep the review surface focused; the adapter schema should support an array for future expansion.
- Validate file type and a documented prototype size limit before preview.
- Provide **Use demo photo** when no image is selected.
- Revoke generated object URLs when evidence is replaced, removed, or the component unmounts.

Voice and text:

- Primary action: **Record voice note**.
- If `MediaRecorder` is available, show recording, elapsed time, stop, playback, replace, and remove controls. The local audio blob is passed to the analyzer adapter, but the simulator returns a deterministic transcript.
- If microphone permission is denied or unsupported, explain the issue inline and keep typed description fully available.
- Provide **Use demo narration** for deterministic presentations; it seeds a short Filipino/English report and simulated duration.
- Typed description remains available at all times and is never treated as lower priority than voice.

Location context:

- Default to Maria’s linked service address and barangay.
- Let the user choose “At my service address” or “Another nearby location.”
- For another location, collect a required landmark/address note.
- Offer a clearly optional **Share current location** control behind a location adapter. The prototype adapter returns deterministic San Manuel coordinates after a brief pending state; denied/unsupported states fall back to the landmark field.
- Explain that location is used to help PPCWD identify the affected line or area.

Analysis eligibility:

- Require at least one descriptive modality: photo, voice/demo narration, or typed text.
- Require usable location context: linked address or a nonempty alternate-location description.
- The primary action reads **Review report** rather than “Send.”

### 2. Analysis transition

- Show a short inline progress sequence such as “Reviewing evidence,” “Organizing details,” and “Checking nearby advisories.”
- Keep it deterministic and brief; respect `prefers-reduced-motion`.
- If simulated analysis fails, preserve all captured evidence and offer **Try again** plus **Review manually**.
- Never imply that the model has confirmed a leak, contamination, or emergency.

### 3. Review before submission

Present two visually distinct sections:

**Your evidence**

- Photo thumbnail with full-size lightbox/dialog.
- Audio playback and transcript.
- Typed description.
- Location/address and whether precise coordinates were shared.
- Edit links that return to intake without discarding other evidence.

**Suggested request details**

- Editable request type.
- Editable concise description.
- Read-only “Suggested attention” label: Normal, High, or Urgent, with plain-language rationale.
- Extracted observations as removable chips, for example “visible water flow,” “near meter box,” and “ongoing since this morning.”
- Analysis confidence represented as user-friendly “Ready to review” or “Needs more detail,” not as a misleading precise percentage.
- Possible advisory match card when relevant: “A scheduled pressure reduction may affect San Manuel.” Actions: **View advisory** and **Continue report**. Continuing remains available.

Consent and submission:

- Require an unchecked confirmation: “I confirm this report and media may be used by PPCWD to assess and respond to this service concern.”
- State that AI organized the report and PPCWD staff will review it.
- Submission creates the shared request only after the consumer presses **Submit report**.
- Prevent duplicate submissions while pending.

### 4. Confirmation and tracking

Confirmation:

- Create deterministic reference `SR-2486` for the first submitted demo report.
- Show request type, service area, submitted time, initial status `New`, and next-step expectations.
- Actions: **Track request** and **Back to home**.
- Avoid promising a response time that PPCWD has not defined.

Request status:

- Show a four-step timeline: Submitted, Assigned, In progress, Resolved.
- Map `Awaiting customer` to an inline action-needed state without inventing a fifth permanent stage.
- Show submitted summary and evidence count.
- Provide PPCWD contact actions for urgent follow-up.
- Staff-side updates made during the same app session must be reflected here and on the Home active-request card.

## Deterministic Multimodal Analysis

Create a simulator with an asynchronous interface and fixed latency. It should derive stable output from broad input conditions rather than pretending to inspect arbitrary pixels:

- Demo evidence returns the canonical “suspected leak near meter box” analysis.
- User photo + low-pressure category/text returns a low-pressure analysis.
- Text containing no-water, leak, meter, pressure, cloudy/discolored, or flooding terms maps to the corresponding request category and attention rationale.
- Filipino keywords used in the demo (`mahina`, `walang tubig`, `tagas`, `metro`) map to the same categories.
- Sparse or conflicting input returns `needsMoreDetail: true` and a conservative Normal/High suggestion.
- “Urgent” may be suggested only for deterministic danger/flooding/no-water patterns and must include “Staff must confirm” copy.
- The analyzer may surface a possible San Manuel advisory match from the existing advisory fixture, but it must not declare causality or auto-cancel the report.

The simulator output should contain:

- transcript and detected language label;
- suggested request type;
- concise staff-facing summary;
- observations;
- suggested priority and rationale;
- confidence band (`high`, `medium`, `low`);
- `needsMoreDetail`;
- optional advisory match;
- model provenance label such as “Prototype analysis.”

## Data Model and Production Seams

### Shared request types

Move the service-request contract out of the admin-only type file into a small shared feature module so the top-level app and both experiences can use it without importing the Staff/Admin implementation.

Add types equivalent to:

```ts
type RequestStatus =
  | "New"
  | "Assigned"
  | "In progress"
  | "Awaiting customer"
  | "Resolved"

type IntakeSource = "staff" | "consumer-multimodal"

interface RequestEvidence {
  id: string
  kind: "image" | "audio"
  name: string
  mimeType: string
  previewUrl?: string
  durationSeconds?: number
}

interface MultimodalIntake {
  source: "consumer-multimodal"
  transcript?: string
  typedDescription?: string
  evidence: RequestEvidence[]
  location: {
    label: string
    barangay: string
    latitude?: number
    longitude?: number
    precisionShared: boolean
  }
  observations: string[]
  suggestedPriority: ServiceRequest["priority"]
  priorityRationale: string
  confidence: "high" | "medium" | "low"
  needsMoreDetail: boolean
  advisoryMatch?: { id: string; title: string }
  provenance: "Prototype analysis"
  consentedAt: string
}
```

Extend `ServiceRequest` with optional `intake?: MultimodalIntake` so existing fixtures remain valid.

Do not store raw `File` or `Blob` objects in the durable request contract. The prototype may keep local blob/object URLs in session UI state; a production adapter would replace those with authenticated asset IDs/URLs.

### Analysis adapter

Define:

```ts
interface MultimodalAnalyzer {
  analyze(input: MultimodalAnalysisInput): Promise<MultimodalAnalysisResult>
}
```

Implement `prototypeMultimodalAnalyzer` in a feature-scoped module. UI components must depend on the interface, not simulator internals.

A production replacement will:

- send media through an authenticated server endpoint, never directly from the browser to a private AI key;
- upload media to protected storage;
- run transcription/vision and structured-output validation server-side;
- return the same normalized result contract;
- apply retention, access-control, rate-limit, content-safety, and audit policies.

### Location adapter

Define a small `LocationProvider` interface returning permission-aware success or a typed failure (`denied`, `unavailable`, `unsupported`). Use a deterministic provider in this prototype. This prevents location UI from depending directly on browser geolocation behavior.

### Shared session request state

Keep the initial Staff/Admin fixtures inside the lazy-loaded admin bundle.

Lift only consumer-submitted request records to top-level `App`:

- `submittedRequests`
- `onSubmitRequest`
- `onUpdateSubmittedRequest`

Pass these props to both `ConsumerApp` and lazy-loaded `AdminApp`.

Inside `AdminApp`:

- Combine `submittedRequests` with existing local fixture requests for list/search/detail rendering.
- Route updates for a submitted request back through `onUpdateSubmittedRequest`.
- Continue updating fixture requests in existing admin-local state.

This preserves the consumer app’s initial bundle split while allowing same-session consumer/staff continuity.

## Staff/Admin Experience

### Request list

For records with `intake.source === "consumer-multimodal"`:

- Show a “Multimodal intake” badge.
- Show photo/audio evidence count.
- Preserve existing priority, status, assignee, consumer, and area hierarchy.
- Sort a newly submitted record first.
- Ensure existing status filters and search include the new record and its transcript/observations where useful.

### Request detail

Enhance the existing detail screen only when `request.intake` exists:

- Add an **AI-assisted intake** card near Request details.
- Clearly label the result as prototype/AI-assisted and “Review before action.”
- Show suggested category/priority, rationale, confidence band, observations, and possible advisory match.
- Show the consumer’s original text separately from the generated summary.
- Show image thumbnail/full-size dialog, audio playback, transcript, and location details.
- Do not expose precise coordinates in list rows; reveal them only in request detail.
- Keep existing assignment, status, and internal-note controls unchanged.
- Add a staff action to **Accept suggested triage** only if it would change the current type/priority; applying it requires an explicit click and adds an audit entry.
- Staff may continue managing the request normally even when analysis confidence is low.

### Audit behavior

Add audit entries for:

- consumer multimodal request received;
- staff accepted suggested triage;
- existing assignment/status updates.

Do not create audit noise for opening media previews or playing audio.

## Privacy, Safety, and Trust

- Explain before capture what media and location are used for.
- Require explicit consent at submission, not at initial exploration.
- Do not request microphone or location permission until the user presses the related control.
- Keep typed input and linked-address reporting available when permissions are denied.
- Never display precise coordinates on staff list surfaces or consumer Home.
- Use “suggested,” “possible,” and “staff will review” language consistently.
- Keep original consumer evidence and AI-generated summary visually separate.
- Add guidance not to include faces, IDs, payment details, or unrelated private information in photos/audio.
- Do not infer people, identities, ownership, health risk, contamination, or fault from evidence.
- Provide direct-call guidance for immediate hazards.

## Accessibility and Responsive Behavior

- All controls must be keyboard reachable with visible focus.
- Native file input may be visually styled but must retain an accessible label.
- Announce recording state, elapsed time, analysis progress, errors, and successful submission through appropriate live regions.
- Provide text equivalents for photo-derived observations and an editable transcript for audio.
- Dialog/lightbox behavior must use `role="dialog"`, an accessible name, Escape-to-close, and focus restoration.
- Use 44px minimum touch targets for record, stop, remove, and media controls.
- Never communicate confidence, priority, recording state, or request status by color alone.
- Respect reduced motion in recording pulses, analysis transitions, and timeline animations.
- At narrow widths, stack evidence cards and sticky primary actions above the existing safe-area-aware bottom spacing.
- At wider consumer preview widths, use a two-column evidence/review layout only where it improves scanning.
- Staff evidence cards should fit the existing responsive detail grid and collapse to one column on mobile.

## Repository Changes

### `src/App.tsx`

- Extend consumer screen types and navigation branches.
- Add Home and Account entry points.
- Add active-request status card and tracking route.
- Hold shared submitted-request state at the top-level `App`.
- Pass request state/update callbacks to consumer and lazy staff experiences.
- Prefer extracting the new feature UI rather than further enlarging this already large file.

### `src/features/issue-reporting/types.ts`

- Define draft, evidence, analysis, location, intake, shared request, and adapter contracts.

### `src/features/issue-reporting/prototypeAnalyzer.ts`

- Implement deterministic async analysis, Filipino/English keyword mapping, confidence bands, advisory matching, and typed failure behavior.

### `src/features/issue-reporting/prototypeLocation.ts`

- Implement the deterministic permission-aware location adapter.

### `src/features/issue-reporting/ReportIssueFlow.tsx`

- Implement intake, media capture, validation, analysis transition, review, consent, retry/manual fallback, and cleanup.

### `src/features/issue-reporting/RequestStatusScreen.tsx`

- Implement confirmation/tracking timeline and submitted-evidence summary.

### `src/features/issue-reporting/issue-reporting.css`

- Add feature-scoped consumer styles using existing CSS variables, radii, typography, shadows, and responsive conventions.

### `src/admin/types.ts`

- Re-export or import the shared `ServiceRequest` contract; retain unrelated admin contracts.

### `src/admin/AdminApp.tsx`

- Accept submitted-request props.
- Merge and route updates without pulling admin fixture data into the consumer bundle.
- Add multimodal badges, evidence-aware search, staff review UI, media dialog, and explicit triage-accept behavior.
- Add appropriate audit messages.

### `src/admin/admin.css`

- Add responsive staff evidence, provenance, confidence, media-preview, and triage-card styles consistent with the current operations portal.

### `src/admin/mockData.ts`

- Keep existing fixtures valid under optional intake fields.
- Do not duplicate the canonical submitted demo record here; it must be created through the consumer flow.

### Dependencies

- Do not add an AI SDK, media library, map SDK, state library, or router.
- Use browser file/audio primitives, React state, and existing Lucide icons.

## State and Failure Handling

- **No modality selected:** disable Review and explain that photo, voice, or text is required.
- **Invalid/oversized file:** reject before preview; preserve other fields.
- **Camera/gallery canceled:** remain on intake without showing an error.
- **Microphone denied/unsupported:** show typed fallback and demo narration.
- **Recording interrupted:** preserve typed/photo data and allow retry.
- **Location denied/unsupported:** fall back to linked address or required landmark.
- **Analysis failure:** preserve evidence; allow retry or manual review.
- **Low confidence:** request additional detail but allow manual continuation when required fields are complete.
- **Possible advisory match:** inform without blocking or auto-resolving.
- **Duplicate submit click:** lock the action while creating the record.
- **Back navigation from review:** retain draft evidence and fields.
- **Leave flow with unsent evidence:** show a discard confirmation only when meaningful draft content exists.
- **Object URL cleanup:** revoke local media URLs when replaced/discarded and when no longer needed.
- **No active request:** omit the Home request card; direct Request Status access back to Home.
- **Staff updates submitted record:** propagate through top-level state and keep current detail selection synchronized.
- **Existing fixture update:** continue using the current admin-local update path.

## Implementation Sequence

1. Extract the shared service-request type and add optional multimodal intake contracts without changing current behavior.
2. Lift submitted-request state to top-level `App`; wire read/update props through Consumer and lazy Admin while preserving code splitting.
3. Add analysis and location adapter interfaces plus deterministic prototype implementations.
4. Build the consumer intake/capture screen with validation, permission fallbacks, demo evidence, local previews, and cleanup.
5. Build analysis, editable review, advisory-match, consent, and submission states.
6. Add confirmation, request tracking, Home status card, and Account entry point.
7. Merge submitted requests into Staff Service Requests and route updates to the correct state owner.
8. Add staff multimodal evidence review, provenance/confidence treatment, explicit triage acceptance, and audit events.
9. Add responsive, accessible styles using the existing design language.
10. Format, build, and manually exercise the complete consumer-to-staff-to-consumer scenario.

## Verification

### Automated repository checks

- Run `pnpm run format`.
- Run `pnpm run build`.
- Run `git diff --check`.
- Confirm the production build still emits Staff/Admin as a separate lazy-loaded chunk and that the consumer entry does not import admin mock data.

### Manual consumer checks

- Open Report issue from Home and Account & Help.
- Complete the demo-evidence path without granting browser permissions.
- Add/replace/remove an actual local image and verify preview cleanup behavior.
- Exercise real recording controls where supported; verify denied and unsupported fallbacks.
- Verify typed-only, photo-only, and voice/demo-only paths.
- Verify alternate-location validation and location fallback.
- Confirm Review is blocked until minimum evidence/location requirements are met.
- Edit suggested fields, return to intake, and verify draft preservation.
- Exercise analysis failure/retry and low-confidence/manual-review states.
- Confirm advisory-match copy does not block submission.
- Verify consent is required and double submission is prevented.
- Verify confirmation reference, Home active-request card, and Request Status timeline.
- Check narrow mobile, wider mobile, keyboard-only, screen-reader announcements, and reduced-motion behavior.

### Manual Staff/Admin checks

- Submit a consumer report, switch through Staff Access, and sign in as Staff.
- Confirm the submitted request appears first and is searchable/filterable.
- Open it and inspect original evidence, transcript, location, AI suggestions, rationale, provenance, and advisory match.
- Confirm media dialog and audio controls are accessible.
- Accept suggested triage and verify an audit entry.
- Assign the request, update status, and add an internal note.
- Repeat role access as Admin and confirm no new permission discrepancy was introduced.
- Verify ordinary text-only fixture requests remain unchanged.
- Return to the consumer experience and confirm the new status is reflected in tracking and Home.

## Acceptance Criteria

- A linked consumer can create a service request using any one of photo, voice/demo narration, or typed description plus valid location context.
- The experience transparently presents AI as assistive, preserves original evidence, and requires human review before submission and staff action.
- The deterministic demo works without a backend, API key, microphone permission, location permission, or a specific browser.
- The user can edit all consequential generated request details before submission.
- A submitted request appears in the existing staff queue in the same session with evidence and provenance intact.
- Staff can review evidence, explicitly accept suggested triage, assign, update, and resolve the request using existing workflows.
- Staff status updates appear back in the consumer tracking experience.
- Existing billing, payment, advisory, account, authentication-demo, role-permission, and ordinary service-request flows continue to work.
- The Staff/Admin portal remains lazy-loaded as a separate production chunk.
- No private AI credential or direct browser-to-model call is introduced.
- The interface remains responsive, keyboard accessible, understandable without color, and consistent with PPCWD’s existing navy/cyan Manrope design system.
- Formatting, production build, and whitespace checks pass.
