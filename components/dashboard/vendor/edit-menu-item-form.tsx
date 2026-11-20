"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
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
import { updateMenuItem, uploadImage, type MenuItem } from "@/services/api"
import { PIZZA_CATEGORIES, type PizzaCategory } from "@/types"

interface EditMenuItemFormProps {
  item: MenuItem
}

export function EditMenuItemForm({ item }: EditMenuItemFormProps) {
  const router = useRouter()

  // Pre-fill form state with existing item data
  const [itemName, setItemName] = useState(item.itemName || "")
  const [category, setCategory] = useState<PizzaCategory>(
    (item.category as PizzaCategory) || "Classic Pizzas"
  )
  const [price, setPrice] = useState(item.price ? item.price.toString() : "")
  const [location, setLocation] = useState(item.location || "")
  const [description, setDescription] = useState(item.description || "")

  // Existing image vs new uploaded image
  const existingImage = item.images?.[0] || ""
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(existingImage)
  const [selectedFileName, setSelectedFileName] = useState<string>("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle new image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
      setSelectedFileName(file.name)
      const localUrl = URL.createObjectURL(file)
      setPreviewUrl(localUrl)
    }
  }

  // Reset to original image if user cancels selected new file
  const handleResetImage = () => {
    setNewImageFile(null)
    setSelectedFileName("")
    setPreviewUrl(existingImage)
  }

  // Handle Update Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validation
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

    setIsSubmitting(true)

    try {
      // 2. Determine final image URL: upload new file if selected, otherwise keep existing
      let finalImageUrl = existingImage

      if (newImageFile) {
        finalImageUrl = await uploadImage(newImageFile)
      }

      // 3. Call backend PATCH API
      await updateMenuItem(item._id, {
        itemName: itemName.trim(),
        category,
        price: parsedPrice,
        location: location.trim(),
        description: description.trim(),
        images: [finalImageUrl],
      })

      toast.add({
        title: "Item Updated!",
        description: "Menu item has been updated and submitted for re-review.",
        type: "success",
      })

      // Redirect back to My Menu Items list
      router.push("/dashboard/vendor/menu-items")
      router.refresh()
    } catch (err) {
      toast.add({
        title: "Update Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to update menu item. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Left Column (2 Cols): Editable Information */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="size-5 text-primary" />
              <CardTitle className="text-lg">Edit Item Details</CardTitle>
            </div>
            <CardDescription>
              Modify name, price, toppings, or details for this menu item.
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
            </div>

            {/* Category & Price Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Category */}
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
                    <option
                      key={cat}
                      value={cat}
                      className="bg-background text-foreground"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
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
              </div>
            </div>

            {/* Restaurant Location */}
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
                placeholder="e.g. Dhanmondi, Dhaka"
                required
              />
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
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column (1 Col): Image & Action Buttons */}
      <div className="space-y-6">
        {/* Item Image Card */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="border-b border-border/40 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImagePlus className="size-4 text-primary" />
                <CardTitle className="text-sm font-medium">Food Image</CardTitle>
              </div>
              <Badge variant="outline" className="text-[11px] border-primary/30 text-primary">
                {newImageFile ? "New Image Selected" : "Current Image"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Image Preview Box */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-border group bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Item preview"
                className="w-full h-full object-cover"
              />
              {newImageFile && (
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="absolute top-2 right-2 size-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                  title="Revert to original image"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Change Image Button */}
            <label
              htmlFor="edit-file-upload"
              className="flex items-center justify-center gap-2 w-full p-2.5 rounded-lg border border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer text-xs font-medium text-foreground text-center"
            >
              <Upload className="size-4 text-primary" />
              <span>{newImageFile ? "Change Selected Image" : "Upload New Image"}</span>
              <input
                id="edit-file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            {selectedFileName && (
              <p className="text-[11px] text-primary truncate">
                Selected: {selectedFileName}
              </p>
            )}

            <p className="text-[11px] text-muted-foreground">
              Leave unchanged to keep your current photo, or choose a new file to upload to ImgBB.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>

          <Link
            href="/dashboard/vendor/menu-items"
            className={buttonVariants({
              variant: "outline",
              className: "w-full text-xs text-muted-foreground hover:text-foreground h-8",
            })}
          >
            <ArrowLeft className="size-3.5 mr-1" />
            <span>Cancel and Return</span>
          </Link>
        </div>
      </div>
    </form>
  )
}
