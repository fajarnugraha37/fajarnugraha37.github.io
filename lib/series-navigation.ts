import { SeriesPartGroup, SeriesPartSummary } from "@/types";

function distributeParts(total: number, groupCount: number) {
  const weights =
    groupCount === 2
      ? [0.38, 0.62]
      : groupCount === 3
        ? [0.24, 0.46, 0.3]
        : [0.18, 0.36, 0.28, 0.18];

  const counts = weights.map((weight) => Math.max(1, Math.round(total * weight)));
  const sum = counts.reduce((accumulator, count) => accumulator + count, 0);
  const diff = total - sum;

  if (diff !== 0) {
    const direction = diff > 0 ? 1 : -1;
    let remaining = Math.abs(diff);
    let index = diff > 0 ? 0 : counts.length - 1;

    while (remaining > 0) {
      if (direction > 0 || counts[index] > 1) {
        counts[index] += direction;
        remaining -= 1;
      }

      index = direction > 0 ? (index + 1) % counts.length : (index - 1 + counts.length) % counts.length;
    }
  }

  return counts;
}

export function groupSeriesParts(parts: SeriesPartSummary[]): SeriesPartGroup[] {
  const orderedParts = [...parts].sort((left, right) => left.order - right.order);
  const totalParts = orderedParts.length;

  if (totalParts <= 8) {
    return [
      {
        id: "curriculum",
        title: "Curriculum Map",
        subtitle: "A compact learning path from first lesson to finish.",
        parts: orderedParts,
      },
    ];
  }

  const templates =
    totalParts <= 16
      ? [
          {
            id: "start",
            title: "Start Here",
            subtitle: "Foundations, setup, and early mental models.",
          },
          {
            id: "core",
            title: "Build Core",
            subtitle: "The main concepts and working techniques.",
          },
        ]
      : totalParts <= 28
        ? [
            {
              id: "start",
              title: "Start Here",
              subtitle: "Foundations, setup, and early mental models.",
            },
            {
              id: "core",
              title: "Build Core",
              subtitle: "The main concepts and working techniques.",
            },
            {
              id: "deepen",
              title: "Deepen Practice",
              subtitle: "Longer drills, trade-offs, and production judgment.",
            },
          ]
        : [
            {
              id: "start",
              title: "Start Here",
              subtitle: "Foundations, setup, and early mental models.",
            },
            {
              id: "core",
              title: "Build Core",
              subtitle: "The main concepts and working techniques.",
            },
            {
              id: "deepen",
              title: "Deepen Practice",
              subtitle: "Longer drills, trade-offs, and production judgment.",
            },
            {
              id: "finish",
              title: "Final Stretch",
              subtitle: "Capstones, operational thinking, and synthesis.",
            },
          ];

  const counts = distributeParts(totalParts, templates.length);
  const groups: SeriesPartGroup[] = [];
  let startIndex = 0;

  for (let index = 0; index < templates.length; index += 1) {
    const count = counts[index];
    const nextParts = orderedParts.slice(startIndex, startIndex + count);
    startIndex += count;

    if (nextParts.length === 0) {
      continue;
    }

    groups.push({
      ...templates[index],
      parts: nextParts,
    });
  }

  return groups;
}

export function getSeriesGroupForPart(groups: SeriesPartGroup[], activePartSlug: string) {
  return groups.find((group) => group.parts.some((part) => part.slug === activePartSlug)) || null;
}
