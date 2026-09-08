"use client"
import type { Team } from "@/mock-data/teams"
import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Building2, MapPin, Calendar, Truck, Leaf } from "lucide-react"
import { Command, CommandInput } from "@/components/ui/command"

interface SidebarProps {
    modules: Team[]
    selectedStore: Team | null
    setSelectedStore: Function
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    on_route: {
        label: "On route",
        className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
    },
    delivered: {
        label: "Delivered",
        className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
    },
    ready_for_transportation: {
        label: "Ready",
        className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
    },
    delayed: {
        label: "Delayed",
        className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
    },
    offloaded: {
        label: "Offloaded",
        className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
    },
}

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType
    label: string
    value: string
}) {
    return (
        <div className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <Icon size={13} />
                {label}
            </span>
            <span className="text-xs text-right text-foreground">{value}</span>
        </div>
    )
}

const ListofModules = ({ modules, selectedStore, setSelectedStore }: SidebarProps) => {
    const storeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    useEffect(() => {
        if (selectedStore && storeRefs.current[selectedStore.name]) {
            storeRefs.current[selectedStore.name]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }, [selectedStore])

    return (
        <div className="px-1 no-scroll overflow-auto h-full space-y-3 py-2">
      

            {modules.map((module) => {
                const isSelected = module.name === selectedStore?.name
                const status = STATUS_CONFIG[module.properties.status]

                return (
                    <div
                        key={module.name}
                        ref={(el) => { storeRefs.current[module.name] = el }}
                        onClick={() => setSelectedStore(module)}
                        className="cursor-pointer"
                    >
                        <Card
                            className={`transition-all duration-200 hover:shadow-md ${isSelected
                                    ? "ring-1 ring-black dark:ring-white shadow-sm"
                                    : "hover:bg-muted/30"
                                }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        {/* <span className="text-xl">{module.icon}</span> */}
                                        <div>
                                            <p className="text-sm font-medium leading-tight">{module.name}</p>
                                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{module.id}</p>
                                        </div>
                                    </div>
                                    {status && (
                                        <Badge
                                            variant="outline"
                                            className={`text-[11px] shrink-0 ${status.className}`}
                                        >
                                            {status.label}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <DetailRow icon={Building2} label="Supplier" value={module.properties.supplier} />
                                <DetailRow
                                    icon={MapPin}
                                    label="Departure"
                                    value={module.properties.departureLocation.replace(", Finland", "")}
                                />
                                <DetailRow icon={Calendar} label="Scheduled" value={module.properties.scheduledDate} />
                                <DetailRow icon={Truck} label="Transporter" value={module.properties.transporter} />
                                <DetailRow
                                    icon={Leaf}
                                    label="CO₂"
                                    value={`${module.properties.carbonFootprint} t CO₂e`}
                                />
                            </CardContent>
                        </Card>
                    </div>
                )
            })}

        </div>
    )
}

export default ListofModules