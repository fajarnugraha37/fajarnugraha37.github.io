import { Metadata } from "next";
import { DuckDbLabRoute } from "@/components/organisms/DuckDbLabRoute";

export const metadata: Metadata = {
  title: "DuckDB Lab | Fajar Abdi Nugraha",
  description: "High-performance OLAP engine for big data analysis exploration in the browser.",
};

/**
 * DuckDB Laboratory Page
 * Features a WASM-based analytical engine for processing CSV, Parquet, and JSON datasets.
 */
export default function DuckDBLab() {
  return <DuckDbLabRoute />;
}
