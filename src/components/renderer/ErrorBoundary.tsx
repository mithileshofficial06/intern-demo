import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: string
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="brutal-box-red brutal-shadow-lg p-6">
          <h2 className="text-lg font-black uppercase mb-3">⚠ SOMETHING WENT WRONG</h2>
          <p className="text-sm font-bold font-mono mb-5 opacity-90">{this.state.error}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: '' })}
            className="brutal-btn px-5 py-2.5 text-xs bg-black text-[#ffe600]"
          >
            TRY AGAIN
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
