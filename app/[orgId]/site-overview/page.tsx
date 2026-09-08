"use client"
import MainLayout from '@/components/layout/main-layout';
import Dashboard from '@/components/common/dashboard/dashboard'
import ThatOpenWorlds from '@/components/common/dashboard/BIMviewer';
import { SidebarTrigger } from '@/components/ui/sidebar';
function SiteOverview() {
  return (
    <MainLayout >

      <div className=" flex flex-col items-start p-1 gap-2">
        <SidebarTrigger className="" />
        <div className="flex w-full border border-b-1 gap-1"></div>
      </div>
      <div className='w-full h-full '>
        <ThatOpenWorlds />

      </div>
    </MainLayout>
  )
}

export default SiteOverview
