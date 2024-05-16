import * as Icons from '@fuel/icons'
import { Button } from '@fuel/ui'

import type { Meta, StoryObj } from '@storybook/react'
import { get } from 'lodash'

const meta: Meta<typeof Icons.CheckIcon> = {
  component: Icons.CheckIcon
}

export default meta

type Story = StoryObj<typeof Button>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (props) => {
    const keys = Object.keys(Icons)

    return (
      <div>
        {keys.map((key) => {
          const Icon = get(Icons, key)
          return (
            <div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Icon />
                {key}
              </div>
            </div>
          )
        })}
      </div>
    )
  },
  name: 'Icons'
}
