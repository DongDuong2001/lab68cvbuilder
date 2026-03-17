"use server";

import {
  getForgProductOptions as getForgProductOptionsFromImport,
  importFromForg as importFromForgFromImport,
} from "@/actions/import";

export async function getForgProductOptions(forgInput: string) {
  return getForgProductOptionsFromImport(forgInput);
}

export async function importFromForg(forgInput: string, preferredProductId?: string) {
  return importFromForgFromImport(forgInput, preferredProductId);
}
