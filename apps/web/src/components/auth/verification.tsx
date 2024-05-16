'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FieldSet, SubmitButton } from './common'

const ConfirmAccountFormSchema = z.object({
  code: z.string().min(6, {
    message: 'code must be at least 6 characters.'
  })
})
export type ValidationSchema = z.infer<typeof ConfirmAccountFormSchema>

type ConfirmAccountFormProps = {
  isLoading?: boolean
  code?: string
  handleSubmitCode: ({ code }: ValidationSchema) => void
  resendCode: () => void
}
export function ConfirmAccountForm({
  isLoading,
  code,
  handleSubmitCode,
  resendCode
}: ConfirmAccountFormProps) {
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(ConfirmAccountFormSchema),
    mode: 'all',
    defaultValues: {
      code
    }
  })

  useEffect(() => {
    code && form.trigger()
  }, []) // eslint-disable-line

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitCode)}>
        <FieldSet>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder="Ex.: 123456"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldSet>
        <SubmitButton isLoading={isLoading} className="mb-4" form={form}>
          Submit
        </SubmitButton>
        <Button
          onClick={resendCode}
          isLoading={isLoading}
          variant="outline"
          className="w-full max-w-full"
          type="button"
        >
          Resend code
        </Button>
      </form>
    </Form>
  )
}
