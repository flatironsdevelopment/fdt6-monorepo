import sharedConfig from '@fuel/tailwind-config'
import type { Config } from 'tailwindcss'

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig as any]
}

export default config
