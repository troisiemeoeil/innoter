import { User, users } from './users';
import { Status, status } from './status';
import { Priority, priorities } from './priorities';
import { LabelInterface, labels } from './labels';
import { Project, projects } from './projects';

export type NotificationType =
   | 'comment'
   | 'mention'
   | 'assignment'
   | 'status'
   | 'reopened'
   | 'closed'
   | 'edited'
   | 'created'
   | 'upload';

export interface InboxItem {
   id: string;
   identifier: string;
   title: string;
   description: string;
   status: Status;
   assignee: User | null;
   priority: Priority;
   labels: LabelInterface[];
   createdAt: string;
   cycleId: string;
   project?: Project;
   subissues?: string[];
   dueDate?: string;
   // Propriétés spécifiques à l'inbox (conservées)
   content: string;
   type: NotificationType;
   user: User;
   timestamp: string;
   read: boolean;
}

export const inboxItems: InboxItem[] = [
   {
      id: '1',
      identifier: 'SITE-101',
      title: 'Foundation excavation completed - Ready for concrete pour',
      description: 'Foundation excavation has been completed successfully. Site is ready for concrete pour scheduled for next week.',
      status: status[0],
      assignee: users[0],
      priority: priorities[1],
      labels: [labels[0]],
      createdAt: '2024-01-15T10:00:00Z',
      cycleId: '41',
      project: projects[0],
      dueDate: '2024-02-15T00:00:00Z',
      content: 'Excavation team completed ahead of schedule',
      type: 'comment',
      user: users[0],
      timestamp: '10h',
      read: false,
   },
   {
      id: '2',
      identifier: 'SITE-204',
      title: 'Safety inspection scheduled for tomorrow',
      description: 'Weekly safety inspection has been scheduled for tomorrow at 9:00 AM. All team leads must attend.',
      status: status[1],
      assignee: users[1],
      priority: priorities[1],
      labels: [labels[1]],
      createdAt: '2024-01-12T14:30:00Z',
      cycleId: '41',
      project: projects[0],
      content: 'Inspection meeting added to calendar',
      type: 'comment',
      user: users[1],
      timestamp: '4d',
      read: false,
   },
   {
      id: '3',
      identifier: 'SITE-309',
      title: 'Lumber delivery delayed by 2 days',
      description: 'Scheduled lumber delivery has been delayed due to weather conditions. New delivery date: January 18.',
      status: status[2],
      assignee: users[2],
      priority: priorities[0],
      labels: [labels[2]],
      createdAt: '2024-01-10T09:15:00Z',
      cycleId: '41',
      project: projects[1],
      content: 'Supplier notified of delay',
      type: 'reopened',
      user: users[2],
      timestamp: '6d',
      read: true,
   },
   {
      id: '4',
      identifier: 'SITE-415',
      title: 'Electrical wiring inspection failed - Rework required',
      description: 'Electrical wiring inspection identified issues requiring rework. Inspector has provided detailed report.',
      status: status[3],
      assignee: users[3],
      priority: priorities[2],
      labels: [labels[0], labels[2]],
      createdAt: '2024-01-03T16:45:00Z',
      cycleId: '42',
      project: projects[0],
      content: 'Electrician team has been notified',
      type: 'comment',
      user: users[3],
      timestamp: '13d',
      read: false,
   },
   {
      id: '5',
      identifier: 'SITE-501',
      title: 'Steel beam installation 50% complete',
      description: 'Steel frame installation is 50% complete as of today. On schedule for completion by end of month.',
      status: status[4],
      assignee: users[4],
      priority: priorities[1],
      labels: [labels[1]],
      createdAt: '2023-12-28T11:20:00Z',
      cycleId: '42',
      project: projects[1],
      content: 'Installation progressing well, no delays',
      type: 'comment',
      user: users[4],
      timestamp: '18d',
      read: true,
   },
   {
      id: '6',
      identifier: 'SITE-502',
      title: 'OSHA compliance documentation updated',
      description: 'All OSHA compliance documentation has been updated and filed for current quarter.',
      status: status[5],
      assignee: users[4],
      priority: priorities[2],
      labels: [labels[3]],
      createdAt: '2023-12-28T11:25:00Z',
      cycleId: '42',
      project: projects[0],
      content: 'Documentation uploaded to project management system',
      type: 'edited',
      user: users[4],
      timestamp: '18d',
      read: false,
   },
   {
      id: '7',
      identifier: 'SITE-503',
      title: 'Concrete slab pour scheduled for next Tuesday',
      description: 'Ground floor concrete slab pour has been scheduled for next Tuesday at 7:00 AM.',
      status: status[3],
      assignee: users[2],
      priority: priorities[0],
      labels: [labels[0]],
      createdAt: '2023-12-20T08:00:00Z',
      cycleId: '43',
      project: projects[1],
      content: 'All materials have been confirmed and ready',
      type: 'closed',
      user: users[2],
      timestamp: '4w',
      read: true,
   },
   {
      id: '8',
      identifier: 'SITE-504',
      title: 'Scaffold installation completed on South wing',
      description: 'Safety scaffolding installation has been completed on the South wing section.',
      status: status[1],
      assignee: users[2],
      priority: priorities[1],
      labels: [labels[2]],
      createdAt: '2023-12-20T08:15:00Z',
      cycleId: '43',
      project: projects[0],
      content: 'Safety certification completed',
      type: 'closed',
      user: users[2],
      timestamp: '4w',
      read: true,
   },
   {
      id: '9',
      identifier: 'SITE-505',
      title: 'Plumbing rough-in inspection scheduled',
      description: 'Plumbing rough-in inspection has been scheduled for next Friday.',
      status: status[5],
      assignee: users[2],
      priority: priorities[2],
      labels: [labels[1]],
      createdAt: '2023-12-20T08:30:00Z',
      cycleId: '43',
      project: projects[1],
      content: 'Inspector confirmed availability',
      type: 'closed',
      user: users[2],
      timestamp: '4w',
      read: true,
   },
   {
      id: '10',
      identifier: 'SITE-506',
      title: 'Weather delay - Site closure until Thursday',
      description: 'Due to forecasted severe weather, the site will be closed until Thursday for safety.',
      status: status[2],
      assignee: users[0],
      priority: priorities[0],
      labels: [labels[0]],
      createdAt: '2023-12-15T13:45:00Z',
      cycleId: '44',
      project: projects[0],
      content: 'All outdoor work suspended, indoor work continues',
      type: 'comment',
      user: users[0],
      timestamp: '1mo',
      read: false,
   },
   {
      id: '11',
      identifier: 'SITE-507',
      title: 'Fireproofing material application started',
      description: 'Application of fireproofing material has begun on structural steel elements.',
      status: status[3],
      assignee: users[1],
      priority: priorities[1],
      labels: [labels[2]],
      createdAt: '2023-12-10T10:00:00Z',
      cycleId: '44',
      project: projects[1],
      content: 'Crew trained and materials on site',
      type: 'status',
      user: users[1],
      timestamp: '5w',
      read: false,
   },
   {
      id: '12',
      identifier: 'SITE-508',
      title: 'Weekly toolbox safety meeting - Wednesday 8 AM',
      description: 'All site personnel required to attend weekly toolbox safety meeting on Wednesday at 8:00 AM.',
      status: status[0],
      assignee: users[5],
      priority: priorities[1],
      labels: [labels[1]],
      createdAt: '2023-12-10T10:15:00Z',
      cycleId: '44',
      project: projects[0],
      content: 'Topic: Personal Protective Equipment compliance',
      type: 'comment',
      user: users[5],
      timestamp: '5w',
      read: true,
   },
   {
      id: '13',
      identifier: 'SITE-509',
      title: 'Material purchase order approved',
      description: 'Material purchase order for drywall and insulation has been approved and placed.',
      status: status[5],
      assignee: users[5],
      priority: priorities[2],
      labels: [labels[1]],
      createdAt: '2023-12-10T10:30:00Z',
      cycleId: '44',
      project: projects[1],
      content: 'Delivery expected January 5th, 2024',
      type: 'comment',
      user: users[5],
      timestamp: '5w',
      read: true,
   },
   {
      id: '14',
      identifier: 'SITE-510',
      title: 'Project milestone achieved - Foundation phase complete',
      description: 'Foundation phase has been completed successfully on schedule.',
      status: status[2],
      assignee: users[2],
      priority: priorities[2],
      labels: [labels[1]],
      createdAt: '2023-12-05T15:20:00Z',
      cycleId: '45',
      project: projects[0],
      content: 'Celebrating team achievement',
      type: 'reopened',
      user: users[2],
      timestamp: '6w',
      read: false,
   },
   {
      id: '15',
      identifier: 'SITE-511',
      title: 'Heavy equipment rental extension approved',
      description: 'Extension of heavy equipment rental contract has been approved due to project timeline adjustments.',
      status: status[1],
      assignee: users[4],
      priority: priorities[0],
      labels: [labels[0]],
      createdAt: '2023-12-05T15:35:00Z',
      cycleId: '45',
      project: projects[1],
      content: 'Equipment will remain on site through February',
      type: 'mention',
      user: users[4],
      timestamp: '6w',
      read: false,
   },
   {
      id: '16',
      identifier: 'SITE-512',
      title: 'Quality control audit scheduled',
      description: 'Third-party quality control audit has been scheduled for next month to verify compliance.',
      status: status[4],
      assignee: users[6],
      priority: priorities[1],
      labels: [labels[2]],
      createdAt: '2023-11-28T12:00:00Z',
      cycleId: '45',
      project: projects[0],
      content: 'Audit firm confirmed for January 15th',
      type: 'assignment',
      user: users[6],
      timestamp: '7w',
      read: true,
   },
   {
      id: '17',
      identifier: 'SITE-513',
      title: 'Subcontractor performance review meeting',
      description: 'Quarterly subcontractor performance review meeting scheduled to assess progress and address concerns.',
      status: status[3],
      assignee: users[2],
      priority: priorities[2],
      labels: [labels[1]],
      createdAt: '2023-11-28T12:15:00Z',
      cycleId: '45',
      project: projects[1],
      content: 'All subcontractors performing within specifications',
      type: 'status',
      user: users[2],
      timestamp: '7w',
      read: true,
   },
];

export const filterByReadStatus = (items: InboxItem[], isRead: boolean): InboxItem[] => {
   return items.filter((item) => item.read === isRead);
};

export const filterByType = (items: InboxItem[], type: NotificationType): InboxItem[] => {
   return items.filter((item) => item.type === type);
};

export const filterByUser = (items: InboxItem[], userId: string): InboxItem[] => {
   return items.filter((item) => item.user.id === userId);
};

export const markAsRead = (items: InboxItem[], itemId: string): InboxItem[] => {
   return items.map((item) => (item.id === itemId ? { ...item, read: true } : item));
};

export const markAllAsRead = (items: InboxItem[]): InboxItem[] => {
   return items.map((item) => ({ ...item, read: true }));
};
