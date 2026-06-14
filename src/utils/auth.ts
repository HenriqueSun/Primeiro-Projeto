export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeFullName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function formatBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const areaCode = digits.slice(0, 2);
  const firstPart = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const secondPart = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  if (digits.length <= 2) return areaCode ? `(${areaCode}` : "";
  if (!secondPart) return `(${areaCode}) ${firstPart}`;
  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

export function isValidBrazilianPhone(value: string) {
  return value.replace(/\D/g, "").length === 11;
}

export function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (score <= 2) return { score, label: "Fraca", color: "bg-red-500" };
  if (score === 3) return { score, label: "Média", color: "bg-amber-500" };
  if (score === 4) return { score, label: "Forte", color: "bg-emerald-500" };
  return { score, label: "Muito Forte", color: "bg-primary" };
}

export function createMockSession() {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString();

  return {
    accessToken: crypto.randomUUID(),
    refreshToken: crypto.randomUUID(),
    expiresAt,
  };
}
