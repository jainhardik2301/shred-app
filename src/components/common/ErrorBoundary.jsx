import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error(error);
    console.error(info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

          <div className="max-w-lg rounded-2xl border border-red-500 bg-slate-900 p-10 text-center">

            <h1 className="text-3xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-4 text-slate-400">
              An unexpected error occurred.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 font-semibold transition hover:bg-emerald-600"
            >
              Reload Application
            </button>

          </div>

        </div>
      );
    }

    return this.props.children;
  }
}