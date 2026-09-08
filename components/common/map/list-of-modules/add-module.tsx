"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod schema based matching your object shape
const logNodeSchema = z.object({
  id: z.string().min(2, "ID is required"),
  name: z.string().min(2, "Name is required"),
  icon: z.string().default("🏗️"),
  joined: z.boolean().default(true),
  color: z.string().default("#FF0000"),
  type: z.literal("Feature").default("Feature"),
  geometry: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z.tuple([z.coerce.number(), z.coerce.number()]), // [lng, lat]
  }),
  properties: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    state: z.string().min(1, "State is required"),
    supplier: z.string().min(1, "Supplier is required"),
    scheduledDate: z.string().min(1, "Date is required"),
    departureLocation: z.string().min(1, "Departure location is required"),
    status: z.enum(["pending", "on_route", "delivered", "delayed"]),
    carbonFootprint: z.coerce.number().min(0),
    transporter: z.string().min(1, "Transporter is required"),
  }),
});

type LogNodeFormValues = z.infer<typeof logNodeSchema>;

interface AddLogisticsNodeProps {
  onSubmit: (data: LogNodeFormValues) => void;
}

export function AddLogisticsNodeButton({ onSubmit }: AddLogisticsNodeProps) {
  const form = useForm<LogNodeFormValues>({
    resolver: zodResolver(logNodeSchema),
    defaultValues: {
      id: "BLOKK",
      name: "Blokk Systems",
      icon: "🏗️",
      joined: true,
      color: "#FF0000",
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [24.9353, 60.1699],
      },
      properties: {
        address: "123 Mannerheimintie",
        city: "Helsinki",
        country: "Finland",
        postalCode: "00100",
        state: "Uusimaa",
        supplier: "NordPanel Oy",
        scheduledDate: "2025-08-14",
        departureLocation: "Hämeenlinna Industrial Park, Finland",
        status: "on_route",
        carbonFootprint: 3.8,
        transporter: "Schenker Finland",
      },
    },
  });

  const handleFormSubmit = (values: LogNodeFormValues) => {
    // Injecting dummy relationships data dynamically if needed on submission
    const finalData = {
      ...values,
      members: [], // Handle members linkage here if state exists
      projects: [], // Handle projects linkage here if state exists
    };
    onSubmit(finalData);
  };

  return (
    <Dialog>
      <DialogTrigger className="w-2/4" asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Module
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Node</DialogTitle>
          <DialogDescription>
            Fill in the logistical details. Prefilled with default Blokk Systems data.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            
            {/* Core Details Row */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Coordinates & Logistics Core */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="geometry.coordinates.0"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="geometry.coordinates.1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="properties.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="on_route">On Route</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground">Address Properties</h4>
              <FormField
                control={form.control}
                name="properties.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="properties.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="properties.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Shipment details */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground">Shipment Details</h4>
              <FormField
                control={form.control}
                name="properties.departureLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Location</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="properties.supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="properties.transporter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transporter</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="properties.scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="properties.carbonFootprint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbon Footprint (tCO2e)</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" className="w-full sm:w-auto">Save Node Data</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}