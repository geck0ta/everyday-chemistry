"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  /** label untuk error message — opsional */
  label?: string;
  /** tombol retry: reset key state */
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, ctx: unknown) {
    // log ke console; di production kamu bisa kirim ke sentry/error endpoint
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary:", error, ctx);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-[#d14d6b]" />
        <h3 className="text-sm font-medium">
          {this.props.label ?? "Terjadi kesalahan"} saat memproses {this.props.label ?? "halaman ini"}.
        </h3>
        <p className="text-xs text-[var(--muted)]">
          {this.state.error?.message ?? "Silakan muat ulang."}
        </p>
        {this.props.onRetry && (
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onRetry?.();
            }}
            className="flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white"
          >
            <RefreshCw size={13} strokeWidth={1.75} />
            Coba lagi
          </button>
        )}
      </div>
    );
  }
}
