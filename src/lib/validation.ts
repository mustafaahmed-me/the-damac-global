// Shared validation used by the browser (instant feedback) and the API route
// (authoritative). Pure functions only: safe to import from client components.

import { BUDGET_OPTIONS, PACKAGE_OPTIONS, SERVICE_TITLES } from "@/lib/content";

export type InquiryKind = "contact" | "custom_package";

export type InquiryInput = {
  kind: InquiryKind;
  submissionId: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  budget: string;
  packageChoice: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof InquiryInput | "services", string>>;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  phone: { max: 24 },
  contactMessage: { min: 10, max: 2000 },
  customMessage: { min: 20, max: 3000 },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{5,22}$/;

/** Removes control characters and collapses surrounding whitespace. */
export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

export function cleanMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  return value.length <= LIMITS.email.max && EMAIL_RE.test(value);
}

export function validateInquiry(input: InquiryInput): FieldErrors {
  const errors: FieldErrors = {};

  if (input.name.length < LIMITS.name.min) {
    errors.name = `Please enter your name (at least ${LIMITS.name.min} characters).`;
  }

  if (!input.email) {
    errors.email = "Please enter your email address.";
  } else if (!isValidEmail(input.email)) {
    errors.email = "Please enter a valid email address, for example name@company.com.";
  }

  if (input.phone) {
    if (input.phone.length > LIMITS.phone.max || !PHONE_RE.test(input.phone)) {
      errors.phone = "Please enter a valid phone number, including country code if possible.";
    }
  }

  if (input.kind === "contact") {
    if (!input.services[0] || !SERVICE_TITLES.includes(input.services[0])) {
      errors.services = "Please select the service you are interested in.";
    }
    if (input.budget && !(BUDGET_OPTIONS as readonly string[]).includes(input.budget)) {
      errors.budget = "Please choose a budget from the list.";
    }
    if (input.message.length < LIMITS.contactMessage.min) {
      errors.message = `Please tell us a little about your project (at least ${LIMITS.contactMessage.min} characters).`;
    }
  } else {
    const validServices = input.services.filter((s) => SERVICE_TITLES.includes(s));
    if (validServices.length === 0) {
      errors.services = "Please select at least one service.";
    }
    if (!input.budget || !(BUDGET_OPTIONS as readonly string[]).includes(input.budget)) {
      errors.budget = "Please select a budget range.";
    }
    if (input.packageChoice && !(PACKAGE_OPTIONS as readonly string[]).includes(input.packageChoice)) {
      errors.packageChoice = "Please choose a package from the list.";
    }
    if (input.message.length < LIMITS.customMessage.min) {
      errors.message = `Please describe your goals (at least ${LIMITS.customMessage.min} characters).`;
    }
  }

  return errors;
}

/**
 * Prevents spreadsheet formula injection: values that begin with a formula
 * trigger character are prefixed with an apostrophe so Sheets stores them as text.
 */
export function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}
