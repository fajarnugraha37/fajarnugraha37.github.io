import type { Metadata } from "next";
import { SeriesListSection } from "@/components/organisms/SeriesListSection";
import { getAllSeries } from "@/lib/series";

export const metadata: Metadata = {
  title: "Series | Fajar Abdi Nugraha",
  description:
    "Structured learning series covering software engineering, Java, Python, and production-grade thinking.",
};

export default function SeriesPage() {
  const seriesList = getAllSeries();
  return <SeriesListSection seriesList={seriesList} />;
}
