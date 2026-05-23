# Three-Step Registration Wizard Redesign

## Goal Description

Refactor the existing `RegisterForm` component into a three‑step wizard while preserving the current visual theme (green primary color, premium gradient, glass‑like cards, etc.). The wizard will guide users through:
1. **Personal Details** – name, age, marital status, gender, and profile photo.
2. **Education & Work** – education, occupation, salary, assets.
3. **Contact & Account** – description, phone, location, email, password.

A progress indicator with three ticks will appear at the top. As each step completes, its tick turns green (or gold for premium). Navigation buttons allow moving forward/backward. Validation runs per step; the form only submits after the final step.

---

## User Review Required

> [!IMPORTANT]
> - **Step Navigation**: Do you want *Next*/*Previous* buttons displayed inside the form, or a fixed footer navigation bar?
> - **Validation**: Should we prevent moving to the next step until the current step passes basic validation (e.g., required fields, password rules)?
> - **Progress Indicator Style**: Keep the existing tick icons (✓) with color changes, or prefer a numbered circle with connecting lines?
> - **Premium Path**: Should the premium gradient be applied to the header of all steps, or only the final step?

---

## Open Questions

> [!WARNING]
> - **State Management**: Do you prefer keeping all form data in a single `useState` object as before, or splitting state per step for clearer separation?
> - **Routing after Submit**: The current logic redirects to `/payment` for premium plans and `/login` otherwise. Should this stay unchanged?
> - **File Structure**: Would you like to extract each step into its own component file (e.g., `PersonalStep.tsx`), or keep everything in `RegisterForm.tsx` for simplicity?

---

## Proposed Changes

---

### Component Refactor

- **[MODIFY] RegisterForm.tsx** – Replace existing single‑form layout with a wizard container.
  - Add a progress bar with three clickable/disabled steps showing ticks.
  - Implement step navigation state (`currentStep` with values 0‑2).
  - Split the UI into three sections, conditionally rendered based on `currentStep`.
  - Move validation logic into step‑specific functions.
  - Preserve existing styling (colors, gradients, input-field classes).

---

### Optional New Files (if user approves split)

- **[NEW] components/PersonalStep.tsx** – UI for personal details.
- **[NEW] components/EducationStep.tsx** – UI for education & work.
- **[NEW] components/AccountStep.tsx** – UI for contact & account.

These files will import shared styles and expose a prop interface for data and setters.

---

## Verification Plan

### Automated Tests
- Run `npm run dev` and manually navigate the wizard to verify:
  - Progress ticks update correctly.
  - Validation prevents advancing on missing fields.
  - Final submit sends the same payload as before.

### Manual Verification
- Test on both premium (`?plan=premium`) and normal flows.
- Ensure UI remains responsive on mobile and desktop.
- Confirm color scheme matches existing design.

---

**Please review the above plan and answer the open questions.**
