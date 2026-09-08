import React, { useState } from 'react'
import MapboxComponent from '../map/map'
import { Team } from '@/mock-data/teams'
import { OffloadForm } from './form'

export default function OffloadSite() {
    const [selectedStore, setSelectedStore] = useState<Team | null>(null)

    return (
        <div className="w-full relative h-full">
     
            <MapboxComponent selectedStore={selectedStore} setSelectedStore={setSelectedStore} />

            <OffloadForm />

        </div>
    )
}
