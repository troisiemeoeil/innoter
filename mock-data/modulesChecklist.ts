import { teams } from './teams';
import { User, users } from './users';

export type JobTitle = User['jobTitle'];

export type ChecklistTaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export interface AssignedWorker {
   id: string;
   name: string;
   jobTitle: JobTitle;
}

export interface ChecklistTask {
   id: string;
   description: string;
   assignedTo: AssignedWorker;
   assignedDate: string; // ISO date (YYYY-MM-DD)
   etaDate: string;      // ISO date (YYYY-MM-DD)
   status: ChecklistTaskStatus;
}

interface ModuleProperties {
      address: string;
      city: string;
      country: string;
      postalCode: string;
      state: string;
      supplier: string;
      scheduledDate: string;
      departureLocation: string;
      status: "ready_for_transportation" | "on_route" | "delayed" | "offloaded" | "delivered";
      carbonFootprint: number;
      transporter: string;
}

export interface ModuleChecklist {
   moduleId: string;   // matches Team.id
   moduleName: string; // matches Team.name
   tasks: ChecklistTask[];
   properties: ModuleProperties
}

export interface TaskTemplate {
   id: string;
   label: string;
   description: string;
   jobTitle: JobTitle;
   rowId: string;
   startTime: string;
   duration: number;
   type: string;
   attendees: number;

}


/* ------------------------------------------------------------------ */
/*  Task templates per module — references real members from users.ts */
/*  via jobTitle, resolved to an actual person at build time below.   */
/* ------------------------------------------------------------------ */

export const moduleTaskTemplates: Record<string, TaskTemplate[]> = {
   BLOKK: [
      { description: 'Verify pod dimensions and plumbing rough-in match the floor plan before lift', jobTitle: 'Project Engineer', id: 'slot-2', rowId: 'room-4', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect waterproof membrane and tray for transport damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-3', rowId: 'room-3', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm crane/lift route and rigging points are clear and rated for pod weight', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Set pod onto prepared structural opening and check level/plumb', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect supply and waste plumbing stubs; pressure test for leaks', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect electrical and ventilation ducting; test extractor fan', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Seal pod-to-structure junctions and apply fire-stopping where required', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Sign off final QA inspection and update commissioning log', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   MODSTEEL: [
      { description: 'Check delivery manifest against shop drawings for correct frame sections', jobTitle: 'Transporter', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect steel members for transport damage, corrosion, or weld defects', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm foundation/base plate bolt positions match frame footprint', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift and position frame module; verify plumb, level, and square', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Torque all bolted connections to specified values and record results', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Complete site welding (if required) and inspect welds per QA standard', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Apply touch-up corrosion protection to any damaged coating', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Obtain structural engineer sign-off before proceeding to next module', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   VOLUMETRIC: [
      { description: 'Confirm module orientation and unit number against installation sequence', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect exterior wrap/protection for damage from transport', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Verify crane capacity and lift plan for full volumetric unit', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lower module onto support structure and align with adjacent units', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect inter-module structural ties and tolerances', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect stacked MEP risers (plumbing, electrical, HVAC) between floors', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Seal external joints and inter-unit fire/acoustic separation', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Carry out internal snagging walk-through and log defects', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   TIMBER: [
      { description: 'Check moisture content of CLT panels on arrival is within spec', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect panel surfaces and edges for splitting or transport damage', jobTitle: 'Transporter', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm panel labelling matches erection sequence drawing', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift panel into position using vacuum lifter or rated slings', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Fix panel to base track/connector and verify vertical alignment', jobTitle: 'Surveyor', id: 'slot-2', rowId: 'room-2', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install panel-to-panel spline or half-lap joints and fasten per spec', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Apply weather protection membrane until building is enclosed', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Record panel installation in traceability log with batch number', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   CONCRETE: [
      { description: 'Verify precast unit ID and casting date against delivery docket', jobTitle: 'Transporter', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect unit for cracking, spalling, or chipped edges', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm crane and rigging are rated for core unit weight', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Position core onto foundation/starter bars and check alignment', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Grout base joint and install starter bar couplers as specified', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install temporary bracing and verify plumb before release from crane', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Cast/seal vertical joints between core sections per detail', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Remove temporary bracing only after grout/joint cure confirmed', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   HYBRID: [
      { description: 'Confirm cassette type and span rating matches structural drawing', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect timber and steel composite connections for shipping damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Verify bearing supports/walls are level and at correct height', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift cassette into place and check bearing length on all sides', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Fix cassette to supporting structure with specified fasteners', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect service penetrations (ducting, conduit) routed through cassette', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install acoustic/fire-rated infill between cassette and adjacent units', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Conduct deflection/load sign-off before loading floor further', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   PREFAB: [
      { description: 'Check facade panel finish and dimensions against approved sample', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect panel for cracks, scratches, or coating damage from transit', jobTitle: 'Transporter', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm bracket/anchor positions on structure match panel layout', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift and align panel onto support brackets; check level and plumb', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Secure panel fixings and torque to manufacturer specification', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install and seal panel-to-panel and panel-to-structure joints', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Fit weatherproofing flashing and backer rod/sealant at perimeters', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Perform visual QA and watertightness check on completed elevation', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   QUALITY: [
      { description: 'Verify truss span, pitch, and loading rating against design', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect timber/steel truss for warping or connector plate damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm wall plates are level and truss spacing is marked out', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift truss into position and temporarily brace before release', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Fix truss to wall plate with specified hangers/straps', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install permanent bracing (diagonal and longitudinal) per layout', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Check truss alignment and spacing tolerance across full roof', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Sign off structural inspection before roof covering begins', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   STEEL: [
      { description: 'Cross-check beam assembly mark numbers against erection drawings', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect beams for deformation, weld cracks, or coating damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm column/support connection points are correctly positioned', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift beam assembly into place using certified rigging and spreader bar', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Align and bolt/weld beam-to-column connections per design', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Torque bolted connections to spec and tag as inspected', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Apply fireproofing/intumescent coating where required', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Obtain structural sign-off prior to loading the assembly', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   DESIGN: [
      { description: 'Verify MEP module schematic matches site service routing plan', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect pipework, ductwork, and cable trays for shipping damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm plant room/riser opening dimensions match module footprint', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Position and secure module onto support frame or plinth', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect mechanical, electrical, and plumbing services to building risers', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Pressure test pipework and megger test electrical circuits', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Commission and label all valves, panels, and isolation points', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Complete handover documentation and as-built service drawings', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   SUPPLY: [
      { description: 'Confirm stair flight/landing dimensions against architectural drawings', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect stringers, treads, and handrail brackets for damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Verify floor opening and support ledges are correctly positioned', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift and position stair module, checking level and rise/going', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Fix module to supporting structure and torque connection bolts', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install temporary edge protection and handrails for site safety', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Fit permanent balustrade and handrail per building code', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Carry out final safety and compliance walk-through', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   ASSEMBLY: [
      { description: 'Check balcony module dimensions and cantilever length against drawings', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect balustrade, decking, and drainage outlet for transport damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm thermal break/connection brackets are installed on structure', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift module into position and verify level fall for drainage', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Bolt/weld balcony connection to structural frame per detail', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect drainage outlet to building downpipe system', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install balustrade and verify load/safety compliance', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Conduct final waterproofing and snagging inspection', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   COMPLIANCE: [
      { description: 'Verify lift shaft internal dimensions against lift manufacturer spec', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect shaft walls and guide rail brackets for damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm shaft pit and headroom clearances meet code requirements', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Position and align shaft module plumb across full height', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Secure shaft-to-shaft and shaft-to-floor connections', jobTitle: 'Welder', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Install fire-rated sealing at all floor penetrations', jobTitle: 'Safety Officer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Coordinate with lift contractor for guide rail and equipment install', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Complete statutory compliance inspection and certification', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   SUSTAINABILITY: [
      { description: 'Verify solar panel count, wattage, and layout against design', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect panels, frames, and cabling for transport damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm roof structure load rating and mounting points are ready', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift and fix module/mounting rails to roof structure', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect panel wiring strings and run conduit to inverter location', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Test panel output, polarity, and earthing/bonding continuity', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Commission inverter and verify grid/monitoring connection', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Complete electrical safety certificate and handover documentation', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   INNOVATION: [
      { description: 'Check plant module equipment list against procurement schedule', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect plant casing, pipework, and ductwork for shipping damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm plant deck/plinth is level and load rated for module', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Lift and position plant module onto vibration isolation mounts', jobTitle: 'Crane Operator', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect mechanical services (chilled water, refrigerant, ductwork)', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect electrical supply and controls/BMS wiring', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Carry out functional commissioning and performance test', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Sign off commissioning report and update O&M documentation', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   TECH: [
      { description: 'Verify control panel/module configuration matches BMS schematic', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect enclosure, wiring looms, and sensors for transport damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Confirm power and network/data points are available at install location', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Mount and secure control module to wall/rack location', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect power, network, and field device wiring per schematic', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Upload/verify control logic and point-to-point sensor mapping', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Test alarms, overrides, and integration with building systems', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Complete commissioning checklist and train facilities staff', jobTitle: 'Site Manager', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
   RESEARCH: [
      { description: 'Confirm module specification matches research/pilot installation brief', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Inspect service module fittings and sensor instrumentation for damage', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Verify designated install bay and service connections are prepared', jobTitle: 'Surveyor', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Position module and secure to floor/wall fixings', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Connect plumbing, electrical, and monitoring sensor cabling', jobTitle: 'Electrician', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Calibrate IoT/monitoring sensors and confirm data logging is active', jobTitle: 'Module Manufacturer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Pressure test plumbing and verify no leaks under operating conditions', jobTitle: 'Quality Assurance Inspector', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
      { description: 'Document installation data for research traceability records', jobTitle: 'Project Engineer', id: 'slot-1', rowId: 'room-1', startTime: '09:30', duration: 60, label: 'Daily Standup - Site Coordination', type: 'meeting', attendees: 8 },
   ],
};

/* ------------------------------------------------------------------ */
/*  Worker resolution — every assignee is pulled from users.ts        */
/* ------------------------------------------------------------------ */

const workersByJobTitle: Partial<Record<JobTitle, User[]>> = {};
users.forEach((user) => {
   if (!workersByJobTitle[user.jobTitle]) {
      workersByJobTitle[user.jobTitle] = [];
   }
   workersByJobTitle[user.jobTitle]!.push(user);
});

// Round-robin counters so different real members rotate across tasks
// instead of always assigning the same person for a given job title.
const rotationCounters: Partial<Record<JobTitle, number>> = {};

const nextWorkerForJob = (jobTitle: JobTitle): AssignedWorker => {
   const pool = workersByJobTitle[jobTitle];
   if (!pool || pool.length === 0) {
      throw new Error(`No member in users.ts has the job title "${jobTitle}"`);
   }
   const index = rotationCounters[jobTitle] ?? 0;
   const worker = pool[index % pool.length];
   rotationCounters[jobTitle] = index + 1;
   return { id: worker.id, name: worker.name, jobTitle: worker.jobTitle };
};

/* ------------------------------------------------------------------ */
/*  Date helpers                                                      */
/* ------------------------------------------------------------------ */

const addDays = (isoDate: string, days: number): string => {
   const date = new Date(`${isoDate}T00:00:00Z`);
   date.setUTCDate(date.getUTCDate() + days);
   return date.toISOString().slice(0, 10);
};

/* ------------------------------------------------------------------ */
/*  Status derivation — reflects each team's current shipment status  */
/* ------------------------------------------------------------------ */

type TeamStatus = typeof teams[number]['properties']['status'];

const deriveStatus = (teamStatus: TeamStatus, index: number, total: number): ChecklistTaskStatus => {
   switch (teamStatus) {
      case 'delivered':
         return 'completed';
      case 'offloaded':
         return index < total - 2 ? 'completed' : 'in_progress';
      case 'on_route':
         if (index < Math.ceil(total / 2)) return 'completed';
         return index < total - 1 ? 'in_progress' : 'pending';
      case 'delayed':
         if (index === 0) return 'completed';
         if (index === 1) return 'blocked';
         return 'pending';
      case 'ready_for_transportation':
      default:
         return index === 0 ? 'completed' : 'pending';
   }
};

/* ------------------------------------------------------------------ */
/*  Build the final checklist list from teams.ts + task templates     */
/* ------------------------------------------------------------------ */

export const installationChecklists: ModuleChecklist[] = teams
   .filter((team) => moduleTaskTemplates[team.id])
   .map((team) => {
      const templates = moduleTaskTemplates[team.id];
      const total = templates.length;
      const scheduledDate = team.properties.scheduledDate;
      const tasks: ChecklistTask[] = templates.map((template, index) => {
         // Spread assignment dates out over the weeks leading up to the
         // module's scheduled installation date, two days apart.
         const daysBeforeSchedule = (total - index) * 2;
         const assignedDate = addDays(scheduledDate, -daysBeforeSchedule);
         const etaDate = addDays(assignedDate, 2);

         return {
            id: `${team.id}-${String(index + 1).padStart(2, '0')}`,
            description: template.description,
            assignedTo: nextWorkerForJob(template.jobTitle),

            assignedDate,
            etaDate,
            status: deriveStatus(team.properties.status, index, total),
         };
      });

      return {
         moduleId: team.id,
         moduleName: team.name,
         tasks,
         properties: team.properties,
      };
   });

export const getChecklistByModuleId = (moduleId: string): ModuleChecklist | undefined =>
   installationChecklists.find((checklist) => checklist.moduleId === moduleId);

const missingChecklists = teams.filter((team) => !moduleTaskTemplates[team.id]);
if (missingChecklists.length > 0) {
   // eslint-disable-next-line no-console
   console.warn(
      'Missing installation checklist template(s) for module(s):',
      missingChecklists.map((t) => t.id).join(', ')
   );
}