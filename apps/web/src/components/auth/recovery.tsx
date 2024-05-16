'use client'

import { Links } from '@/app/auth/utils/constants'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Link, P } from '@/components/ui/typography'
import { useTranslation } from '@/i18n/useTranslation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FieldSet, SubmitButton } from './common'

const RecoveryFormSchema = z.object({
  email: z.string().email('email must be at least 2 characters.')
})

type RecoveryFormProps = {
  email?: string
  handleSubmit: ({ email }: z.infer<typeof RecoveryFormSchema>) => void
  isLoading?: boolean
}
export function RecoveryForm({
  email,
  isLoading,
  handleSubmit
}: RecoveryFormProps) {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof RecoveryFormSchema>>({
    resolver: zodResolver(RecoveryFormSchema),
    mode: 'all',
    defaultValues: {
      email
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder={t('auth.enter_your_email_address')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldSet>
        <SubmitButton isLoading={isLoading} form={form}>
          {t('auth.submit')}
        </SubmitButton>

        <P className="text-center">
          {t('auth.remember_your_credentials')}{' '}
          <Link href={Links.LOGIN}>{t('auth.back_to_login')}</Link>
        </P>
      </form>
    </Form>
  )
}

const ConfirmRecoveryFormSchema = z.object({
  code: z.string().min(6, {
    message: 'code must be at least 6 characters.'
  })
})

type ConfirmRecoveryFormProps = {
  handleSubmit: ({ code }: z.infer<typeof ConfirmRecoveryFormSchema>) => void
  resendCode: any
  isLoading?: boolean
}
export function ConfirmRecoveryForm({
  resendCode,
  isLoading,
  handleSubmit
}: ConfirmRecoveryFormProps) {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof ConfirmRecoveryFormSchema>>({
    resolver: zodResolver(ConfirmRecoveryFormSchema),
    mode: 'all'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.verification_code')}</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder={t('auth.number_example')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldSet>
        <SubmitButton isLoading={isLoading} className="mb-4" form={form}>
          {t('auth.submit')}
        </SubmitButton>
        <Button
          variant="outline"
          className="w-full max-w-full"
          type="button"
          onClick={resendCode}
          isLoading={isLoading}
        >
          {t('auth.resend_code')}
        </Button>
      </form>
    </Form>
  )
}
