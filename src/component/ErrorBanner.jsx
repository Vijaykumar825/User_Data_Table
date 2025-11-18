import React from "react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="error">{message}</div>;
}
