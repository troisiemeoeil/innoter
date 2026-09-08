"use client"
import MainLayout from '@/components/layout/main-layout';
// import Header from '@/components/layout/headers/projects/header';
import Projects from '@/components/common/projects/projects';
import { SidebarTrigger } from '@/components/ui/sidebar';
import MapOverview from '@/components/common/map/overview';
import OffloadSite from '@/components/common/offload-site/page';

export default function ModuleOffload() {


   return (
      <MainLayout>
         <div className=" flex flex-col items-start p-1 gap-2">
            <SidebarTrigger className="" />
            <div className="flex w-full border border-b-1 gap-1"></div>
         </div>
         <div className='w-full h-full '>
            {/* <MapOverview /> */}
            <OffloadSite />
         </div>
      </MainLayout>
   );
}
