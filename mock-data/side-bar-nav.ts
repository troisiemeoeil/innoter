import {
   Inbox,
   FolderKanban,
   ContactRound,
   Box,
   Settings,
   Bell,
   KeyRound,
   Users,
   Tag,
   Layers,
   FileText,
   MessageSquare,
   Clock,
   Zap,
   UserRound,
   HomeIcon,
   Calendar,
   TimerIcon,
   ListCheck,
   Truck,
   MapPinCheck
} from 'lucide-react';

export const inboxItems = [
   {
      name: 'Dashboard',
      url: '/innoter/dashboard',
      icon: HomeIcon,
   },
      {
      name: 'Site Overview',
      url: '/innoter/site-overview',
      icon: Layers,
   },
   {
      name: 'Module Checklist',
      url: '/innoter/module-checklist',
      icon: ListCheck,
   },
  
];

export const workspaceItems = [
   {
      name: 'Project Timeline',
      url: '/innoter/project-timeline',
      icon: TimerIcon,
   },
   {
      name: 'Calendar',
      url: '/innoter/calendar',
      icon: Calendar,
   },
   {
      name: 'Manufacturers',
      url: '/innoter/mc',
      icon: ContactRound,
   },
      {
      name: 'Module Logistics',
      url: '/innoter/module-logistics',
      icon: Truck,
   },
   {
      name: 'Module Checklist',
      url: '/innoter/module-checklist',
      icon: ListCheck,
   },
    {
      name: 'Module Offload',
      url: '/innoter/module-offload',
      icon: MapPinCheck,
   },
   // {
   //    name: 'Members',
   //    url: '/innoter/members',
   //    icon: UserRound,
   // },
];

type accountItems = {
  name: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}


export const accountItems: accountItems[] = [
   {
      name: 'Account',
      url: '/settings/account',
      icon: UserRound,
   },
   {
      name: 'Preferences',
      url: '/settings/preferences',
      icon: Settings,
   },
   {
      name: 'Profile',
      url: '/settings/profile',
      icon: UserRound,
   },
   {
      name: 'Notifications',
      url: '/settings/notifications',
      icon: Bell,
   },
   {
      name: 'Security & access',
      url: '/settings/security',
      icon: KeyRound,
   },
   {
      name: 'Connected accounts',
      url: '/settings/connected-accounts',
      icon: Users,
   },
];

type featuresItems = {
  name: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

export const featuresItems = [
   // {
   //    name: 'Labels',
   //    url: '/settings/labels',
   //    icon: Tag,
   // },
   // {
   //    name: 'Projects',
   //    url: '/settings/projects',
   //    icon: Box,
   // },
   // {
   //    name: 'Initiatives',
   //    url: '/settings/initiatives',
   //    icon: Layers,
   // },
   // {
   //    name: 'Customer requests',
   //    url: '/settings/customer-requests',
   //    icon: Inbox,
   // },
   // {
   //    name: 'Templates',
   //    url: '/settings/templates',
   //    icon: FileText,
   // },
   // {
   //    name: 'Asks',
   //    url: '/settings/asks',
   //    icon: MessageSquare,
   // },
   // {
   //    name: 'SLAs',
   //    url: '/settings/slas',
   //    icon: Clock,
   // },
   // {
   //    name: 'Emojis',
   //    url: '/settings/emojis',
   //    icon: MessageSquare,
   // },
   // {
   //    name: 'Integrations',
   //    url: '/settings/integrations',
   //    icon: Zap,
   // },
];
