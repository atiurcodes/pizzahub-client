"use client"

import { useEffect, useState } from "react"
import {
  Loader2,
  Mail,
  Search,
  Shield,
  Store,
  User as UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAdminUsers } from "@/services/admin.service"
import type { PlatformUser } from "@/types"
import { UserBlockButton } from "./user-block-button"

export function AdminUsersList() {
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<
    "all" | "customer" | "vendor" | "admin"
  >("all")

  // 1. Fetch users from backend with URL query parameters & debounce
  useEffect(() => {
    // Debounce timer (300ms) to avoid sending requests on every keystroke
    const timer = setTimeout(() => {
      setIsLoading(true)
      getAdminUsers({
        role: selectedRole,
        search: searchTerm,
      })
        .then((data) => {
          setUsers(data)
        })
        .catch((err) => {
          console.error("Failed to load users:", err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedRole, searchTerm])

  // 2. Handle Block / Unblock status change from child button
  const handleUserStatusChange = (userId: string, isBlocked: boolean) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === userId ? { ...user, isBlocked } : user))
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar (Sends query to Backend via URLSearchParams) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/60">
        {/* Role Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant={selectedRole === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedRole("all")}
            className="text-xs h-8 font-medium"
          >
            All Users
          </Button>

          <Button
            variant={selectedRole === "customer" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedRole("customer")}
            className="text-xs h-8 font-medium"
          >
            Customers
          </Button>

          <Button
            variant={selectedRole === "vendor" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedRole("vendor")}
            className="text-xs h-8 font-medium"
          >
            Vendors
          </Button>

          <Button
            variant={selectedRole === "admin" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedRole("admin")}
            className="text-xs h-8 font-medium"
          >
            Admins
          </Button>
        </div>

        {/* Live Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          {isLoading ? (
            <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-primary" />
          ) : (
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          )}
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8 bg-muted/30"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-border/60 overflow-hidden shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Loader2 className="size-6 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground">
                        Loading users from database...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-xs text-muted-foreground"
                  >
                    No users found matching your query.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    {/* Avatar & Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border border-border/50">
                          <AvatarImage src={user.image || ""} alt={user.name} />
                          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary uppercase">
                            {user.name?.slice(0, 2) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {user.name}
                          </p>
                          {user.businessName && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Store className="size-3 text-primary" />
                              <span>{user.businessName}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Mail className="size-3.5 text-muted-foreground/70 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>

                    {/* Role Badge */}
                    <TableCell>
                      <UserRoleBadge role={user.role} />
                    </TableCell>

                    {/* Status Badge (Active / Blocked) */}
                    <TableCell>
                      {user.isBlocked ? (
                        <Badge
                          variant="outline"
                          className="bg-destructive/10 text-destructive border-destructive/30 text-xs"
                        >
                          Blocked
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs"
                        >
                          Active
                        </Badge>
                      )}
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        : "—"}
                    </TableCell>

                    {/* Action: Block / Unblock Button (Modular Component) */}
                    <TableCell className="text-right">
                      <UserBlockButton
                        user={user}
                        onStatusChange={handleUserStatusChange}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function UserRoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs gap-1"
      >
        <Shield className="size-3" />
        <span className="capitalize">Admin</span>
      </Badge>
    )
  }

  if (role === "vendor") {
    return (
      <Badge
        variant="outline"
        className="bg-blue-500/10 text-blue-600 border-blue-500/30 text-xs gap-1"
      >
        <Store className="size-3" />
        <span className="capitalize">Vendor</span>
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="bg-muted text-muted-foreground text-xs gap-1"
    >
      <UserIcon className="size-3" />
      <span className="capitalize">Customer</span>
    </Badge>
  )
}
