"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Clock,
  HeartHandshake,
  Lock,
  Mail,
  Pizza,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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

interface CustomerProfileFormProps {
  initialUser: DashboardUser
}

export function CustomerProfileForm({ initialUser }: CustomerProfileFormProps) {
  const router = useRouter()

  const [name, setName] = useState(initialUser.name || "")
  const [image, setImage] = useState(initialUser.image || "")
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Compute initials for the avatar fallback
  const initials = (name || initialUser.name || "C")
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
          description: "Your customer profile has been updated successfully.",
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
      {/* Left Column: Customer Profile Card & Account Details (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Customer Badge Card */}
        <Card className="border-border/80 bg-card/70 overflow-hidden shadow-xs">
          <div className="h-20 bg-gradient-to-r from-primary via-orange-500 to-tomato" />
          <CardContent className="px-6 pb-6 pt-0 relative">
            <div className="-mt-10 mb-4 flex justify-between items-end">
              <Avatar className="size-20 border-4 border-card ring-2 ring-primary/20 shadow-md">
                <AvatarImage src={image || undefined} alt={name || "Customer"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Badge className="bg-gradient-to-r from-primary to-tomato text-primary-foreground font-bold text-xs shadow-xs px-3 py-1">
                <Pizza className="size-3.5 mr-1" />
                Customer
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-xl text-foreground">
                {name || "Pizza Lover"}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3 text-muted-foreground" />
                {initialUser.email}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-border/60 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[11px] text-muted-foreground block">Account Role</span>
                <span className="font-bold text-primary capitalize">{initialUser.role}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[11px] text-muted-foreground block">Account Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Perks & Order History Shortcut */}
        <Card className="border-border/80 bg-card/70 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>Customer Experience</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Your PizzaHub customer membership includes:
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3 text-xs">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-muted/30">
              <Pizza className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Hot & Fresh Pizza Ordering</p>
                <p className="text-[11px] text-muted-foreground">Direct orders from verified artisanal pizzerias and top local restaurants.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-muted/30">
              <Clock className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Live Order Status Timeline</p>
                <p className="text-[11px] text-muted-foreground">Track order baking progress from pending to accepted in real time.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-muted/30">
              <HeartHandshake className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Customer Protection</p>
                <p className="text-[11px] text-muted-foreground">Cancel pending orders anytime before restaurant confirmation.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard/customer/orders"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full rounded-xl font-semibold text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
                )}
              >
                <ShoppingBag className="size-3.5" />
                <span>View My Orders History</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Editable Profile Settings Form (7 cols) */}
      <div className="lg:col-span-7">
        <Card className="border-border/80 bg-card/70 shadow-xs">
          <CardHeader className="p-6 pb-4 border-b border-border/60">
            <CardTitle className="font-heading text-xl font-bold text-foreground">
              Edit Profile Information
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Update your display name and profile picture. Security fields are protected against unauthorized changes.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name (Editable) */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" />
                  Full Name <span className="text-primary">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className={cn(
                    "rounded-xl border-border/70 bg-background text-sm",
                    errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isSaving}
                />
                {errors.name && (
                  <p className="text-xs text-destructive font-medium">{errors.name}</p>
                )}
              </div>

              {/* Profile Image URL (Editable, Optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="image" className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" />
                    Profile Picture URL
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
                </Label>
                <Input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className={cn(
                    "rounded-xl border-border/70 bg-background text-sm",
                    errors.image && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isSaving}
                />
                {errors.image ? (
                  <p className="text-xs text-destructive font-medium">{errors.image}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Enter a direct public image link (ImgBB, Unsplash, Gravatar, etc.).
                  </p>
                )}
              </div>

              {/* Read-Only: Email Address (Protected) */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  Email Address
                  <Badge variant="outline" className="ml-auto text-[10px] font-medium border-border/70 text-muted-foreground gap-1 py-0 px-1.5">
                    <Lock className="size-2.5" />
                    Read-Only
                  </Badge>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={initialUser.email}
                  disabled
                  className="rounded-xl border-border/50 bg-muted/40 text-muted-foreground text-sm cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground">
                  Your email is linked to your login credentials and cannot be changed here.
                </p>
              </div>

              {/* Read-Only: Role & Account Status (Protected) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-muted-foreground" />
                    Account Role
                    <Badge variant="outline" className="ml-auto text-[10px] font-medium border-border/70 text-muted-foreground gap-1 py-0 px-1.5">
                      <Lock className="size-2.5" />
                      Locked
                    </Badge>
                  </Label>
                  <Input
                    type="text"
                    value="Customer"
                    disabled
                    className="rounded-xl border-border/50 bg-muted/40 text-muted-foreground text-sm cursor-not-allowed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Role is assigned at registration and cannot be modified.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    Account Standing
                  </Label>
                  <Input
                    type="text"
                    value={initialUser.isBlocked ? "Blocked" : "Active (Good Standing)"}
                    disabled
                    className="rounded-xl border-border/50 bg-muted/40 text-muted-foreground text-sm cursor-not-allowed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Platform status verified by security policy.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setName(initialUser.name || "")
                    setImage(initialUser.image || "")
                    setErrors({})
                  }}
                  disabled={isSaving}
                  className="rounded-full text-xs font-semibold h-10 px-5"
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full font-bold text-xs h-10 px-6 bg-gradient-to-r from-primary to-tomato shadow-md shadow-primary/20 text-white"
                >
                  {isSaving ? "Saving..." : "Save Profile Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
