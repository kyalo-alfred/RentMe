import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  locations: string[]
  priceRange: [number, number]
  selectedLocation: string | null
  onPriceChange: (range: [number, number]) => void
  onLocationChange: (location: string | null) => void
  onClearFilters: () => void
}

export function AppSidebar({
  locations,
  priceRange,
  selectedLocation,
  onPriceChange,
  onLocationChange,
  onClearFilters,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <div className="px-6 py-5">
      </div>
      <SidebarContent className="px-4 py-6">
        {/* Price Range Filter */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Price Range</SidebarGroupLabel>
          <SidebarGroupContent>
            <Slider
              defaultValue={[0, 100000]}
              value={priceRange}
              onValueChange={onPriceChange}
              min={0}
              max={200000}
              step={5}
              className="mb-4"
            />
            <div className="flex gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              <span className="font-semibold">KSH {priceRange[0].toLocaleString()}</span>
              <span className="text-gray-400">—</span>
              <span className="font-semibold">KSH {priceRange[1].toLocaleString()}</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Location Filter */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Location</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-64">
              <ul className="space-y-2">
                {locations.map((location) => (
                  <li key={location}>
                    <button
                      onClick={() =>
                        onLocationChange(
                          selectedLocation === location ? null : location
                        )
                      }
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all font-medium ${selectedLocation === location
                        ? "bg-amber-400 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {location}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Clear Filters Button */}
        <SidebarGroup className="mt-4">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </SidebarGroup>

        {/* List Your Item Button */}
        <SidebarGroup className="mt-4 pt-4">
          <button className="w-full px-4 py-3 bg-amber-400 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-500 transition-colors shadow-sm">
            List Your Item
          </button>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
