'use client';

import * as React from 'react';
import { Info, Keyboard, Search, Settings } from 'lucide-react';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { RiBox3Fill } from '@remixicon/react';

export function HelpButton() {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="w-full flex justify-between px-4">
               <h3>More Information</h3>
               <Info className="size-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-57">
            {/* <div className="p-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search for help..." className="pl-8" />
               </div>
            </div> */}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>
               <Keyboard className="mr-2 h-4 w-4" />
               <span>Keyboard shortcuts</span>
               <span className="ml-auto text-xs text-muted-foreground">⌘/</span>
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}

            <DropdownMenuItem asChild>
               <Link href="https://net.centria.fi/hanke/innoter/" target="_blank">
                 
                  <span>Read on Innoter</span>
               </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuLabel>What&apos;s new</DropdownMenuLabel> */}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
