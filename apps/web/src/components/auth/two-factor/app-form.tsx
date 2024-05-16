'use client'

import { Links } from '@/app/auth/utils/constants'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import * as z from 'zod'
import { FieldSet, SubmitButton } from '../common'

const FormSchema = z.object({
  phoneNumber: z.string().refine(validator.isMobilePhone)
})

type Props = {
  handleSubmit: ({ identifier, password, token }: any) => void
  isLoading?: boolean
}

export function LoginForm({ isLoading, handleSubmit }: Props) {
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile number</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder="(123) 456-7891"
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

        <P className="text-center text-base font-sans">
          Don’t have an account? <Link href={Links.REGISTER}>Sign up here</Link>
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
