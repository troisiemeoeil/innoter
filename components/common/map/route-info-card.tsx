import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"

interface RouteInfoCardProps {
    distanceMeters: number
    durationSeconds: number
    moduleName: string
}

function formatDistance(meters: number): { value: string; unit: string } {
    const km = meters / 1000
    return km >= 10
        ? { value: Math.round(km).toString(), unit: "km" }
        : { value: km.toFixed(1), unit: "km" }
}

function formatDuration(seconds: number): { value: string; unit: string } {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)

    if (hours === 0) return { value: minutes.toString(), unit: "min" }
    if (minutes === 0) return { value: hours.toString(), unit: "hr" }
    return { value: `${hours}h ${minutes}`, unit: "min" }
}

export function RouteInfoCard({ distanceMeters, durationSeconds, moduleName }: RouteInfoCardProps) {
    const distance = formatDistance(distanceMeters)
    const duration = formatDuration(durationSeconds)

    return (
        <Card className="w-full shadow-md">
            <CardContent className="pt-4 pb-5 px-5">
                <p className="text-[11px] text-muted-foreground normal-case tracking-widest mb-4 ">
                    Route Info for {moduleName}
                </p>

                <div className="flex items-stretch gap-4">
                    {/* Distance */}
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-5xl font-semibold leading-none tracking-tight tabular-nums">
                                {distance.value}
                            </span>
                            <span className="text-lg text-muted-foreground font-normal">{distance.unit}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin size={13} />
                            <span className="text-xs">Distance</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-border self-stretch" />

                    {/* Duration */}
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-5xl font-semibold leading-none tracking-tight tabular-nums">
                                {duration.value}
                            </span>
                            <span className="text-lg text-muted-foreground font-normal">{duration.unit}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock size={13} />
                            <span className="text-xs">Drive time</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}