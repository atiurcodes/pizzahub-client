"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  ImagePlus,
  Loader2,
  MapPin,
  Pizza,
  Sparkles,
  Upload,
  UtensilsCrossed,
  X,
} from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { PlanLimitBanner } from "@/components/dashboard/vendor/plan-limit-banner"
import type { DashboardUser } from "@/lib/auth-guard"
import { createMenuItem, getVendorSubscriptionStatus, uploadImage } from "@/services/api"
import { PIZZA_CATEGORIES, type PizzaCategory } from "@/types"

interface AddMenuItemFormProps {
  user: DashboardUser
}

export function AddMenuItemForm({ user }: AddMenuItemFormProps) {
  const router = useRouter()

  // Form fields state
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState<PizzaCategory>("Classic Pizzas")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState(user.businessName || "")
  const [description, setDescription] = useState("")

  // Image file & preview state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string>("")

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Live Plan & Menu Limit states from backend
  const [liveIsPremium, setLiveIsPremium] = useState<boolean>(
    user.subscriptionPlan === "premium"
  )
  const [activeItemCount, setActiveItemCount] = useState<number | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  // Fetch real-time subscription status & item count directly from backend
  useEffect(() => {
    getVendorSubscriptionStatus()
      .then((status) => {
        setLiveIsPremium(status.isPremium)
        setActiveItemCount(status.activeItemCount)
      })
      .catch((err) => {
        console.error("Error checking subscription status from backend:", err)
      })
      .finally(() => setIsLoadingStatus(false))
  }, [])

  // If premium: unlimited menu uploads (isLimitReached is ALWAYS false!)
  // If free: max 3 active items allowed
  const isLimitReached =
    !liveIsPremium && activeItemCount !== null && activeItemCount >= 3

  // Handle local image file selection for live preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setSelectedFileName(file.name)
      const localUrl = URL.createObjectURL(file)
      setPreviewUrl(localUrl)
    }
  }

  // Remove selected preview
  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl(null)
    setSelectedFileName("")
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Enforce plan limit before submitting
    if (isLimitReached) {
      toast.add({
        title: "Plan Limit Reached",
        description:
          "Free plan limit of 3 items reached. Please upgrade to Premium.",
        type: "error",
      })
      return
    }

    // Step A: Client-side input validation
    if (!itemName.trim() || itemName.trim().length < 3) {
      toast.add({
        title: "Validation Error",
        description: "Please enter a valid item name (at least 3 characters).",
        type: "error",
      })
      return
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.add({
        title: "Validation Error",
        description: "Please enter a valid price greater than $0.",
        type: "error",
      })
      return
    }

    if (!location.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Please specify the restaurant area or branch location.",
        type: "error",
      })
      return
    }

    if (!description.trim() || description.trim().length < 10) {
      toast.add({
        title: "Validation Error",
        description: "Description should be at least 10 characters long.",
        type: "error",
      })
      return
    }

    if (!imageFile) {
      toast.add({
        title: "Image Required",
        description: "Please select an appetizing pizza image to upload.",
        type: "error",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Step B: Upload image to ImgBB using the centralized service
      const uploadedImageUrl = await uploadImage(imageFile)

      // Step C: Send item data to Express Backend (/api/menu) using the centralized service
      await createMenuItem({
        itemName: itemName.trim(),
        category,
        price: parsedPrice,
        location: location.trim(),
        description: description.trim(),
        images: [uploadedImageUrl],
        vendorEmail: user.email, // sole vendor identifier
      })

      // Step D: Show success toast and redirect to My Menu Items page
      toast.add({
        title: "Menu Item Submitted!",
        description: "Your pizza is submitted and is pending admin approval.",
        type: "success",
      })

      router.push("/dashboard/vendor/menu-items")
    } catch (err) {
      toast.add({
        title: "Submission Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to submit menu item. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Modular Plan Limit Banner Component */}
      <PlanLimitBanner
        isPremium={liveIsPremium}
        activeItemCount={activeItemCount}
      />

      {/* Main Add Item Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Item Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="size-5 text-primary" />
                <CardTitle className="text-lg">Item Information</CardTitle>
              </div>
              <CardDescription>
                Provide accurate details and an appetizing description for your pizza.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="itemName" className="flex items-center gap-1.5">
                  <Pizza className="size-4 text-primary" />
                  <span>Item Name</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Wood-Fired Margherita Special"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Give your item a clear, attractive name that customers can easily recognize.
                </p>
              </div>

              {/* Category & Price Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-1.5">
                    <Sparkles className="size-4 text-primary" />
                    <span>Category</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PizzaCategory)}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                    required
                  >
                    {PIZZA_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-background text-foreground">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Select the exact category this item belongs to.
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1.5">
                    <DollarSign className="size-4 text-primary" />
                    <span>Price (USD / $)</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0.5"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="14.99"
                      className="pl-7"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set a competitive retail price for this item.
                  </p>
                </div>
              </div>

              {/* Restaurant Location / Area */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" />
                  <span>Restaurant Location / Area</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka or Gulshan Branch"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Area or neighborhood where this pizza is baked and dispatched from.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-4 text-primary" />
                    <span>Description & Ingredients</span>
                    <span className="text-destructive">*</span>
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {description.length}/500
                  </span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  placeholder="San Marzano tomato sauce, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil, baked on slow-fermented crust."
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Describe key toppings, crust style, flavor profile, and portion details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Image Upload & Review Information */}
        <div className="space-y-6">
          {/* Item Image Upload Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImagePlus className="size-4 text-primary" />
                  <CardTitle className="text-sm font-medium">Item Image</CardTitle>
                </div>
                <Badge variant="outline" className="text-[11px] border-primary/30 text-primary">
                  Required
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Preview Area */}
              {previewUrl ? (
                <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-border group bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Menu item preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 size-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                    title="Remove image"
                  >
                    <X className="size-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-1 rounded-md truncate">
                    {selectedFileName}
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center aspect-4/3 rounded-xl border-2 border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer p-6 text-center group"
                >
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="size-5" />
                  </div>
                  <span className="font-medium text-xs text-foreground mt-3">
                    Click or drag image here
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-1">
                    JPG, PNG, or WebP (Max 5MB)
                  </span>
                  <span className="text-[10px] text-primary/80 mt-2 font-medium">
                    Auto-hosted on ImgBB
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              )}

              <p className="text-[11px] text-muted-foreground">
                High-quality photos increase customer orders. Use a clear, well-lit shot of your pizza.
              </p>
            </CardContent>
          </Card>

          {/* Submission Notice Card */}
          <Card className="border-border/60 shadow-sm bg-muted/20">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-amber-500" />
                <CardTitle className="text-sm font-medium">Status: Pending Review</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Newly submitted items start in <strong className="text-foreground">Pending</strong> status.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  An Admin reviews food photos and pricing before approving for the public menu.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="space-y-2 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || isLimitReached || isLoadingStatus}
              className={`w-full font-semibold h-9 ${isLimitReached
                ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  <span>Submitting Menu Item...</span>
                </>
              ) : isLimitReached ? (
                <span>Free Plan Limit Reached (3/3)</span>
              ) : (
                <span>Submit Menu Item</span>
              )}
            </Button>

            {isLimitReached && (
              <p className="text-[11px] text-destructive text-center">
                Upgrade to Premium or delete an existing item to add more pizzas.
              </p>
            )}

            <Link
              href="/dashboard/vendor/menu-items"
              className={buttonVariants({
                variant: "outline",
                className: "w-full text-xs text-muted-foreground hover:text-foreground h-8",
              })}
            >
              <ArrowLeft className="size-3.5 mr-1" />
              <span>Back to My Menu Items</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
