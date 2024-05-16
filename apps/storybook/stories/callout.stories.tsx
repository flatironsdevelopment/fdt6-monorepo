import {
  Callout,
  CalloutAction,
  CalloutDescription,
  CalloutTitle
} from '@fuel/ui'
import type { Meta, StoryObj } from '@storybook/react'

const variants = ['neutral', 'information', 'success', 'warning', 'error']

const meta: Meta<typeof Callout> = {
  component: Callout,
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: variants
    }
  }
}

export default meta

type Story = StoryObj<typeof Callout>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (props) => {
    return (
      <Callout {...props}>
        <CalloutTitle>This is a {props.variant} callout</CalloutTitle>
        <CalloutAction>Learn More</CalloutAction>
      </Callout>
    )
  },
  name: 'Without Description',
  args: {
    variant: 'neutral'
  }
}

export const Secondary: Story = {
  render: (props) => {
    return (
      <Callout {...props}>
        <CalloutTitle>This is a {props.variant} callout</CalloutTitle>
        <CalloutDescription>
          Malesuada tellus tincidunt fringilla enim, id mauris.
        </CalloutDescription>
        <CalloutAction showAngleIcon>Learn More</CalloutAction>
      </Callout>
    )
  },
  name: 'With Description',
  args: {
    variant: 'neutral'
  }
}
