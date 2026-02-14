"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-5">
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
              Something went wrong
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 border border-text-black text-sm font-mono tracking-wider uppercase hover:bg-text-black hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
