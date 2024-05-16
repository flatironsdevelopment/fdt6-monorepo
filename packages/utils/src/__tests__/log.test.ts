import { maskPhoneNumber } from '..'

describe('maskPhoneNumber', () => {
  it('masks all digits except the last four with asterisks', () => {
    expect(maskPhoneNumber('1234567890')).toBe('******7890')
    expect(maskPhoneNumber('9876543210')).toBe('******3210')
    expect(maskPhoneNumber('')).toBe('')
    expect(maskPhoneNumber('1234')).toBe('1234')
    expect(maskPhoneNumber('abcdefghij')).toBe('abcdefghij')
  })
})
