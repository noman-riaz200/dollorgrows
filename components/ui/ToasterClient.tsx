"use client";

import { Toaster } from "sonner";

export function ToasterClient() {
  return (
    <Toaster
      theme="light"
      position="top-right"
      richColors
      closeButton
    />
  );
}