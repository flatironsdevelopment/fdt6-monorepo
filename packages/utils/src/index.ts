export function maskPhoneNumber(phoneNumber: string): string {
  const maskedNumber = phoneNumber?.replace(/\d(?=\d{4})/g, '*') || ''
  return maskedNumber
}
