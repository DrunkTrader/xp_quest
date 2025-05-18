import Dashboard from "@/components/dashboard"
import ErrorBoundary from "@/components/error-boundary"

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  )
}
