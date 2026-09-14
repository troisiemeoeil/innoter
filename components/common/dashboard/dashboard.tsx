 'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useNotificationsStore } from '@/store/notifications-store';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ListofActions from '../action-center/ListofActions';
import TimelineOverview from '../project-timeline-v2/Overview';
import MapboxComponent from '../map/map';
import { Team, teams } from "@/mock-data/teams";
import { Button } from '@/components/ui/button';
import {  ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Dynamically load heavy components to reduce initial bundle size
const ThatOpenWorlds = dynamic(() => import('./BIMviewer'), {
   loading: () => <div className="flex items-center justify-center h-full">Loading 3D Viewer...</div>,
   ssr: false,
});

// Memoize the heavy viewer so it doesn't re-render when unrelated parent state changes.
const MemoThatOpenWorlds = React.memo(ThatOpenWorlds);
const MemoTimeline = React.memo(TimelineOverview);



export default function Dashboard() {
   const params = useParams();
  const orgId = params.orgId;


   const {
      notifications,
      // selectedNotification,
      // setSelectedNotification,
      // markAsRead,
      // markAllAsRead,
      // getUnreadNotifications,
   } = useNotificationsStore();

   const [showRead, setShowRead] = useState(true);
   // const [showSnoozed, setShowSnoozed] = useState(false);
   const [showUnreadFirst, setShowUnreadFirst] = useState(false);
   const [ordering, setOrdering] = useState('newest');
   // const [showId, setShowId] = useState(true);
   // const [showStatusIcon, setShowStatusIcon] = useState(true);

   // Filter and sort notifications based on settings
   const filteredNotifications = notifications
      .filter((notification) => {
         if (!showRead && notification.read) return false;
         // Add snoozed filter logic here when implemented
         return true;
      })
      .sort((a, b) => {
         if (showUnreadFirst) {
            if (!a.read && b.read) return -1;
            if (a.read && !b.read) return 1;
         }
         // Sort by timestamp (newest first by default)
         return ordering === 'newest'
            ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });

   const handleDeleteAllNotifications = () => {
      console.log('Delete all notifications');
   };

   const handleDeleteReadNotifications = () => {
      console.log('Delete read notifications');
   };

   const handleDeleteCompletedIssues = () => {
      console.log('Delete notifications for completed issues');
   };

  const [selectedStore, setSelectedStore] = useState<Team | null>(null)

   return (
      <ResizablePanelGroup
         direction="horizontal"
         autoSaveId="inbox-panel-group"
         className="w-full h-full overflow-hidden"
      >
         <ResizablePanel defaultSize={100} className="m-2">

            <ResizablePanelGroup direction='vertical' autoSaveId="inbox-panel-group"
               className="w-full h-full overflow-hidden">
               <ResizablePanel defaultSize={50} maxSize={500} className="overflow-hidden m-1">
                  <div className="w-full h-full overflow-hidden ">
                     <div className=' w-full flex  justify-between items-start mb-2'>

                     <SidebarTrigger className="relative mb-1" />
                     <Link href={`/${orgId}/site-overview`}>
                        <Button className='flex hover:cursor-pointer   rounded-full hover:bg-accent text-black border-black bg-white dark:bg-accent-foreground p-0 m-0'>
                           
                           <ArrowUpRight />
                           </Button>
                        </Link>
                     </div>
                     <MemoThatOpenWorlds
                        config={useMemo(() => ({
                           backgroundColor: '#202932',
                           directionalLightIntensity: 1.5,
                           ambientLightIntensity: 1,
                           modelUrl:
                              'https://thatopen.github.io/engine_components/resources/frags/school_arq.frag',
                        }), [])}
                        // onWorldReady={useCallback((world) => {
                        //    // Access world.camera, world.scene, world.renderer
                        // }, [])}
                     />
                  </div>
               </ResizablePanel>
               <ResizableHandle withHandle />
               <ResizablePanel defaultSize={50}>
                  <MemoTimeline />
               </ResizablePanel>
            </ResizablePanelGroup>
         </ResizablePanel>
         <ResizableHandle withHandle />
         <ResizablePanel defaultSize={50} className="m-2">
            <ResizablePanelGroup direction={'vertical'} className="overflow-hidden">
               <ResizablePanel defaultSize={75} maxSize={500} className="overflow-hidden ">
                  <div style={{ width: '100%', height: '100vh' }}  className="overflow-hidden">
                     <div className='h-11  w-full flex  justify-end items-start'>
                       <Link href={`/${orgId}/module-logistics`}>
                        <Button className='flex hover:cursor-pointer   rounded-full hover:bg-accent text-black border-black bg-white dark:bg-accent-foreground p-0 m-0'>
                           
                           <ArrowUpRight />
                           </Button>
                        </Link>
                     </div>
                     <MapboxComponent selectedStore={selectedStore} setSelectedStore={setSelectedStore}/>
                  </div>
               </ResizablePanel>
               <ResizableHandle withHandle />
               <ResizablePanel defaultSize={40} maxSize={500}>
                  <ListofActions />
               </ResizablePanel>
            </ResizablePanelGroup>
         </ResizablePanel>
      </ResizablePanelGroup>
   );
}
