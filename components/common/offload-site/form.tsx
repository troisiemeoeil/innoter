"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useUiStore } from "@/store/offload-form-trigger-store"
import { useOffloadingAreaStore } from "@/store/offload-area-info-store" // adjust to your actual store path
import { teams } from "@/mock-data/teams"

const transporterOptions = Array.from(
    new Set(teams.map((team) => team.properties.transporter).filter(Boolean))
).sort()
function generateAreaId() {
    const prefix = "SITE"
    const randomNumber = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNumber}`
}
function generateTruckId() {
    const prefix = "Site"
    const randomNumber = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNumber}`
}
function generateDropId() {
    const prefix = "DROP"
    const randomNumber = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNumber}`
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
// Left out on purpose:
// - `id` is generated on submit, not entered by the user.
// - `geometry` comes from the Mapbox draw control, not typed in.
// - `scheduledDate`/`startTime`/`endTime` don't map to a field on
//   OffloadingArea itself — they're used to build the area's first
//   ScheduledDrop on submit (see onSubmit below).

const timePattern = /^\d{2}:\d{2}$/

const offloadAreaFormSchema = z
    .object({
        areaId: z
            .string()
            .min(2, "Name must be at least 2 characters.")
            .max(80, "Name must be under 80 characters."),
        status: z.enum(["available", "occupied", "scheduled"]),
        truck: z.string().max(40).optional().or(z.literal("")),
    
        scheduledDate: z.date({ required_error: "Pick a date." }),
        startTime: z.string().regex(timePattern, "Provide a start time."),
        endTime: z.string().regex(timePattern, "Provide an end time."),
        notes: z.string().max(500, "Notes must be under 500 characters.").optional().or(z.literal("")),
    })
    .refine((values) => values.endTime > values.startTime, {
        message: "End time must be after start time.",
        path: ["endTime"],
    })

type OffloadAreaFormValues = z.infer<typeof offloadAreaFormSchema>

const defaultValues: Partial<OffloadAreaFormValues> = {
    areaId: "",
    status: "available",
    truck: "",
    scheduledDate: undefined,
    startTime: "",
    endTime: "",
    notes: "",
}

export function OffloadForm() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { isDrawerOpen, setDrawerOpen } = useUiStore()
    
    const setPendingGeometry = useUiStore(
      (state) => state.setPendingGeometry
    )

    function handleOpenChange(open: boolean) {
        setDrawerOpen(open)
        if (!open) setPendingGeometry(null)
    }

    if (isDesktop) {
        return (
            <Dialog open={isDrawerOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>New offloading area</DialogTitle>
                        <DialogDescription>
                            Set the details for this area. The boundary comes from the shape you drew on
                            the map.
                        </DialogDescription>
                    </DialogHeader>
                    <OffloadAreaForm onDone={() => handleOpenChange(false)} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isDrawerOpen} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>New offloading area</DrawerTitle>
                    <DrawerDescription>
                        Set the details for this area. The boundary comes from the shape you drew on the
                        map.
                    </DrawerDescription>
                </DrawerHeader>
                <OffloadAreaForm onDone={() => handleOpenChange(false)} className="p-4" />
            </DrawerContent>
        </Drawer>
    )
}

interface OffloadAreaFormComponentProps extends React.ComponentProps<"form"> {
    onDone: () => void
}

function OffloadAreaForm({ onDone, className }: OffloadAreaFormComponentProps) {
    const addArea = useOffloadingAreaStore((state) => state.addArea)
    const { pendingGeometry, setPendingGeometry } = useUiStore()

    const {
        register,
        handleSubmit,
        control,
        setError,
        reset,
        setValue,
        formState: { errors },
    } = useForm<OffloadAreaFormValues>({
        resolver: zodResolver(offloadAreaFormSchema),
        defaultValues,
    })

    React.useEffect(() => {
        const generatedId = generateAreaId()
        setValue("areaId", generatedId, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        })
    }, [setValue])

    function onSubmit(values: OffloadAreaFormValues) {
        // if (!pendingGeometry) {
        //     setError("root", {
        //         message: "Draw the area boundary on the map before saving.",
        //     })
        //     return
        // }

        const areaId = values.areaId?.trim() || generateAreaId()
        const truckId = values.truck?.trim() || generateTruckId()
        const dateLabel = format(values.scheduledDate, "yyyy-MM-dd")
        if (!pendingGeometry) {
            setError("root", {
                message: "Draw the area boundary on the map before saving.",
            })
            return
        }
        addArea({
            id: areaId,
            geometry: pendingGeometry ,
            name: areaId,
            status: values.status,
            truck: values.truck,
            scheduledDrops: [
                {
                    id: generateDropId(),
                    truck: truckId,
                    time: `${dateLabel} ${values.startTime}-${values.endTime}`,
                    notes: values.notes || undefined,
                },
            ],
            notes: values.notes || undefined,
        })

        reset({ ...defaultValues, areaId: generateAreaId() })
        setPendingGeometry(null)
        
        onDone()
    }

    return (
        <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-3">
                <Label htmlFor="areaId">Area ID</Label>
                <Input id="areaId" disabled readOnly {...register("areaId")} />
                {errors.areaId && <p className="text-sm font-medium text-destructive">{errors.areaId.message}</p>}
            </div>

            <div className="grid gap-3">
                <Label htmlFor="status">Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="occupied">Occupied</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.status && <p className="text-sm font-medium text-destructive">{errors.status.message}</p>}
            </div>

            <div className="grid gap-3">
                <Label htmlFor="truck">Transporters</Label>
                <Controller
                    name="truck"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="truck">
                                <SelectValue placeholder="Select a transporter provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {transporterOptions.map((transporter) => (
                                    <SelectItem key={transporter} value={transporter}>
                                        {transporter}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div className="grid gap-3">
                <Label htmlFor="scheduledDate">Date</Label>
                <Controller
                    name="scheduledDate"
                    control={control}
                    render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="scheduledDate"
                                    variant="outline"
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.scheduledDate && (
                    <p className="text-sm font-medium text-destructive">{errors.scheduledDate.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="startTime">Start time</Label>
                    <Input id="startTime" type="time" {...register("startTime")} />
                    {errors.startTime && (
                        <p className="text-sm font-medium text-destructive">{errors.startTime.message}</p>
                    )}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="endTime">End time</Label>
                    <Input id="endTime" type="time" {...register("endTime")} />
                    {errors.endTime && (
                        <p className="text-sm font-medium text-destructive">{errors.endTime.message}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-3">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional details..." className="resize-none" {...register("notes")} />
                {errors.notes && <p className="text-sm font-medium text-destructive">{errors.notes.message}</p>}
            </div>

            {errors.root && <p className="text-sm font-medium text-destructive">{errors.root.message}</p>}

            <Button type="submit">Save area</Button>
        </form>
    )
}