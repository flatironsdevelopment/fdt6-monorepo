'use client'

import * as utils from '@/app/auth/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordFormInput
} from '@/components/ui/form'
import { useTranslation } from '@/i18n/useTranslation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FieldSet, SubmitButton } from './common'

const ChangePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: 'Must be at least 8 characters.'
      })
      .refine((password) => utils.hasUpperCase(password), {
        message: 'Must have uppercase letters'
      })
      .refine((password) => utils.hasSpecialChars(password), {
        message: 'Must have special characters'
      })
      .refine((password) => utils.hasNumber(password), {
        message: 'Must have numbers'
      }),

    confirmPassword: z
      .string()
      .min(2, {
        message: 'Confirm password must be at least 2 characters.'
      })
      .min(8, {
        message: 'Must be at least 8 characters.'
      })
      .refine((password) => utils.hasUpperCase(password), {
        message: 'Must have uppercase letters'
      })
      .refine((password) => utils.hasSpecialChars(password), {
        message: 'Must have special characters'
      })
      .refine((password) => utils.hasNumber(password), {
        message: 'Must have numbers'
      })
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export type ValidationSchema = z.infer<typeof ChangePasswordFormSchema>

type ChangePasswordFormProps = {
  isLoading?: boolean
  handleSubmit: ({ password, confirmPassword }: ValidationSchema) => void
}
export function ChangePasswordForm({
  isLoading,
  handleSubmit
}: ChangePasswordFormProps) {
  const { t } = useTranslation()

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(ChangePasswordFormSchema),
    mode: 'all'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.new_password')}</FormLabel>
                <FormControl>
                  <PasswordFormInput
                    disabled={isLoading}
                    placeholder={t('auth.new_password')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => {
              const isPasswordMatchError =
                fieldState.error?.message?.includes('match')

              return (
                <FormItem>
                  <FormLabel>{t('auth.confirm_password')}</FormLabel>
                  <FormControl>
                    <PasswordFormInput
                      disabled={isLoading}
                      placeholder={t('auth.confirm_password')}
                      {...field}
                    />
                  </FormControl>
                  {isPasswordMatchError && <FormMessage />}
                </FormItem>
              )
            }}
          />
        </FieldSet>
        <SubmitButton isLoading={isLoading} className="mb-4" form={form}>
          {t('auth.reset_password')}
        </SubmitButton>
      </form>
    </Form>
  )
}
