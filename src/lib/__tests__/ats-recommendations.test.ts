import assert from "node:assert";
import { describe, it } from "node:test";
import { EMPTY_RESUME_DATA } from "../constants";
import { getAtsRecommendations } from "../ats-recommendations";

describe("ats-recommendations", () => {
  it("returns guidance when resume or keywords are missing", () => {
    const result = getAtsRecommendations(null, ["react"]);
    assert.strictEqual(result.coveragePercent, 0);
    assert.ok(result.recommendations.length > 0);
  });

  it("computes coverage and missing keywords", () => {
    const resume = {
      ...EMPTY_RESUME_DATA,
      personalInfo: {
        ...EMPTY_RESUME_DATA.personalInfo,
        summary: "Frontend engineer building React and TypeScript applications",
      },
      skills: [
        { id: "1", category: "Core", items: ["React", "TypeScript"] },
      ],
    };

    const result = getAtsRecommendations(resume, ["react", "typescript", "graphql"]);
    assert.strictEqual(result.coveragePercent, 67);
    assert.ok(result.matchedKeywords.includes("react"));
    assert.ok(result.missingKeywords.includes("graphql"));
  });
});
