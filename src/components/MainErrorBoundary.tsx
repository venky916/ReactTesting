import { Component,type  ReactNode, type ErrorInfo } from "react";
import { toast } from "react-toastify"; // or your toast library

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level: "app" | "page" | "component";
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MainErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 1. Log to console (development)
    console.error("Error caught by boundary:", error, errorInfo);

    // 2. Send to error tracking service (production)
    if (process.env.NODE_ENV === "production") {
      // Sentry, LogRocket, etc.
      // Sentry.captureException(error);
    }

    // 3. Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 4. Show toast notification (optional)
    if (this.props.level === "component") {
      toast.error("Something went wrong in this section");
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback based on level
      return this.renderFallback();
    }

    return this.props.children;
  }

  renderFallback() {
    const { level } = this.props;
    const { error } = this.state;

    // App level - Full screen error
    if (level === "app") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Application Error
            </h1>
            <p className="text-gray-600 mb-4">
              The application encountered an unexpected error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    // Page level - Page error
    if (level === "page") {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Page Error</h2>
          <p className="text-gray-600 mb-4">This page encountered an error.</p>
          <div className="space-x-4">
            <button
              onClick={this.resetError}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    // Component level - Inline error
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-sm text-red-600">
          This section is temporarily unavailable.
        </p>
        <button
          onClick={this.resetError}
          className="text-sm text-blue-600 hover:underline mt-2"
        >
          Retry
        </button>
      </div>
    );
  }
}
