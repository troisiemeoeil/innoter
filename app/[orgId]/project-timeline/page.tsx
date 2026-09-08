

import TimelineOverview from '@/components/common/project-timeline-v2/Overview'
import { ProjectsTimeline } from '@/components/common/projects-timeline/projects-timeline'
import MainLayout from '@/components/layout/main-layout'
import { Label } from '@/components/ui/label'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'



export default function Timeline() {

    // const [mounted, setMounted] = useState(false);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    // if (!mounted) return null;

    return (
        <MainLayout>
            <div className="h-svh  lg:py-2 lg:pr-2 w-full">



                <ResizablePanelGroup
                    direction="vertical"
                    autoSaveId="inbox-panel-group"
                    className="w-full h-full"
                >
                    <ResizablePanel defaultSize={350} maxSize={500}>
                        <ProjectsTimeline />
                    </ResizablePanel>
                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={200} maxSize={500}>
                        <div className='p-4 '>
                            <Label>Hourly Project management</Label>
                            <TimelineOverview />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </MainLayout>
    )
}
