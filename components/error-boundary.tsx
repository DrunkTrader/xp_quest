"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to a service like Sentry here
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-[200px] flex flex-col items-center justify-center p-6 rounded-md bg-gray-800 border border-gray-700 text-white">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4 text-center">
              An error occurred in this component. Please try refreshing.
            </p>
            <div className="text-sm text-gray-500 mb-4 max-w-full overflow-auto p-2 bg-gray-900 rounded">
              {this.state.error?.message}
            </div>
            <Button onClick={this.resetError} className="bg-cyan-600 hover:bg-cyan-700">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// Export both as default and named export for flexibility
const ErrorBoundary = ErrorBoundaryComponent;
export default ErrorBoundary;
