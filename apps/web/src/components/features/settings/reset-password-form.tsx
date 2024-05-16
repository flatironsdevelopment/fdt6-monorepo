'use client'

import * as utils from '@/app/auth/utils'
import { FieldSet, SubmitButton } from '@/components/auth/common'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordFormInput
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const ResetPasswordFormSchema = z
  .object({
    oldPassword: z
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

export type ValidationSchema = z.infer<typeof ResetPasswordFormSchema>

type ResetPasswordFormProps = {
  isLoading?: boolean
  handleSubmit: ({
    oldPassword,
    password,
    confirmPassword
  }: ValidationSchema) => void
}
export function ResetPasswordForm({
  isLoading,
  handleSubmit
}: ResetPasswordFormProps) {
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(ResetPasswordFormSchema),
    mode: 'all'
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldSet className="flex flex-row w-full max-lg:flex-col">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <PasswordFormInput
                    hideChecker
                    disabled={isLoading}
                    placeholder="Type your old password"
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
              <FormItem className="w-full">
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordFormInput
                    hideChecker
                    disabled={isLoading}
                    placeholder="Type your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                <FormItem className="w-full">
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordFormInput
                      hideChecker
                      disabled={isLoading}
                      placeholder="Type again your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </FieldSet>
        <div className="flex justify-end max-lg:w-full">
          <SubmitButton
            isLoading={isLoading}
            className="w-fit max-lg:w-full m-0 mt-6"
            form={form}
          >
            Reset password
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
