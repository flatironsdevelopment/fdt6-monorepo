import { P } from './typography'

const getFirstLetters = (word: string) =>
  word &&
  word
    .split(' ')
    .map((i) => i.charAt(0))
    .slice(0, 2)

type AvatarProps = {
  userName: string
  src?: string
  testId?: string
}

export const UserAvatar = ({
  testId = 'avatar-id',
  userName,
  src
}: AvatarProps) => {
  return src ? (
    <picture className="shrink-0" data-testid={testId}>
      <img
        className="h-12 w-12 rounded-full"
        src={src}
        alt={`${userName}'s avatar picture`}
      />
    </picture>
  ) : (
    <div
      className="bg-coolGray-700 flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
      data-testid={testId}
    >
      <P className="text-white">{getFirstLetters(userName)}</P>
    </div>
  )
}
