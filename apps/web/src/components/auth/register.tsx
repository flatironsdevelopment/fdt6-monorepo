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
import validator from 'validator'
import * as z from 'zod'
import { FieldSet, SubmitButton } from './common'

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First Name must be at least 2 characters.'
  }),
  lastName: z.string().min(2, {
    message: 'Last Name must be at least 2 characters.'
  }),
  email: z.string().email('this is not a valid email'),
  phoneNumber: z.string().refine(validator.isMobilePhone),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.'
  })
})

type Props = {
  handleSubmit: ({
    firstName,
    lastName,
    phoneNumber,
    email,
    password
  }: z.infer<typeof FormSchema>) => any
  isLoading?: boolean
}

export function RegistrationForm({ isLoading, handleSubmit }: Props) {
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.first_name')}</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder={t('auth.enter_your_first_name')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.last_name')}</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder={t('auth.enter_your_last_name')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.phone_number')}</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    placeholder="+12345678900"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <PasswordFormInput
                    disabled={isLoading}
                    placeholder={t('auth.enter_your_password')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldSet>
        <SubmitButton isLoading={isLoading} form={form}>
          {t('auth.sign_up')}
        </SubmitButton>

        <P className="text-center font-sans">
          {t('auth.already_have_an_account')}{' '}
          <Link href={Links.LOGIN}>{t('auth.sign_in_here')}</Link>
        </P>
      </form>
    </Form>
  )
}
