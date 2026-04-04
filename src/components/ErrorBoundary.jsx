import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      if (typeof this.props.renderError === "function") {
        return this.props.renderError(this.state.error, () =>
          this.setState({ error: null })
        );
      }
      return (
        <div style={{ padding: 16, fontFamily: "monospace" }}>
          <h2>App Crash</h2>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}