// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
// } from "@/components/ui/card";
// import {
//   Building2,
//   MapPin,
//   Calendar,
//   Truck,
//   Leaf,
//   Package,
// } from "lucide-react";
// import { Team, teams } from "@/mock-data/teams";

// interface ModuleCardProps {
//     team: Team[]
// }

// const STATUS_CONFIG = {
//   on_route: {
//     label: "On route",
//     className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
//   },
//   delivered: {
//     label: "Delivered",
//     className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
//   },
//   ready_for_transportation: {
//     label: "Ready",
//     className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
//   },
//   delayed: {
//     label: "Delayed",
//     className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
//   },
//   offloaded: {
//     label: "Offloaded",
//     className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
//   },
// };

// const FILTERS = [
//   { key: "all", label: "All" },
//   { key: "ready_for_transportation", label: "Ready" },
//   { key: "on_route", label: "On route" },
//   { key: "delayed", label: "Delayed" },
//   { key: "offloaded", label: "Offloaded" },
//   { key: "delivered", label: "Delivered" },
// ];

// function DetailRow({ icon: Icon, label, value }: any) {
//   return (
//     <div className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
//       <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
//         <Icon size={13} />
//         {label}
//       </span>
//       <span className="text-xs text-right text-foreground">{value}</span>
//     </div>
//   );
// }

// function ModuleCard({ team }: ModuleCardProps) {
//   const { properties, name, id } = team;
//   const status = STATUS_CONFIG[properties.status];

//   return (
//     <Card className="flex flex-col gap-0">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between gap-2">
//           <div className="flex items-center gap-2.5">
//             <span className="text-xl">{icon}</span>
//             <div>
//               <p className="text-sm font-medium leading-tight">{name}</p>
//               <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{id}</p>
//             </div>
//           </div>
//           <Badge variant="outline" className={`text-[11px] shrink-0 ${status.className}`}>
//             {status.label}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-0">
//         <DetailRow icon={Building2} label="Supplier" value={properties.supplier} />
//         <DetailRow icon={MapPin} label="Departure" value={properties.departureLocation.replace(", Finland", "")} />
//         <DetailRow icon={Calendar} label="Scheduled" value={properties.scheduledDate} />
//         <DetailRow icon={Truck} label="Transporter" value={properties.transporter} />
//         <DetailRow
//           icon={Leaf}
//           label="CO₂ footprint"
//           value={`${properties.carbonFootprint} t CO₂e`}
//         />
//       </CardContent>
//     </Card>
//   );
// }

// export default function ModuleCards() {
//   const [activeFilter, setActiveFilter] = useState("all");

//   const filtered =
//     activeFilter === "all"
//       ? teams
//       : teams.filter((t) => t.properties.status === activeFilter);

//   return (
//     <div className="p-6 space-y-5">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Package size={18} className="text-muted-foreground" />
//           <h1 className="text-base font-medium">Modules</h1>
//           <Badge variant="secondary" className="text-xs">
//             {filtered.length}
//           </Badge>
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-1.5">
//         {FILTERS.map((f) => (
//           <Button
//             key={f.key}
//             variant={activeFilter === f.key ? "default" : "outline"}
//             size="sm"
//             className="h-7 text-xs rounded-full px-3"
//             onClick={() => setActiveFilter(f.key)}
//           >
//             {f.label}
//           </Button>
//         ))}
//       </div>

//       {filtered.length === 0 ? (
//         <div className="text-sm text-muted-foreground text-center py-12">
//           No modules match this filter.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
//           {filtered.map((team) => (
//             <ModuleCard key={team.id} team={team} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }