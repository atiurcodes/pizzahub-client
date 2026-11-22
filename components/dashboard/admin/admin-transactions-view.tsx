"use client"

import { useCallback, useEffect, useState } from "react"
import {
  CheckCircle2,
  Copy,
  Crown,
  DollarSign,
  Lock,
  Receipt,
  RotateCcw,
  Search,
  ShieldCheck,
  Store,
} from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import {
  getAdminTransactions,
  type AdminTransactionsResponse,
} from "@/services/admin.service"

export function AdminTransactionsView() {
  const [data, setData] = useState<AdminTransactionsResponse>({
    transactions: [],
    count: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchTransactions = useCallback(async (qSearch: string, qStatus: string) => {
    setIsLoading(true)
    try {
      const res = await getAdminTransactions({
        search: qSearch,
        status: qStatus,
      })
      setData(res)
    } catch (err) {
      console.error("Failed to load transactions:", err)
      toast.add({
        title: "Failed to load transactions",
        description: err instanceof Error ? err.message : "Server error.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(search, statusFilter)
    }, 250)

    return () => clearTimeout(timer)
  }, [search, statusFilter, fetchTransactions])

  function handleCopySessionId(id: string) {
    navigator.clipboard.writeText(id)
    toast.add({
      title: "Copied!",
      description: "Stripe Session ID copied to clipboard.",
      type: "success",
    })
  }

  function handleReset() {
    setSearch("")
    setStatusFilter("all")
  }

  const { transactions, count, totalRevenue } = data

  return (
    <div className="space-y-6">
      {/* 1. Header & Security Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Platform Transactions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Review vendor subscription payments, Stripe checkout sessions, and platform revenue.
          </p>
        </div>

        {/* Read-Only Regulatory Badge */}
        <Badge
          variant="outline"
          className="border-primary/40 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
        >
          <Lock className="size-3.5" />
          <span>Strictly Read-Only (Non-Mutable)</span>
        </Badge>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          subtitle="All-time verified payments"
          icon={DollarSign}
          tone="basil"
        />
        <StatCard
          title="Total Transactions"
          value={count}
          subtitle="Processed subscription checkouts"
          icon={Receipt}
          tone="primary"
        />
        <StatCard
          title="Premium Fee"
          value="$19.99"
          subtitle="Per vendor subscription"
          icon={Crown}
          tone="amber"
        />
        <StatCard
          title="Audit Status"
          value="Verified"
          subtitle="Direct from Stripe webhook & DB"
          icon={ShieldCheck}
          tone="basil"
        />
      </div>

      {/* 3. Filter & Search Bar */}
      <Card className="border-border/70 bg-card/60">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by vendor email, restaurant name, or session ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl text-xs sm:text-sm bg-background border-border/70"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter by payment status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl bg-background border border-border/80 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid / Succeeded</option>
                <option value="failed">Failed / Cancelled</option>
              </select>

              {(search || statusFilter !== "all") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-10 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Transactions Data Table */}
      <Card className="border-border/70 bg-card/60 overflow-hidden shadow-xs">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading text-lg font-bold text-foreground">
                Transaction Ledger
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Showing {transactions.length} record{transactions.length === 1 ? "" : "s"}. Per security policy, transactions are immutable.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold">
              Live MongoDB Data
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 sm:pt-4">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="size-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                <Receipt className="size-7" />
              </div>
              <h4 className="font-heading font-bold text-base text-foreground">
                No Transactions Found
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {search || statusFilter !== "all"
                  ? "No transactions match your current search or filter criteria. Try resetting filters."
                  : "No vendor subscription payments have been recorded yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground">Vendor / Restaurant</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Subscription Plan</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Amount Paid</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Stripe Session ID</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Date & Time</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-right">Audit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const isPaid =
                      (tx.status || "").toLowerCase() === "paid" ||
                      (tx.status || "").toLowerCase() === "complete" ||
                      (tx.status || "").toLowerCase() === "succeeded"

                    const formattedDate = tx.createdAt
                      ? new Date(tx.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"

                    return (
                      <TableRow key={tx._id} className="border-border/50 hover:bg-muted/40 transition-colors">
                        {/* Vendor Info */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                              <Store className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">
                                {tx.businessName || tx.vendorName || "Vendor"}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {tx.vendorEmail}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Plan */}
                        <TableCell className="py-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/30">
                            <Crown className="size-3" />
                            Premium Plan
                          </span>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="py-3">
                          <span className="font-heading font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            ${Number(tx.amount || 19.99).toFixed(2)}{" "}
                            <span className="text-[10px] text-muted-foreground font-normal">
                              {tx.currency || "USD"}
                            </span>
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3">
                          {isPaid ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
                            >
                              <CheckCircle2 className="size-3" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-destructive/40 bg-destructive/10 text-destructive font-semibold text-[11px] px-2 py-0.5 rounded-full w-fit"
                            >
                              {tx.status}
                            </Badge>
                          )}
                        </TableCell>

                        {/* Stripe Session ID */}
                        <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">
                          {tx.stripeSessionId ? (
                            <div className="flex items-center gap-1.5">
                              <span className="truncate max-w-[120px] sm:max-w-[160px]">
                                {tx.stripeSessionId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopySessionId(tx.stripeSessionId)}
                                title="Copy session ID"
                                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                              >
                                <Copy className="size-3" />
                              </button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {formattedDate}
                        </TableCell>

                        {/* Read-Only Status Indicator */}
                        <TableCell className="py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                            <Lock className="size-2.5 text-muted-foreground" />
                            Locked
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
