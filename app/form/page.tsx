"use client";

/**
 * Dansovia — New hire details form (app/form/page.tsx)
 * Single file, no external components.
 * Submits JSON to /api/onboarding — create that route to store or forward the data.
 *
 * SECURITY: this page collects SIN (Canada) / SSN (US). The /api/onboarding route MUST:
 *   - run over HTTPS only
 *   - require an authenticated session (or a signed, single-use invite token)
 *   - encrypt the tax ID at rest (KMS / envelope encryption), never store it in plaintext
 *   - never log request bodies, query strings, or error payloads containing tax IDs
 *   - restrict access to authorized HR staff, with audit logging
 */

import { useRef, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Lock } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 * BRAND / DEPLOYMENT CONFIG
 * Every value marked TODO is a placeholder — swap in the real value before ship.
 * ──────────────────────────────────────────────────────────────────────────── */
const BRAND = {
  name: "Dansovia",                       // TODO: display / wordmark text
  legalName: "Dansovia Inc.",             // TODO: registered legal entity name
  domain: "dansovia.com",                 // TODO: confirm canonical domain
  homeUrl: "/",                           // TODO: marketing site or employee portal
  privacyUrl: "/privacy",                 // TODO: real privacy policy URL
  termsUrl: "/terms",                     // TODO: real terms URL
  hrEmail: "hr@dansovia.com",             // TODO: HR inbox (or remove from UI)
  minAge: 16,                             // TODO: confirm minimum working age per jurisdiction

  // TODO: replace with Dansovia brand palette
  colors: {
    brand: "#1F4D3A",        // primary action / accent
    brandHover: "#173A2C",   // primary hover
    ink: "#111111",
    muted: "#666666",
    subtle: "#8A8A8A",
    line: "#E5E5E5",
    surface: "#FFFFFF",
    canvas: "#F8F8F6",
    danger: "#B42318",
  },
} as const;

 // TODO: implement this route

/* ──────────────────────────────────────────────────────────────────────────── */

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const M = "font-[family-name:var(--font-mono)]";
const LABEL = `${M} text-[11px] uppercase tracking-[0.08em] text-[color:var(--c-subtle)]`;
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--c-brand)]";
const INPUT = `block min-h-[48px] w-full rounded-md border bg-[var(--c-surface)] px-3.5 text-[15px] text-[color:var(--c-ink)] placeholder:text-[color:var(--c-subtle)] transition-colors hover:border-[color:var(--c-subtle)] ${FOCUS}`;

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "select";
  required?: boolean;
  hint?: string;
  auto?: string;
  options?: string[];
  wide?: boolean;
};

/**
 * TODO: confirm the exact field set Dansovia needs.
 * Some common additions people forget:
 *   - preferred name / pronouns
 *   - work authorization or visa status
 *   - banking / direct deposit (do NOT put account numbers in this form unless
 *     the API is PCI/PSD-grade and you have a strong reason)
 *   - second emergency contact
 *   - shirt size / equipment shipping address
 *   - policy acknowledgment checkboxes
 */
const SECTIONS: { id: string; title: string; fields: Field[] }[] = [
  {
    id: "personal",
    title: "Personal details",
    fields: [
      { name: "firstName", label: "First name", type: "text", required: true, auto: "given-name" },
      { name: "lastName", label: "Last name", type: "text", required: true, auto: "family-name" },
      { name: "dob", label: "Date of birth", type: "date", required: true, auto: "bday" },
      { name: "phone", label: "Phone number", type: "tel", required: true, auto: "tel" },
      { name: "email", label: "Personal email", type: "email", required: true, auto: "email", wide: true },
    ],
  },
  {
    id: "address",
    title: "Home address",
    fields: [
      { name: "street", label: "Street address", type: "text", required: true, auto: "street-address", wide: true },
      { name: "city", label: "City", type: "text", required: true, auto: "address-level2" },
      { name: "region", label: "Province / state", type: "text", required: true, auto: "address-level1" },
      { name: "postal", label: "Postal / ZIP code", type: "text", required: true, auto: "postal-code" },
      {
        name: "country",
        label: "Country",
        type: "select",
        required: true,
        auto: "country-name",
        options: ["Canada", "United States", "Other"], // TODO: finalize country list
      },
    ],
  },
  {
    id: "job",
    title: "Job details",
    fields: [
      { name: "position", label: "Position offered", type: "text", required: true },
      { name: "startDate", label: "Start date", type: "date", required: true },
      {
        name: "employmentType",
        label: "Employment type",
        type: "select",
        required: true,
        options: ["Full-time", "Part-time", "Contract", "Intern"], // TODO: confirm
      },
      {
        name: "workLocation",
        label: "Work arrangement",
        type: "select",
        required: true,
        options: ["On-site", "Hybrid", "Remote"], // TODO: confirm
      },
      // TODO: department, manager, employee ID, cost centre?
    ],
  },
  {
    id: "emergency",
    title: "Emergency contact",
    fields: [
      { name: "ecName", label: "Contact full name", type: "text", required: true },
      { name: "ecRelation", label: "Relationship", type: "text", required: true },
      { name: "ecPhone", label: "Contact phone number", type: "tel", required: true, wide: true },
      // TODO: add a second emergency contact if required
    ],
  },
];

const ALL = SECTIONS.flatMap((s) => s.fields);

/** Keep digits only, max 9. */
const digits = (v: string) => v.replace(/\D/g, "").slice(0, 9);

/** Display: SIN 123 456 789, SSN 123-45-6789. */
const fmtTaxId = (d: string, country: string) =>
  country === "Canada"
    ? d.replace(/^(\d{3})(\d{0,3})(\d{0,3}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))
    : d.replace(/^(\d{3})(\d{0,2})(\d{0,4}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join("-"));

/** Luhn checksum used by Canadian SINs. */
const luhn = (d: string) => {
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
};

const validSsn = (d: string) =>
  d.length === 9 && !/^(000|666|9)/.test(d) && d.slice(3, 5) !== "00" && d.slice(5) !== "0000";

function validate(v: Record<string, string>, taxId: string, declared: boolean) {
  const e: Record<string, string> = {};

  for (const f of ALL) if (f.required && !v[f.name]?.trim()) e[f.name] = `${f.label} is required.`;

  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = "Enter an email address like name@example.com.";

  for (const k of ["phone", "ecPhone"])
    if (v[k] && !/^[+\d][\d\s().-]{6,}$/.test(v[k])) e[k] = "Enter a valid phone number.";

  if (v.dob) {
    const d = new Date(v.dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    if (Number.isNaN(d.getTime()) || d > now || age > 100) e.dob = "Enter a valid date of birth.";
    else if (age < BRAND.minAge) e.dob = `You must be at least ${BRAND.minAge} to submit this form.`;
  }

  if (v.country === "Canada") {
    if (!taxId) e.taxId = "Social Insurance Number (SIN) is required.";
    else if (taxId.length !== 9 || !luhn(taxId)) e.taxId = "Enter a valid 9-digit SIN.";
  } else if (v.country === "United States") {
    if (!taxId) e.taxId = "Social Security Number (SSN) is required.";
    else if (!validSsn(taxId)) e.taxId = "Enter a valid 9-digit SSN.";
  }
  // TODO: if you hire in the UK/EU, add National Insurance / other national ID handling here.

  if (!declared) e.declared = "Please confirm the declaration.";
  return e;
}

export default function NewHireForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [declared, setDeclared] = useState(false);
  const [taxId, setTaxId] = useState(""); // digits only
  const [showTax, setShowTax] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const summary = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const errorList = Object.entries(errors);

  const taxLabel =
    values.country === "Canada"
      ? { short: "SIN", long: "Social Insurance Number (SIN)", ph: "123 456 789" }
      : values.country === "United States"
        ? { short: "SSN", long: "Social Security Number (SSN)", ph: "123-45-6789" }
        : null;
  const needsTax = !!taxLabel;

  const clear = (k: string) =>
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(values, taxId, declared);
    setErrors(e);
    if (Object.keys(e).length) return void setTimeout(() => summary.current?.focus(), 0);

    setStatus("sending");
    
try {
  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...values,
      taxId: needsTax ? taxId : undefined,
      taxIdType: taxLabel?.short,
      declared,
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!res.ok) throw new Error(String(res.status));

  setStatus("done");
  window.scrollTo({ top: 0 });
} catch {
  setStatus("failed");
  setTimeout(() => summary.current?.focus(), 0);
}

  }

  return (
    <div
      className={`${sans.variable} ${mono.variable} min-h-screen bg-[var(--c-canvas)] text-[color:var(--c-ink)] antialiased selection:bg-[var(--c-brand)] selection:text-white`}
      style={
        {
          fontFamily: "var(--font-sans), Inter, system-ui, sans-serif",
          "--c-brand": BRAND.colors.brand,
          "--c-brand-hover": BRAND.colors.brandHover,
          "--c-ink": BRAND.colors.ink,
          "--c-muted": BRAND.colors.muted,
          "--c-subtle": BRAND.colors.subtle,
          "--c-line": BRAND.colors.line,
          "--c-surface": BRAND.colors.surface,
          "--c-canvas": BRAND.colors.canvas,
          "--c-danger": BRAND.colors.danger,
        } as React.CSSProperties
      }
    >
      <header className="border-b border-[color:var(--c-line)]">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5 sm:px-8">
          <a
            href={BRAND.homeUrl}
            className={`text-[13px] font-semibold tracking-[0.2em] ${FOCUS}`}
          >
            {BRAND.name.toUpperCase()}
          </a>
          <a
            href={BRAND.homeUrl}
            className={`inline-flex min-h-[44px] items-center gap-2 text-[14px] text-[color:var(--c-muted)] hover:text-[color:var(--c-ink)] ${FOCUS}`}
          >
            <ArrowLeft size={14} aria-hidden /> Home
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        {status === "done" ? (
          <section
            aria-live="polite"
            className="rounded-lg border border-[color:var(--c-line)] bg-[var(--c-surface)] p-8 sm:p-12"
          >
            <span className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--c-brand)] text-[color:var(--c-brand)]">
              <Check size={18} aria-hidden />
            </span>
            <h1 className="text-3xl font-medium tracking-[-0.03em]">Details submitted.</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-[color:var(--c-muted)]">
              Thank you, {values.firstName}. Our team will review your information and contact you
              at {values.email} with next steps.
            </p>
          </section>
        ) : (
          <>
            <p className={`${LABEL} mb-5`}>New hire</p>
            <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1] tracking-[-0.04em]">
              Complete your employee details.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[color:var(--c-muted)]">
              Welcome to {BRAND.name}. Please fill in the details below so we can finish your
              onboarding. Fields marked <span className="text-[color:var(--c-danger)]">*</span> are
              required.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-12 space-y-8">
              {(errorList.length > 0 || status === "failed") && (
                <div
                  ref={summary}
                  tabIndex={-1}
                  role="alert"
                  className={`rounded-md border border-[color:var(--c-danger)] bg-[var(--c-surface)] p-5 ${FOCUS}`}
                >
                  <p className="font-medium text-[color:var(--c-danger)]">
                    {errorList.length
                      ? `Please fix ${errorList.length} ${
                          errorList.length === 1 ? "item" : "items"
                        } before submitting.`
                      : "We could not submit your details. Check your connection and try again."}
                  </p>
                  <ul className="mt-2 list-disc pl-5 text-[14px]">
                    {errorList.map(([k, m]) => (
                      <li key={k}>
                        <a className="underline" href={`#${k}`}>
                          {m}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {SECTIONS.map((s) => (
                <fieldset
                  key={s.id}
                  className="rounded-lg border border-[color:var(--c-line)] bg-[var(--c-surface)] p-6 sm:p-10"
                >
                  <legend className="sr-only">{s.title}</legend>
                  <h2 className="text-xl font-medium tracking-[-0.02em]" aria-hidden>
                    {s.title}
                  </h2>
                  <div className="mt-6 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                    {s.fields.map((f) => {
                      const err = errors[f.name];
                      const desc =
                        [f.hint ? `${f.name}-hint` : "", err ? `${f.name}-err` : ""]
                          .filter(Boolean)
                          .join(" ") || undefined;

                      const common = {
                        id: f.name,
                        name: f.name,
                        value: values[f.name] ?? "",
                        autoComplete: f.auto,
                        required: f.required,
                        "aria-invalid": err ? true : undefined,
                        "aria-describedby": desc,
                        className: `${INPUT} ${
                          err
                            ? "border-[color:var(--c-danger)]"
                            : "border-[color:var(--c-line)]"
                        }`,
                        onChange: (
                          ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
                        ) => {
                          setValues((p) => ({ ...p, [f.name]: ev.target.value }));
                          if (f.name === "country") {
                            setTaxId("");
                            setShowTax(false);
                            clear("taxId");
                          }
                          if (err) clear(f.name);
                        },
                      } as const;

                      return (
                        <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
                          <label htmlFor={f.name} className="mb-2 block text-[14px] font-medium">
                            {f.label}
                            {f.required && (
                              <span className="text-[color:var(--c-danger)]" aria-hidden>
                                {" "}
                                *
                              </span>
                            )}
                          </label>

                          {f.type === "select" ? (
                            <select {...common}>
                              <option value="">Select…</option>
                              {f.options?.map((o) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              {...common}
                              type={f.type}
                              max={f.name === "dob" ? today : undefined}
                            />
                          )}

                          {f.hint && (
                            <p
                              id={`${f.name}-hint`}
                              className="mt-1.5 text-[13px] text-[color:var(--c-subtle)]"
                            >
                              {f.hint}
                            </p>
                          )}
                          {err && (
                            <p
                              id={`${f.name}-err`}
                              className="mt-1.5 text-[13px] font-medium text-[color:var(--c-danger)]"
                            >
                              Error: {err}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              {needsTax && taxLabel && (
                <fieldset className="rounded-lg border border-[color:var(--c-line)] bg-[var(--c-surface)] p-6 sm:p-10">
                  <legend className="sr-only">Tax identification</legend>
                  <h2
                    className="flex items-center gap-2 text-xl font-medium tracking-[-0.02em]"
                    aria-hidden
                  >
                    <Lock size={16} /> Tax identification
                  </h2>
                  {/* TODO: have legal/compliance sign off on this copy. */}
                  <p className="mt-2 text-[14px] text-[color:var(--c-muted)]">
                    Required for payroll and tax reporting. Transmitted over an encrypted
                    connection and accessible only to authorized {BRAND.name} HR staff.
                  </p>

                  <div className="mt-6 max-w-sm">
                    <label htmlFor="taxId" className="mb-2 block text-[14px] font-medium">
                      {taxLabel.long}
                      <span className="text-[color:var(--c-danger)]" aria-hidden>
                        {" "}
                        *
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="taxId"
                        name="taxId"
                        required
                        inputMode="numeric"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        type={showTax ? "text" : "password"}
                        placeholder={taxLabel.ph}
                        maxLength={13}
                        value={showTax ? fmtTaxId(taxId, values.country) : taxId}
                        aria-invalid={errors.taxId ? true : undefined}
                        aria-describedby={errors.taxId ? "taxId-err" : "taxId-hint"}
                        onChange={(e) => {
                          setTaxId(digits(e.target.value));
                          clear("taxId");
                        }}
                        className={`${INPUT} ${M} pr-12 tracking-[0.1em] ${
                          errors.taxId
                            ? "border-[color:var(--c-danger)]"
                            : "border-[color:var(--c-line)]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowTax((s) => !s)}
                        aria-pressed={showTax}
                        aria-label={showTax ? `Hide ${taxLabel.short}` : `Show ${taxLabel.short}`}
                        className={`absolute right-1 top-1 inline-flex h-10 w-10 items-center justify-center rounded text-[color:var(--c-muted)] hover:text-[color:var(--c-ink)] ${FOCUS}`}
                      >
                        {showTax ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                      </button>
                    </div>
                    <p
                      id="taxId-hint"
                      className="mt-1.5 text-[13px] text-[color:var(--c-subtle)]"
                    >
                      9 digits. Hidden by default.
                    </p>
                    {errors.taxId && (
                      <p
                        id="taxId-err"
                        className="mt-1.5 text-[13px] font-medium text-[color:var(--c-danger)]"
                      >
                        Error: {errors.taxId}
                      </p>
                    )}
                  </div>
                </fieldset>
              )}

              <div className="rounded-lg border border-[color:var(--c-line)] bg-[var(--c-surface)] p-6 sm:p-10">
                <label
                  htmlFor="declared"
                  className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed"
                >
                  <input
                    id="declared"
                    type="checkbox"
                    checked={declared}
                    aria-invalid={errors.declared ? true : undefined}
                    aria-describedby={errors.declared ? "declared-err" : undefined}
                    onChange={(e) => {
                      setDeclared(e.target.checked);
                      clear("declared");
                    }}
                    className={`mt-0.5 h-5 w-5 shrink-0 accent-[var(--c-brand)] ${FOCUS}`}
                  />
                  <span>
                    {/* TODO: legal review — consent wording, retention period, and links. */}
                    I confirm the information above is accurate, and I consent to {BRAND.legalName}{" "}
                    using it for employment and onboarding purposes. I have read the{" "}
                    <a
                      href={BRAND.privacyUrl}
                      className={`underline ${FOCUS}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Privacy Policy
                    </a>
                    . <span className="text-[color:var(--c-danger)]" aria-hidden>*</span>
                  </span>
                </label>
                {errors.declared && (
                  <p
                    id="declared-err"
                    className="ml-8 mt-1.5 text-[13px] font-medium text-[color:var(--c-danger)]"
                  >
                    Error: {errors.declared}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md bg-[var(--c-brand)] px-8 text-[15px] font-medium text-white transition-colors hover:bg-[var(--c-brand-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${FOCUS}`}
                >
                  {status === "sending" ? "Submitting…" : "Submit details"}{" "}
                  {status !== "sending" && <ArrowRight size={16} aria-hidden />}
                </button>
              </div>
            </form>
          </>
        )}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-5 pb-14 sm:px-8">
        <p className="text-[13px] text-[color:var(--c-subtle)]">
          Questions about this form? Contact{" "}
          <a href={`mailto:${BRAND.hrEmail}`} className={`underline ${FOCUS}`}>
            {BRAND.hrEmail}
          </a>
          . See our{" "}
          <a href={BRAND.privacyUrl} className={`underline ${FOCUS}`}>
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href={BRAND.termsUrl} className={`underline ${FOCUS}`}>
            Terms
          </a>
          .
        </p>
      </footer>
    </div>
  );
}