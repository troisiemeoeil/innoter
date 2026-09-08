import { CalendarControls } from '@/components/common/calendar/calendar-controls';
import { CalendarHeader } from '@/components/common/calendar/calendar-header';
import { CalendarView } from '@/components/common/calendar/calendar-view';
// import Header from '@/components/layout/headers/members/header'
import MainLayout from '@/components/layout/main-layout';
import React from 'react';

export default function Calendar() {
   return (
      <MainLayout>
         <div className="h-svh overflow-hidden lg:p-2 w-full">
            <div className="w-full">
               <CalendarHeader />
               <CalendarControls />
            </div>
            <div className="flex-1 overflow-hidden w-full">
               <CalendarView />
            </div>
         </div>
      </MainLayout>
   );
}
