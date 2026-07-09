"use client";

import React, { useEffect, useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface CodeBlockProps {
  code: string;
  className?: string;
  [key: string]: any;
}

export const CodeBlock = ({
  code,
  className,
  ...props
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const [mounted, setMounted] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error("Clipboard API not available");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isExpanded]);

  const decreaseFontSize = () => {
    setFontSize((current) => Math.max(11, current - 1));
  };

  const increaseFontSize = () => {
    setFontSize((current) => Math.min(20, current + 1));
  };

  const preClassName = cn(
    "overflow-x-auto rounded-md border border-border/20 bg-muted p-4 transition-all",
    wrapLines ? "whitespace-pre-wrap break-words" : "whitespace-pre",
    className,
  );

  const toolbar = (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md border border-border bg-background/85 p-1 shadow-md backdrop-blur-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
      <Button
        variant="neutral"
        size="icon-sm"
        onClick={() => setIsExpanded(true)}
        aria-label="Open focus view"
        className="backdrop-blur-sm shadow-none text-[10px]"
      >
        ⛶
      </Button>
      <Button
        variant={wrapLines ? "default" : "neutral"}
        size="xs"
        onClick={() => setWrapLines((value) => !value)}
        aria-label="Toggle wrap lines"
        className="px-2 tracking-[0.12em]"
      >
        Wrap
      </Button>
      <Button
        variant="neutral"
        size="xs"
        onClick={decreaseFontSize}
        aria-label="Decrease code font size"
        className="px-2 tracking-[0.12em]"
      >
        A-
      </Button>
      <Button
        variant="neutral"
        size="xs"
        onClick={increaseFontSize}
        aria-label="Increase code font size"
        className="px-2 tracking-[0.12em]"
      >
        A+
      </Button>
      <Button
        variant="neutral"
        size="icon-sm"
        onClick={handleCopy}
        aria-label="Copy code"
        className="backdrop-blur-sm shadow-none"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  const expandedModal = mounted && isExpanded
    ? createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-3 backdrop-blur-xl md:p-6"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-accent/20 bg-background shadow-[0_24px_80px_rgba(0,0,0,0.4)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 bg-background/90 px-4 py-3 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                <span className="text-accent">Focus Code View</span>
                <span>/</span>
                <span>{wrapLines ? "Wrapped" : "No wrap"}</span>
                <span>/</span>
                <span>{fontSize}px</span>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  variant={wrapLines ? "default" : "neutral"}
                  size="xs"
                  onClick={() => setWrapLines((value) => !value)}
                  aria-label="Toggle wrap lines"
                  className="px-2 tracking-[0.12em]"
                >
                  Wrap
                </Button>
                <Button
                  variant="neutral"
                  size="xs"
                  onClick={decreaseFontSize}
                  aria-label="Decrease code font size"
                  className="px-2 tracking-[0.12em]"
                >
                  A-
                </Button>
                <Button
                  variant="neutral"
                  size="xs"
                  onClick={increaseFontSize}
                  aria-label="Increase code font size"
                  className="px-2 tracking-[0.12em]"
                >
                  A+
                </Button>
                <Button
                  variant="neutral"
                  size="icon-sm"
                  onClick={handleCopy}
                  aria-label="Copy code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="neutral"
                  size="icon-sm"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close focus view"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-3 md:p-5">
              <pre
                className={cn(
                  "min-h-full rounded-xl border border-border/20 bg-muted/90 p-4 md:p-6",
                  wrapLines ? "whitespace-pre-wrap break-words" : "whitespace-pre",
                  className,
                )}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.75 }}
              >
                <code className={className}>{code}</code>
              </pre>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="relative group my-4">
        {toolbar}
        <pre
          className={preClassName}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
          {...props}
        >
          <code className={className}>{code}</code>
        </pre>
      </div>
      {expandedModal}
    </>
  );
};
