'use client'

import { Links } from '@/app/auth/utils/constants'
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordFormInput
} from '@/components/ui/form'
import { Link, P } from '@/components/ui/typography'
import { useTranslation } from '@/i18n/useTranslation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FieldSet, SubmitButton } from './common'

const FormSchema = z.object({
  identifier: z.string().email({
    message: 'invalid email'
  }),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.'
  })
})

type Props = {
  handleSubmit: ({ identifier, password, token }: any) => void
  isLoading?: boolean
}

export function LoginForm({ isLoading, handleSubmit }: Props) {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'all'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet>
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder="identifier"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <PasswordFormInput
                    disabled={isLoading}
                    placeholder="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full text-right">
            <Link href={Links.FORGOT_PASSWORD}>
              {t('auth.forgot_password')}
            </Link>
          </div>
        </FieldSet>
        <SubmitButton isLoading={isLoading} form={form}>
          {t('auth.sign_in')}
        </SubmitButton>

        <P className="text-center text-base font-sans">
          {t('auth.dont_have_acccount')}{' '}
          <Link href={Links.REGISTER}>{t('auth.sign_up_here')}</Link>
        </P>
      </form>
    </Form>
  )
}

const TokenFormSchema = z.object({
  token: z.string().min(6, {
    message: 'Token must be at least 6 characters.'
  })
})

type TokenProps = {
  handleSubmit: ({ token }: any) => void
  isLoading?: boolean
}

export function LoginFormToken({ isLoading, handleSubmit }: TokenProps) {
  const form = useForm<z.infer<typeof TokenFormSchema>>({
    resolver: zodResolver(TokenFormSchema),
    mode: 'all'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet>
          <FormField
            control={form.control}
            name="token"
            shouldUnregister
            render={({ field }) => (
              <FormItem>
                <FormLabel>2FA Token</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder="token"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full text-right">
            <Link href={Links.FORGOT_PASSWORD}>I forgot my password</Link>
          </div>
        </FieldSet>
        <SubmitButton isLoading={isLoading} form={form}>
          Sign in
        </SubmitButton>

        <P className="text-center">
          Don’t have an account? <Link href={Links.REGISTER}>Sign up here</Link>
        </P>
      </form>
    </Form>
  )
}
