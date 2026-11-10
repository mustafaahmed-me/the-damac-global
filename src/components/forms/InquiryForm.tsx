"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { BUDGET_OPTIONS, PACKAGE_OPTIONS, SERVICES } from "@/lib/content";
import {
  cleanMultiline,
  cleanText,
  LIMITS,
  validateInquiry,
  type FieldErrors,
  type InquiryInput,
} from "@/lib/validation";

type Variant = "contact" | "custom";

type Props = {
  variant: Variant;
  contactEmail: string | null;
  initialService?: string;
  packageValue?: string;
  onPackageChange?: (value: string) => void;
};

type Values = {
  name: string;
  email: string;
  phone: string;
  services: string[];
  budget: string;
  message: string;
};

type Status = { type: "success" | "error"; message: string } | null;

const FIELD_ORDER = ["name", "email", "phone", "services", "budget", "packageChoice", "message"] as const;

function emptyValues(initialService: string): Values {
  return {
    name: "",
    email: "",
    phone: "",
    services: initialService ? [initialService] : [],
    budget: "",
    message: "",
  };
}

function newSubmissionId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function Field({
  label,
  id,
  error,
  optional = false,
  span2 = false,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  optional?: boolean;
  span2?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`field${span2 ? " form-span-2" : ""}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="optional">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function InquiryForm({
  variant,
  contactEmail,
  initialService = "",
  packageValue = "",
  onPackageChange,
}: Props) {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const isCustom = variant === "custom";

  const [values, setValues] = useState<Values>(() => emptyValues(initialService));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(newSubmissionId);
  const inFlight = useRef(false);

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as keyof FieldErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof FieldErrors];
      return next;
    });
  };

  const fieldId = (key: string): string => {
    if (key === "services") return isCustom ? fid("svc-0") : fid("service");
    if (key === "packageChoice") return fid("package");
    return fid(key);
  };

  const describedBy = (key: keyof FieldErrors) =>
    errors[key] ? `${fieldId(key)}-error` : undefined;

  const focusFirstError = (found: FieldErrors) => {
    const key = FIELD_ORDER.find((k) => found[k]);
    if (!key) return;
    document.getElementById(fieldId(key))?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;

    const input: InquiryInput = {
      kind: isCustom ? "custom_package" : "contact",
      submissionId,
      name: cleanText(values.name, LIMITS.name.max),
      email: cleanText(values.email, LIMITS.email.max),
      phone: cleanText(values.phone, LIMITS.phone.max),
      services: isCustom ? values.services : values.services.slice(0, 1),
      budget: values.budget,
      packageChoice: isCustom ? packageValue : "",
      message: cleanMultiline(values.message, LIMITS.customMessage.max),
    };

    const found = validateInquiry(input);

    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus({
        type: "error",
        message: "Please check the highlighted fields and try again.",
      });
      focusFirstError(found);
      return;
    }

    // Save the enquiry directly to the database. No WhatsApp redirect is used.

    inFlight.current = true;
    setSubmitting(true);
    setErrors({});
    setStatus(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        cache: "no-store",
      });

      let data: { ok?: boolean; stored?: boolean; message?: string; errors?: FieldErrors } | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok && data?.ok && data.stored !== false) {
        setStatus({
          type: "success",
          message: "Thank you! Your enquiry has been received successfully. Our team will contact you within two working days.",
        });
        setValues(emptyValues(initialService));
        setSubmissionId(newSubmissionId());
      } else {
        if (data?.errors) {
          setErrors(data.errors);
          focusFirstError(data.errors);
        }

        setStatus({
          type: "error",
          message: data?.message ?? "Something went wrong while sending your request. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message:
          "We could not reach the server. Please check your connection and try again. Your details are still filled in.",
      });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  const mailSubject = isCustom ? "Custom package request" : "Website enquiry";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={submitting}
      className="grid gap-6"
      aria-label={isCustom ? "Custom package request" : "Contact enquiry"}
    >
      <div className="form-grid form-grid--two">
        <Field label="Full name" id={fid("name")} error={errors.name}>
          <input
            id={fid("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className="input"
            maxLength={LIMITS.name.max}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
          />
        </Field>

        <Field label="Email address" id={fid("email")} error={errors.email}>
          <input
            id={fid("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            className="input"
            maxLength={LIMITS.email.max}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
          />
        </Field>

        <Field label="Phone" id={fid("phone")} error={errors.phone} optional>
          <input
            id={fid("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+92 300 0000000"
            className="input"
            maxLength={LIMITS.phone.max}
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
          />
        </Field>

        {isCustom ? (
          <Field label="Preferred package" id={fid("package")} error={errors.packageChoice} optional>
            <select
              id={fid("package")}
              name="packageChoice"
              className="input"
              value={packageValue}
              onChange={(e) => onPackageChange?.(e.target.value)}
              aria-invalid={Boolean(errors.packageChoice)}
              aria-describedby={describedBy("packageChoice")}
            >
              <option value="">Select a package</option>
              {PACKAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="Service of interest" id={fid("service")} error={errors.services}>
            <select
              id={fid("service")}
              name="service"
              className="input"
              value={values.services[0] ?? ""}
              onChange={(e) => update("services", e.target.value ? [e.target.value] : [])}
              aria-required="true"
              aria-invalid={Boolean(errors.services)}
              aria-describedby={describedBy("services")}
            >
              <option value="">Select a service</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
          </Field>
        )}

        {isCustom && (
          <fieldset
            className="form-span-2 grid min-w-0 gap-3 border-0 p-0"
            aria-describedby={describedBy("services")}
            aria-invalid={Boolean(errors.services)}
          >
            <legend className="field-label mb-1 p-0">
              Services you need <span className="optional">(select one or more)</span>
            </legend>

            <div className="checks">
              {SERVICES.map((service, index) => {
                const checked = values.services.includes(service.title);

                return (
                  <label key={service.id} className="check">
                    <input
                      id={index === 0 ? fid("svc-0") : undefined}
                      type="checkbox"
                      name="services"
                      value={service.title}
                      checked={checked}
                      onChange={(e) =>
                        update(
                          "services",
                          e.target.checked
                            ? [...values.services, service.title]
                            : values.services.filter((s) => s !== service.title),
                        )
                      }
                    />
                    <span>{service.title}</span>
                  </label>
                );
              })}
            </div>

            {errors.services && (
              <p id={`${fid("services")}-error`} className="field-error">
                {errors.services}
              </p>
            )}
          </fieldset>
        )}

        <Field label="Budget" id={fid("budget")} error={errors.budget} optional={!isCustom}>
          <select
            id={fid("budget")}
            name="budget"
            className="input"
            value={values.budget}
            onChange={(e) => update("budget", e.target.value)}
            aria-required={isCustom ? "true" : undefined}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={describedBy("budget")}
          >
            <option value="">
              {isCustom ? "Select a budget range" : "Select a budget"}
            </option>

            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={isCustom ? "Project goals" : "Message"}
          id={fid("message")}
          error={errors.message}
          span2
        >
          <textarea
            id={fid("message")}
            name="message"
            className="input"
            placeholder={
              isCustom
                ? "What are you trying to achieve, who is your audience, and what would success look like for you?"
                : "Tell us a little about your business, your goals and your timeline."
            }
            maxLength={isCustom ? LIMITS.customMessage.max : LIMITS.contactMessage.max}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="submit" className="btn btn-gold" disabled={submitting}>
          {submitting ? "Sending…" : isCustom ? "Submit custom request" : "Send enquiry"}
          {!submitting && <ArrowUpRight />}
        </button>

        <p className="text-sm text-[var(--color-subtle)]">
          We reply within two working days. Your details are used only to answer your enquiry.
        </p>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true">
        {status && (
          <div className={`form-status form-status--${status.type}`}>
            <p>{status.message}</p>

            {status.type === "error" && contactEmail && (
              <p className="mt-2">
                Prefer email? Write to{" "}
                <a href={`mailto:${contactEmail}?subject=${encodeURIComponent(mailSubject)}`}>
                  {contactEmail}
                </a>.
              </p>
            )}



          </div>
        )}
      </div>

      {!status && contactEmail && (
        <p className="text-sm text-[var(--color-subtle)]">
          Prefer email?{" "}
          <a
            className="text-[var(--gold)] underline underline-offset-4"
            href={`mailto:${contactEmail}?subject=${encodeURIComponent(mailSubject)}`}
          >
            {contactEmail}
          </a>
        </p>
      )}
    </form>
  );
}
