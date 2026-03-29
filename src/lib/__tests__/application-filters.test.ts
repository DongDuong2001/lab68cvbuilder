import assert from "node:assert";
import { describe, it } from "node:test";
import {
  normalizeApplicationSort,
  normalizeApplicationStatus,
  normalizeCompanyAndTitle,
  parseApplicationFiltersFromSearchParams,
} from "../application-filters";

describe("application-filters", () => {
  it("normalizes supported sort values and defaults unknown values", () => {
    assert.strictEqual(normalizeApplicationSort("updated_asc"), "updated_asc");
    assert.strictEqual(normalizeApplicationSort("applied_desc"), "applied_desc");
    assert.strictEqual(normalizeApplicationSort("unknown"), "updated_desc");
    assert.strictEqual(normalizeApplicationSort(undefined), "updated_desc");
  });

  it("normalizes status values", () => {
    assert.strictEqual(normalizeApplicationStatus("wishlist"), "wishlist");
    assert.strictEqual(normalizeApplicationStatus("applied"), "applied");
    assert.strictEqual(normalizeApplicationStatus("invalid"), undefined);
  });

  it("normalizes company/title for duplicate checks", () => {
    const a = normalizeCompanyAndTitle("  ACME   Inc ", " Senior Engineer ");
    const b = normalizeCompanyAndTitle("acme inc", "senior engineer");
    assert.strictEqual(a, b);
  });

  it("parses query filters from URLSearchParams", () => {
    const params = new URLSearchParams([
      ["q", "  frontend "],
      ["status", "interview"],
      ["sort", "applied_asc"],
    ]);

    const result = parseApplicationFiltersFromSearchParams(params);
    assert.deepStrictEqual(result, {
      q: "frontend",
      status: "interview",
      sort: "applied_asc",
    });
  });
});
