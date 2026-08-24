export function isValidCPF(cpf: string): boolean {
  if (!cpf || typeof cpf !== "string") return false;

  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calcVerifier = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length - 1; i++) {
      sum += parseInt(digits[i], 10) * (length - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstVerifier = calcVerifier(10);
  if (firstVerifier !== parseInt(digits[9], 10)) return false;

  const secondVerifier = calcVerifier(11);
  if (secondVerifier !== parseInt(digits[10], 10)) return false;

  return true;
}
