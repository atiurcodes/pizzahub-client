"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAdminMenuItems, type MenuItem } from "@/services/api"

export function AdminMenuList() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all menu items from server
  useEffect(() => {
    getAdminMenuItems()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Failed to load menu items:", err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-2">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading menu items...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-sm text-muted-foreground">No menu items found.</p>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 overflow-hidden shadow-xs">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-16">Item</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                {/* Image */}
                <TableCell>
                  <div className="size-12 rounded-md bg-muted overflow-hidden relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1513104890138-7c749659a591"
                      }
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>

                {/* Name */}
                <TableCell className="font-medium text-sm">
                  {item.itemName}
                </TableCell>

                {/* Category */}
                <TableCell className="text-xs text-muted-foreground">
                  {item.category}
                </TableCell>

                {/* Vendor Email */}
                <TableCell className="text-xs text-muted-foreground">
                  {item.vendorEmail}
                </TableCell>

                {/* Price */}
                <TableCell className="text-sm font-semibold">
                  ${Number(item.price).toFixed(2)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant="outline" className="capitalize text-xs">
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
