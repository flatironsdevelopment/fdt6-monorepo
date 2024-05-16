export const hasUpperCase = (word: string) => {
  return /[A-Z]/.test(word)
}

export const hasSpecialChars = (word: string) => {
  return /[$&+,:;=?@#|'<>.^*()%!-]/.test(word)
}

export const hasLowerCase = (word: string) => {
  return /[a-z]/.test(word)
}

export const hasNumber = (word: string) => {
  return /\d/.test(word)
}

export const hasMoreOrEqualCharactersThan = (word: string, size: number) => {
  return word.length >= size
}
