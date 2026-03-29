import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/application-status";

export type ApplicationSort = "updated_desc" | "updated_asc" | "applied_desc" | "applied_asc";

export type ApplicationFilters = {
  q?: string;
  status?: ApplicationStatus;
  sort?: ApplicationSort;
};

export function normalizeSearchTerm(value: string | undefined): string | undefined {
  const normalized = (value || "").trim();
  return normalized ? normalized : undefined;
}

export function normalizeApplicationSort(value: string | undefined): ApplicationSort {
  switch (value) {
    case "updated_asc":
    case "applied_desc":
    case "applied_asc":
      return value;
    default:
      return "updated_desc";
  }
}

export function normalizeApplicationStatus(
  value: string | undefined
): ApplicationStatus | undefined {
  if (!value) return undefined;
  if (APPLICATION_STATUSES.includes(value as ApplicationStatus)) {
    return value as ApplicationStatus;
  }
  return undefined;
}

export function normalizeCompanyAndTitle(company: string, title: string): string {
  const c = company.trim().toLowerCase().replace(/\s+/g, " ");
  const t = title.trim().toLowerCase().replace(/\s+/g, " ");
  return `${c}::${t}`;
}

export function parseApplicationFiltersFromSearchParams(
  searchParams:
    | Record<string, string | string[] | undefined>
    | URLSearchParams
    | undefined
): ApplicationFilters {
  const read = (key: string): string | undefined => {
    if (!searchParams) return undefined;
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  return {
    q: normalizeSearchTerm(read("q")),
    status: normalizeApplicationStatus(read("status")),
    sort: normalizeApplicationSort(read("sort")),
  };
}
