import { Suspense } from 'react'
import Dashboard from './client-section'

const DashboardPage = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <Suspense>
        <Dashboard />
      </Suspense>
    </div>
  )
}

export default DashboardPage
