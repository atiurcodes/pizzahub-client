"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Lock,
  Mail,
  ShieldCheck,
  User,
  Users,
  UtensilsCrossed,
  Receipt,
  Sparkles,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import type { DashboardUser } from "@/lib/auth-guard"
import { cn } from "@/lib/utils"

interface AdminProfileFormProps {
  initialUser: DashboardUser
}

export function AdminProfileForm({ initialUser }: AdminProfileFormProps) {
  const router = useRouter()

  const [name, setName] = useState(initialUser.name || "")
  const [image, setImage] = useState(initialUser.image || "")
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Compute initials for the avatar fallback
  const initials = (name || initialUser.name || "A")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters."
    }

    if (image.trim() && !/^https?:\/\//i.test(image.trim())) {
      newErrors.image = "Please enter a valid image URL starting with http:// or https://"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSaving(true)

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      })

      if (result.error) {
        toast.add({
          title: "Update Failed",
          description:
            result.error.message || "Failed to update profile. Please try again.",
          type: "error",
        })
      } else {
        toast.add({
          title: "Profile Updated",
          description: "Your administrator profile has been updated successfully.",
          type: "success",
        })
        router.refresh()
      }
    } catch {
      toast.add({
        title: "Error",
        description: "An unexpected error occurred while saving profile changes.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Admin Profile Card & System Privileges (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Administrator Badge Card */}
        <Card className="border-border/80 bg-card/70 overflow-hidden shadow-xs">
          <div className="h-20 bg-gradient-to-r from-primary via-orange-500 to-tomato" />
          <CardContent className="px-6 pb-6 pt-0 relative">
            <div className="-mt-10 mb-4 flex justify-between items-end">
              <Avatar className="size-20 border-4 border-card ring-2 ring-primary/20 shadow-md">
                <AvatarImage src={image || undefined} alt={name || "Admin"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Badge className="bg-gradient-to-r from-primary to-tomato text-primary-foreground font-bold text-xs shadow-xs px-3 py-1">
                <ShieldCheck className="size-3.5 mr-1" />
                Super Admin
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-xl text-foreground">
                {name || "Administrator"}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3 text-muted-foreground" />
                {initialUser.email}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-border/60 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[11px] text-muted-foreground block">System Role</span>
                <span className="font-bold text-primary capitalize">{initialUser.role}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[11px] text-muted-foreground block">Account Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Capabilities / Security Contract */}
        <Card className="border-border/80 bg-card/70 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>Platform Permissions</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Your administrator account is granted top-level platform management authority:
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3 text-xs">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-muted/30">
              <Users className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">User Management</p>
                <p className="text-[11px] text-muted-foreground">View all users, search/filter by role, and block/unblock accounts.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-muted/30">
              <UtensilsCrossed className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Menu Moderation</p>
                <p className="text-[11px] text-muted-foreground">Approve, reject, toggle availability, or delete any menu item.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-muted/30">
              <Receipt className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Financial Audit (Read-Only)</p>
                <p className="text-[11px] text-muted-foreground">View verified Stripe transactions and platform revenue without mutation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Editable Profile Settings Form (7 cols) */}
      <div className="lg:col-span-7">
        <Card className="border-border/80 bg-card/70 shadow-xs">
          <CardHeader className="p-6 pb-4 border-b border-border/60">
            <CardTitle className="font-heading text-xl font-bold text-foreground">
              Edit Admin Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Update your administrator display name and profile picture. Security fields are protected against unauthorized changes.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="adminName" className="text-xs font-semibold flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" />
                  <span>Full Name</span>
                </Label>
                <Input
                  id="adminName"
                  type="text"
                  placeholder="Administrator Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                  }}
                  disabled={isSaving}
                  className={cn(
                    "h-11 rounded-xl bg-background text-sm",
                    errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Field 2: Profile Image URL */}
              <div className="space-y-1.5">
                <Label htmlFor="adminImage" className="text-xs font-semibold flex items-center gap-1.5">
                  <span>Profile Image URL</span>
                </Label>
                <Input
                  id="adminImage"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value)
                    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }))
                  }}
                  disabled={isSaving}
                  className={cn(
                    "h-11 rounded-xl bg-background text-sm",
                    errors.image && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                <p className="text-[11px] text-muted-foreground">
                  Paste a direct public image link (e.g., from ImgBB or Unsplash) for your admin avatar.
                </p>
                {errors.image && (
                  <p className="text-xs text-destructive">{errors.image}</p>
                )}
              </div>

              {/* Locked Field: Email (Non-Editable) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="adminEmail" className="text-xs font-semibold flex items-center gap-1.5">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>Admin Email Address</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Lock className="size-2.5" /> Immutable
                  </span>
                </div>
                <Input
                  id="adminEmail"
                  type="email"
                  value={initialUser.email}
                  disabled
                  className="h-11 rounded-xl bg-muted/60 text-muted-foreground text-sm cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground">
                  Admin login email is tied to authentication and cannot be changed here.
                </p>
              </div>

              {/* Locked Field: System Role (Non-Editable) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="adminRole" className="text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-muted-foreground" />
                    <span>Assigned Role</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Lock className="size-2.5" /> Immutable
                  </span>
                </div>
                <Input
                  id="adminRole"
                  type="text"
                  value="Administrator (System Platform Moderator)"
                  disabled
                  className="h-11 rounded-xl bg-muted/60 text-muted-foreground text-sm cursor-not-allowed font-medium"
                />
                <p className="text-[11px] text-muted-foreground">
                  Per security rules, platform roles cannot be mutated by profile updates.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-11 rounded-full px-7 bg-gradient-to-r from-primary to-tomato font-bold text-xs shadow-md shadow-primary/20 hover:opacity-95"
                >
                  {isSaving ? "Saving Changes..." : "Save Profile Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
