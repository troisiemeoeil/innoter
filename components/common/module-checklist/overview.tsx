"use client"
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  MapPin,
  Truck,
  Leaf,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleDashed,
  LucideIcon,
  CirclePlus,
} from "lucide-react";
import {users} from '@/mock-data/users'
import {teams} from "@/mock-data/teams"
import {installationChecklists, moduleTaskTemplates} from "@/mock-data/modulesChecklist"
/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type JobTitle =
  | "Crane Operator"
  | "Transporter"
  | "Quality Assurance Inspector"
  | "Module Manufacturer"
  | "Site Manager"
  | "Safety Officer"
  | "Electrician"
  | "Welder"
  | "Surveyor"
  | "Project Engineer";

type UserStatus = "online" | "offline" | "away";

type ModuleStatus =
  | "ready_for_transportation"
  | "on_route"
  | "delayed"
  | "offloaded"
  | "delivered";

type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";

interface UserRecord {
  id: string;
  name: string;
  jobTitle: JobTitle;
  status: UserStatus;
}

interface TeamProperties {
  city: string;
  state: string;
  supplier: string;
  scheduledDate: string;
  departureLocation: string;
  status: ModuleStatus;
  carbonFootprint: number;
  transporter: string;
}

interface TeamRecord {
  id: string;
  name: string;
  icon: string;
  properties: TeamProperties;
}

interface TaskTemplate {
  description: string;
  jobTitle: JobTitle;
}

interface ChecklistTask {
  id: string;
  description: string;
  assignedTo: UserRecord;
  assignedDate: string;
  etaDate: string;
  status: TaskStatus;
}

interface ModuleChecklist extends TeamRecord {
  tasks: ChecklistTask[];
}

interface TaskStatusMeta {
  label: string;
  classes: string;
  icon: LucideIcon;
}

console.log(installationChecklists)



/* ------------------------------------------------------------------ */
/*  Checklist generation — same logic as installationChecklists.ts    */
/* ------------------------------------------------------------------ */

const workersByJobTitle: Partial<Record<JobTitle, UserRecord[]>> = {};
users.forEach((u) => {
  if (!workersByJobTitle[u.jobTitle]) workersByJobTitle[u.jobTitle] = [];
  workersByJobTitle[u.jobTitle]!.push(u);
});

const addDays = (isoDate: string, days: number): string => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const deriveTaskStatus = (
  moduleStatus: ModuleStatus,
  index: number,
  total: number
): TaskStatus => {
  switch (moduleStatus) {
    case "delivered":
      return "completed";
    case "offloaded":
      return index < total - 2 ? "completed" : "in_progress";
    case "on_route":
      if (index < Math.ceil(total / 2)) return "completed";
      return index < total - 1 ? "in_progress" : "pending";
    case "delayed":
      if (index === 0) return "completed";
      if (index === 1) return "blocked";
      return "pending";
    default:
      return index === 0 ? "completed" : "pending";
  }
};

const buildChecklists = (): ModuleChecklist[] => {
  const rotation: Partial<Record<JobTitle, number>> = {};

  const nextWorker = (jobTitle: JobTitle): UserRecord => {
    const pool = workersByJobTitle[jobTitle] ?? [];
    const i = rotation[jobTitle] ?? 0;
    rotation[jobTitle] = i + 1;
    return pool[i % pool.length];
  };

  return teams.map((team): ModuleChecklist => {
    const templates: TaskTemplate[] = moduleTaskTemplates[team.id] ?? [];
    const total = templates.length;

    const tasks: ChecklistTask[] = templates.map((t, index) => {
      const daysBeforeSchedule = (total - index) * 2;
      const assignedDate = addDays(team.properties.scheduledDate, -daysBeforeSchedule);
      const etaDate = addDays(assignedDate, 2);

      return {
        id: `${team.id}-${String(index + 1).padStart(2, "0")}`,
        description: t.description,
        assignedTo: nextWorker(t.jobTitle),
        assignedDate,
        etaDate,
        status: deriveTaskStatus(team.properties.status, index, total),
      };
    });

    return { ...team, tasks };
  });
};

/* ------------------------------------------------------------------ */
/*  Presentation helpers                                              */
/* ------------------------------------------------------------------ */

const MODULE_STATUS_STYLES: Record<ModuleStatus, string> = {
  ready_for_transportation: "bg-slate-100 text-slate-700 border-slate-200",
  on_route: "bg-blue-50 text-blue-700 border-blue-200",
  delayed: "bg-amber-50 text-amber-700 border-amber-200",
  offloaded: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
};

const MODULE_STATUS_RAIL: Record<ModuleStatus, string> = {
  ready_for_transportation: "bg-slate-300",
  on_route: "bg-blue-500",
  delayed: "bg-amber-500",
  offloaded: "bg-purple-500",
  delivered: "bg-green-500",
};

const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  ready_for_transportation: "Ready for transport",
  on_route: "On route",
  delayed: "Delayed",
  offloaded: "Offloaded",
  delivered: "Delivered",
};

const TASK_STATUS_META: Record<TaskStatus, TaskStatusMeta> = {
  pending: { label: "Pending", classes: "bg-slate-100 text-slate-600 border-slate-200", icon: CircleDashed },
  in_progress: { label: "In progress", classes: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  completed: { label: "Completed", classes: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  blocked: { label: "Blocked", classes: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
};




/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ModuleInstallationTable(): React.JSX.Element {
  const checklists = useMemo<ModuleChecklist[]>(() => buildChecklists(), []);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const toggleRow = (id: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full bg-white p-4">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-medium normal-case tracking-widest text-slate-400">
            Site logistics
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">
            Module installation tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {checklists.length} modules &middot; click a row to view its installation checklist
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-3 text-xs text-slate-500 sm:flex">
          {(Object.entries(MODULE_STATUS_LABEL) as [ModuleStatus, string][]).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${MODULE_STATUS_RAIL[key]}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-8" />
              <TableHead className="text-xs font-medium uppercase tracking-wide text-slate-500">Module</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-slate-500">Location</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-slate-500">Supplier</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-slate-500">Transporter</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-slate-500">Scheduled</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-slate-500">Checklist</TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wide text-slate-500">CO&#8322;e (t)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            {installationChecklists.map((module) => {
              const isOpen = expanded.has(module.moduleId);
              const completedCount = module.tasks.filter((t) => t.status === "completed").length;
              const total = module.tasks.length;

              return (
                <>
                  <TableRow
                    key={module.moduleId}
                    onClick={() => toggleRow(module.moduleId)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <TableCell className="py-3">
                      <ChevronRight
                        className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        {/* <span className="text-base leading-none">{module.icon}</span> */}
                        <div>
                          <p className="text-sm font-medium text-slate-900">{module.moduleName}</p>
                          <p className="font-mono text-[11px] text-slate-400">{module.moduleId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {module.properties.city}, {module.properties.state}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-slate-600">
                      {module.properties.supplier}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                        {module.properties.transporter}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-sm text-slate-600">
                      {(module.properties.scheduledDate)}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={`font-normal ${MODULE_STATUS_STYLES[module.properties.status]}`}
                      >
                        {MODULE_STATUS_LABEL[module.properties.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-slate-900"
                            style={{ width: `${(completedCount / total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {completedCount}/{total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-sm text-slate-600">
                        <Leaf className="h-3.5 w-3.5 text-slate-400" />
                        {module.properties.carbonFootprint.toFixed(1)}
                      </div>
                    </TableCell>
                  </TableRow>

                  {isOpen && (
                    <TableRow key={`${module.moduleId}-detail`} className="hover:bg-transparent">
                      <TableCell colSpan={9} className="bg-slate-50 p-0">
                        <div className="border-t border-slate-200 px-6 py-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-medium normal-case tracking-wide text-slate-500">
                              Installation checklist for {module.moduleName}
                            </p>
                            <p className="font-mono text-[11px] text-slate-400">
                              {module.properties.departureLocation}
                            </p>
                          </div>

                          <div className="overflow-hidden rounded-md border border-slate-200 bg-white p-2">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-white hover:bg-white">
                                  <TableHead className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Task</TableHead>
                                  <TableHead className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Assigned to</TableHead>
                                  <TableHead className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Assigned</TableHead>
                                  <TableHead className="text-[11px] font-medium uppercase tracking-wide text-slate-400">ETA</TableHead>
                                  <TableHead className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {module.tasks.map((task) => {
                                  const meta = TASK_STATUS_META[task.status];
                                  const Icon = meta.icon;
                                  return (
                                    <TableRow key={task.id} className="hover:bg-slate-50/60">
                                      <TableCell className="max-w-xs py-2.5 text-sm text-slate-700">
                                 
                                        {task.description}
                                      </TableCell>
                                      <TableCell className="py-2.5">
                                        <div className="flex items-start gap-2">
                                       
                                          <div>
                                            <p className="text-sm text-slate-800">{task.assignedTo.name}</p>
                                            <p className="text-[11px] text-slate-400">{task.assignedTo.jobTitle}</p>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-2.5 font-mono text-xs text-slate-500">
                                       { (task.assignedDate)}
                                      </TableCell>
                                      <TableCell className="py-2.5 font-mono text-xs text-slate-500">
                                       { (task.etaDate)}
                                      </TableCell>
                                      <TableCell className="py-2.5">
                                        <Badge
                                          variant="outline"
                                          className={`gap-1 font-normal ${meta.classes}`}
                                        >
                                          <Icon className="h-3 w-3" />
                                          {meta.label}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}