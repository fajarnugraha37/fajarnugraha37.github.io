import { SeriesManifestPhase, SeriesOverviewPhase, SeriesPartGroup, SeriesPartSummary } from "@/types";

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

function createOverviewPhase(
  template: Pick<SeriesManifestPhase, "id" | "title" | "subtitle" | "description">,
  parts: SeriesPartSummary[],
): SeriesOverviewPhase {
  const orderedParts = [...parts].sort((left, right) => left.order - right.order);

  return {
    id: template.id,
    title: template.title,
    subtitle: template.subtitle,
    description: template.description,
    fromOrder: orderedParts[0].order,
    toOrder: orderedParts[orderedParts.length - 1].order,
    parts: orderedParts,
    totalParts: orderedParts.length,
    totalReadingTime: orderedParts.reduce((total, part) => total + part.stats.readingTime, 0),
    firstPartSlug: orderedParts[0].slug,
    lastPartSlug: orderedParts[orderedParts.length - 1].slug,
  };
}

function getDefaultPhaseTemplates(totalParts: number) {
  if (totalParts <= 8) {
    return [
      {
        id: "curriculum",
        title: "Curriculum Map",
        subtitle: "A compact learning path from first lesson to finish.",
        description: "Use this as a guided track when you want the full arc without jumping around.",
      },
    ];
  }

  if (totalParts <= 16) {
    return [
      {
        id: "start",
        title: "Start Here",
        subtitle: "Foundations, setup, and early mental models.",
        description: "Start here if you want the minimum context before tackling the heavier lessons.",
      },
      {
        id: "core",
        title: "Build Core",
        subtitle: "The main concepts and working techniques.",
        description: "This middle section carries the core skills, patterns, and practical reps of the track.",
      },
    ];
  }

  if (totalParts <= 28) {
    return [
      {
        id: "start",
        title: "Start Here",
        subtitle: "Foundations, setup, and early mental models.",
        description: "Begin with the conceptual footing and vocabulary that the rest of the track assumes.",
      },
      {
        id: "core",
        title: "Build Core",
        subtitle: "The main concepts and working techniques.",
        description: "This is the center of gravity for the track: core mechanics, repeated patterns, and applied work.",
      },
      {
        id: "deepen",
        title: "Deepen Practice",
        subtitle: "Longer drills, trade-offs, and production judgment.",
        description: "Use this phase to sharpen trade-offs, connect concepts, and move toward real-world execution.",
      },
    ];
  }

  return [
    {
      id: "start",
      title: "Start Here",
      subtitle: "Foundations, setup, and early mental models.",
      description: "Get the fundamentals in place before the pace and complexity increase.",
    },
    {
      id: "core",
      title: "Build Core",
      subtitle: "The main concepts and working techniques.",
      description: "This phase establishes the core working model and the essential day-to-day techniques.",
    },
    {
      id: "deepen",
      title: "Deepen Practice",
      subtitle: "Longer drills, trade-offs, and production judgment.",
      description: "Now the track shifts into deliberate practice, nuance, and operational trade-offs.",
    },
    {
      id: "finish",
      title: "Final Stretch",
      subtitle: "Capstones, operational thinking, and synthesis.",
      description: "Finish with synthesis, capstone-style lessons, and the judgment needed to apply the material well.",
    },
  ];
}

function buildFallbackOverviewPhases(parts: SeriesPartSummary[]) {
  const orderedParts = [...parts].sort((left, right) => left.order - right.order);
  const templates = getDefaultPhaseTemplates(orderedParts.length);
  const counts = distributeParts(orderedParts.length, templates.length);
  const phases: SeriesOverviewPhase[] = [];
  let startIndex = 0;

  for (let index = 0; index < templates.length; index += 1) {
    const count = counts[index];
    const nextParts = orderedParts.slice(startIndex, startIndex + count);
    startIndex += count;

    if (nextParts.length === 0) {
      continue;
    }

    phases.push(createOverviewPhase(templates[index], nextParts));
  }

  return phases;
}

export function buildSeriesOverviewPhases(
  parts: SeriesPartSummary[],
  manifestPhases?: SeriesManifestPhase[],
): SeriesOverviewPhase[] {
  const orderedParts = [...parts].sort((left, right) => left.order - right.order);

  if (!manifestPhases || manifestPhases.length === 0) {
    return buildFallbackOverviewPhases(orderedParts);
  }

  const phases: SeriesOverviewPhase[] = [];
  const assignedPartSlugs = new Set<string>();

  for (const phase of manifestPhases) {
    const phaseParts = orderedParts.filter(
      (part) => part.order >= phase.fromOrder && part.order <= phase.toOrder,
    );

    if (phaseParts.length === 0) {
      continue;
    }

    phaseParts.forEach((part) => assignedPartSlugs.add(part.slug));
    phases.push(createOverviewPhase(phase, phaseParts));
  }

  const remainingParts = orderedParts.filter((part) => !assignedPartSlugs.has(part.slug));
  if (remainingParts.length > 0) {
    phases.push(
      createOverviewPhase(
        {
          id: "ungrouped",
          title: "More Lessons",
          subtitle: "Lessons that are available before the editorial phase map is fully curated.",
          description: "These lessons are still part of the track, but they have not been explicitly grouped in the manifest yet.",
        },
        remainingParts,
      ),
    );
  }

  return phases.length > 0 ? phases : buildFallbackOverviewPhases(orderedParts);
}

export function groupSeriesParts(parts: SeriesPartSummary[]): SeriesPartGroup[] {
  return buildSeriesOverviewPhases(parts).map((phase) => ({
    id: phase.id,
    title: phase.title,
    subtitle: phase.subtitle,
    parts: phase.parts,
  }));
}

export function getSeriesGroupForPart(groups: SeriesPartGroup[], activePartSlug: string) {
  return groups.find((group) => group.parts.some((part) => part.slug === activePartSlug)) || null;
}
