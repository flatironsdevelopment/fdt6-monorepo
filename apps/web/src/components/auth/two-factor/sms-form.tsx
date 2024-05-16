'use client'

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
import { useForm } from 'react-hook-form'
import validator from 'validator'
import * as z from 'zod'
import { FieldSet, SubmitButton } from '../common'

const FormSchema = z.object({
  phoneNumber: z.string().refine(validator.isMobilePhone)
})

type Props = {
  phoneNumber?: string
  handleSubmit: ({ phoneNumber }: any) => void
  isLoading?: boolean
}

export function SMSForm({ isLoading, phoneNumber = '', handleSubmit }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'all',
    values: {
      phoneNumber
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
        <FieldSet>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
        </FieldSet>

        <SubmitButton isLoading={isLoading} form={form}>
          Next
        </SubmitButton>
      </form>
    </Form>
  )
}
