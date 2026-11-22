import { redirect } from "next/navigation"

export default function PaymentCancelPage() {
  redirect("/dashboard/vendor/subscription/cancel")
}
