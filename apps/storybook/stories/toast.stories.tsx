import { Button, ToastVariants, Toaster, useToast } from '@fuel/ui'
import type { Meta, StoryObj } from '@storybook/react'
import { useCallback } from 'react'

const variants = ['neutral', 'information', 'success', 'warning', 'error']

const meta: Meta<typeof Toaster> = {
  component: Toaster,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: variants
    }
  }
}

export default meta

type Story = StoryObj<typeof Toaster>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (props) => {
    const { toast } = useToast()

    const openToast = useCallback(
      ({ variant }: ToastVariants) => {
        const title = `This is a ${variant} toast`
        toast({ title, variant, icon: 'Info', action: <>action</> })
      },
      [toast]
    )

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {variants.map((variant) => (
          <Button
            key={variant}
            onClick={(): void => {
              openToast({ variant })
            }}
          >
            Open {variant} toast
          </Button>
        ))}
        <Toaster />
      </div>
    )
  },
  name: 'Toast',
  args: {
    children: 'Success',
    variant: 'success'
  }
}
