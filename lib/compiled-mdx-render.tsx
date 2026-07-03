import React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import type { MDXComponents } from "mdx/types";
import type { CompiledMdxCacheEntry } from "@/lib/content-index";

export function renderCompiledMdx(
  cacheEntry: CompiledMdxCacheEntry,
  components: MDXComponents,
) {
  const fullScope = {
    opts: {
      ...jsxRuntime,
      ...jsxDevRuntime,
    },
    frontmatter: cacheEntry.frontmatter,
    ...cacheEntry.scope,
  };
  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);
  const hydrateFn = Reflect.construct(Function, keys.concat(cacheEntry.compiledSource));
  const Content = hydrateFn.apply(hydrateFn, values).default;

  return <Content components={components} />;
}
