import React from 'react'
import SingleAction from './singleAction'
import { status } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';

export default function ListofActions() {
    const { issues } = useIssuesStore();
    
    const inProgressStatus = status.find(s => s.id === 'in-progress');
    const inProgressIssues = issues.filter(issue => issue.status.id === 'in-progress');
    if (!inProgressStatus) return null;

    return (
        <div className="w-full h-full overflow-y-auto mt-2  rounded-2xl">
            <SingleAction
                key={inProgressStatus.id}
                status={inProgressStatus}
                issues={inProgressIssues}
                count={inProgressIssues.length}
            />
        </div>
    )
}