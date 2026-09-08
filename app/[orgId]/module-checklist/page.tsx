import MainLayout from '@/components/layout/main-layout';
// import Header from '@/components/layout/headers/projects/header';
import Projects from '@/components/common/projects/projects';
import { SidebarTrigger } from '@/components/ui/sidebar';
import  ModuleInstallationTable  from '@/components/common/module-checklist/overview';


export default function ProjectsPage() {
   return (
      <MainLayout>
         <div className="flex flex-col items-start p-2 gap-2">
            <SidebarTrigger className="" />
            <div className="flex w-full border border-b-1 gap-1"></div>
         </div>
      <ModuleInstallationTable />
      </MainLayout>
   );
}
