export interface LabelInterface {
   id: string;
   name: string;
   color: string;
}

export const labels: LabelInterface[] = [
	{ id: 'safety', name: 'Safety Issue', color: 'red' },
	{ id: 'foundation', name: 'Foundation Work', color: 'orange' },
	{ id: 'structural', name: 'Structural Work', color: 'gray' },
	{ id: 'materials', name: 'Materials & Supply', color: 'blue' },
	{ id: 'scheduling', name: 'Scheduling', color: 'purple' },
	{ id: 'quality', name: 'Quality Assurance', color: 'green' },
	{ id: 'equipment', name: 'Equipment & Machinery', color: 'yellow' },
	{ id: 'inspection', name: 'Site Inspection', color: 'cyan' },
	{ id: 'compliance', name: 'Compliance', color: 'indigo' },
	{ id: 'budget', name: 'Budget & Cost', color: 'pink' },
	{ id: 'cleanup', name: 'Site Cleanup', color: 'teal' }
]
