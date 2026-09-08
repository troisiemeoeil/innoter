import { Team, teams } from "@/mock-data/teams";
import MapboxComponent from "./map";
import ListofModules from "./list-of-modules/list-modules";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { AddLogisticsNodeButton } from "./list-of-modules/add-module";
import { Input } from "@/components/ui/input";


export default function MapOverview() {
  const [modules] = useState<Team[]>(teams)
  const [selectedStore, setSelectedStore] = useState<Team | null>(null)
  const handleAddNode = (formData: any) => {
    console.log("Structured Object Received: ", formData);
    // Push data to your state or API route here
  };
  return (
    <div className="flex h-[100vh] w-full">


      <ResizablePanelGroup direction="horizontal">

        {/* Sidebar placeholder */}
        <ResizablePanel defaultSize={50} className="w-1/4 m-4 relative">
          <div className="flex flex-col h-[100vh] w-full">
            <div className="flex gap-1 w-full ">

             <Input placeholder="Search a module..." />
              <AddLogisticsNodeButton  onSubmit={handleAddNode} />
            </div>
            {/* <div className=" text-xl font-bold py-2 px-1 ">
              Modules scheduled: {modules.length}
            </div> */}


            <ListofModules
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              modules={modules} />
          </div>

        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={150} className="w-3/4 h-full ">
          {/* Map container */}
          <MapboxComponent selectedStore={selectedStore} setSelectedStore={setSelectedStore} />

        </ResizablePanel>
      </ResizablePanelGroup>

    </div>
  )
}



