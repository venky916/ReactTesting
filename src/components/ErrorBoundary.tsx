import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="p-6 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
        >
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Something went wrong!
          </h2>
          <p className="text-red-600 mb-4">{this.state.error?.message}</p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  
  if (shouldThrow) {
    throw new Error("International error for testing!");
  }

  return <div>No errors here!</div>;
}
