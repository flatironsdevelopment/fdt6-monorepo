'use client'

import Navbar from '@/components/features/common/Navbar/Navbar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { H1, P } from '@/components/ui/typography'
import { getCurrentIdentifier } from '@/lib/utils'
import { useAuthContext } from 'api-authentication'

const Dashboard = () => {
  const { userState } = useAuthContext()
  const currentIdentifier = !!getCurrentIdentifier(userState)
    ? getCurrentIdentifier(userState)
    : 'John Smith'

  return (
    <>
      <Navbar userName={currentIdentifier} />
      <ScrollArea>
        <div className="p-12 max-w-screen-2xl mx-auto">
          <div className="flex justify-between">
            <H1 className="text-5xl">Title</H1>
            <Button className="ml-4 p-4 rounded-md w-32">Action</Button>
          </div>
          <P className="text-lg mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            fermentum lectus vel pharetra feugiat. Praesent ligula diam,
            molestie a elit vel, scelerisque congue arcu.
          </P>
          <div className="flex flex-col justify-center items-center w-full h-[526px] bg-coolGray-100 mt-10">
            <P>Add content here</P>
          </div>
        </div>
      </ScrollArea>
    </>
  )
}

export default Dashboard
