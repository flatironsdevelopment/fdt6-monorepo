import * as utils from '@/app/auth/utils'
import { Wrapper16, Wrapper8 } from '@/components/ui/wrapper'
import { mergeTailwindClasses } from '@/utils'
import CheckIconRounded from '../icons/icons/CheckIconRounded'
import { Progress } from '../ui/progress'
import { P } from '../ui/typography'

type Props = {
  password: string
  visible: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const PasswordValidatorChecker = ({ password = '', visible }: Props) => {
  const isCharactersValid = utils.hasMoreOrEqualCharactersThan(password, 8)
  const isUppercaseValid = utils.hasUpperCase(password)
  const isSpecialCharsValid = utils.hasSpecialChars(password)
  const isNumberValid = utils.hasNumber(password)

  const validChecks = [
    isCharactersValid,
    isUppercaseValid,
    isSpecialCharsValid,
    isNumberValid
  ].filter((isValid) => isValid)

  const validationPercentage = (validChecks.length / 4) * 100 || 5
  const validationColor =
    validationPercentage === 100
      ? 'bg-success'
      : validationPercentage > 60
      ? 'bg-warning'
      : 'bg-error'

  const Item = ({
    isValid = false,
    children
  }: {
    isValid: boolean
    children: React.ReactNode
  }) => (
    <Wrapper8>
      <CheckIconRounded
        className={mergeTailwindClasses(!isValid && 'text-action-disabled')}
      />{' '}
      <P className={mergeTailwindClasses(!isValid && 'text-action-disabled')}>
        {children}
      </P>
    </Wrapper8>
  )

  return (
    <Wrapper16
      columnDirection
      data-state={visible ? 'open' : 'closed'}
      className="data-[state=closed]:opacity-0 data-[state=closed]:invisible data-[state=closed]:max-h-0 opacity-100 visible max-h-fit transition duration-200"
    >
      <Progress value={validationPercentage} color={validationColor} />

      <Wrapper8 columnDirection>
        <Item isValid={isCharactersValid}>At least 6 characters</Item>
        <Item isValid={isUppercaseValid}>Add uppercase letters</Item>
        <Item isValid={isSpecialCharsValid}>Add special characters</Item>
        <Item isValid={isNumberValid}>Add numbers</Item>
      </Wrapper8>
    </Wrapper16>
  )
}
