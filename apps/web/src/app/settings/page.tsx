import { Suspense } from 'react'
// import { fetchSessionOnServerSide } from '../utils/server-utils'
import { Sidebar } from '@/components/features/common/Sidebar'
import { ITEMS } from '@/components/features/common/Sidebar/constants'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchSessionOnServerSide } from '../auth/utils/server-utils'
import { Settings } from './client-section'

const SettingsPage = async () => {
  const session = await fetchSessionOnServerSide()

  if (session) {
    console.log({ session })
    // return redirect('/')
  }

  return (
    <div className="flex h-full">
      <Suspense>
        <Sidebar expanded selected={ITEMS.HOME} />
        <ScrollArea>
          <Settings />
        </ScrollArea>
      </Suspense>
    </div>
  )
}

export default SettingsPage
