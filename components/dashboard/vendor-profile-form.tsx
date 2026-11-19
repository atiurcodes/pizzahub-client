"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Crown,
  Lock,
  Mail,
  ShieldCheck,
  Store,
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

interface VendorProfileFormProps {
  initialUser: DashboardUser
}

export function VendorProfileForm({ initialUser }: VendorProfileFormProps) {
  const router = useRouter()

  // Form states
  const [name, setName] = useState(initialUser.name || "")
  const [businessName, setBusinessName] = useState(initialUser.businessName || "")
  const [image, setImage] = useState(initialUser.image || "")
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Compute initials for the avatar fallback
  const initials = (name || initialUser.name || "V")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  // Validate form fields
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters."
    }

    if (!businessName.trim() || businessName.trim().length < 2) {
      newErrors.businessName =
        "Restaurant / Business name is required for vendor accounts."
    }

    if (image.trim() && !/^https?:\/\//i.test(image.trim())) {
      newErrors.image = "Please enter a valid image URL starting with http:// or https://"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSaving(true)

    try {
      // Better Auth updateUser updates name, image, and custom fields like businessName
      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
        businessName: businessName.trim(),
      })

      if (result.error) {
        toast.add({
          title: "Update Failed",
          description:
            result.error.message || "Failed to update profile. Please try again.",
          type: "error",
        })
        return
      }

      toast.add({
        title: "Profile Saved!",
        description: "Your restaurant details have been updated successfully.",
        type: "success",
      })

      // Refresh server components so sidebar and dashboard header reflect changes immediately
      router.refresh()
    } catch (err) {
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isPremium = initialUser.subscriptionPlan === "premium"

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left 2 Columns: Editable Restaurant Information */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit}>
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <Store className="size-5 text-primary" />
                <CardTitle className="text-lg">Restaurant & Profile Details</CardTitle>
              </div>
              <CardDescription>
                Update your public shop name, contact information, and avatar
                appearance.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Avatar Live Preview & URL */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
                <Avatar className="size-20 ring-2 ring-primary/20 shrink-0">
                  <AvatarImage
                    src={image.trim() || undefined}
                    alt={businessName || name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-heading text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 w-full space-y-1.5">
                  <Label htmlFor="image" className="text-xs font-medium text-foreground">
                    Profile Avatar / Restaurant Logo URL
                  </Label>
                  <Input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://i.ibb.co/... or https://..."
                    className={errors.image ? "border-destructive ring-destructive/20" : ""}
                  />
                  {errors.image ? (
                    <p className="text-xs text-destructive">{errors.image}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Paste a direct image link (e.g. from ImgBB). Leave empty for initial initials.
                    </p>
                  )}
                </div>
              </div>

              {/* Restaurant / Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-1.5">
                  <Building2 className="size-4 text-primary" />
                  <span>Restaurant / Shop Name</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Bella Napoli Wood-Fired Pizza"
                  className={
                    errors.businessName ? "border-destructive ring-destructive/20" : ""
                  }
                />
                {errors.businessName ? (
                  <p className="text-xs text-destructive">{errors.businessName}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This is the public brand name displayed on your menu items and customer receipts.
                  </p>
                )}
              </div>

              {/* Vendor Contact Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="size-4 text-primary" />
                  <span>Owner / Contact Name</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mario Rossi"
                  className={errors.name ? "border-destructive ring-destructive/20" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-32"
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Right Column: Account & Security Overview (Read-Only) */}
      <div className="space-y-6">
        {/* Subscription Plan Card */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown
                  className={`size-4 ${
                    isPremium ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                  }`}
                />
                <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
              </div>
              <Badge
                variant={isPremium ? "default" : "secondary"}
                className={
                  isPremium
                    ? "bg-amber-500 text-white font-semibold"
                    : "text-muted-foreground"
                }
              >
                {isPremium ? "Premium" : "Free Plan"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-xs">
            <div className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isPremium
                  ? "Unlimited active menu items & featured homepage placement"
                  : "Up to 3 active menu items on the public menu"}
              </span>
            </div>

            {!isPremium && (
              <div className="pt-2">
                <Link
                  href="/dashboard/vendor/subscription"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "w-full text-xs border-primary/30 text-primary hover:bg-primary/10 justify-between",
                  })}
                >
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Credentials & Role */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs">
            {/* Account Role */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account Role</span>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Vendor
              </Badge>
            </div>

            {/* Account Status */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Active</span>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="size-3" />
                  <span>Login Email</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                  <Lock className="size-2.5" />
                  <span>Locked</span>
                </span>
              </div>
              <Input
                value={initialUser.email}
                disabled
                className="h-8 text-xs bg-muted/50 cursor-not-allowed text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground">
                Primary email used for sign-in and notifications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
