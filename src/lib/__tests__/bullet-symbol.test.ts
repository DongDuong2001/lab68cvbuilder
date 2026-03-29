import assert from "node:assert";
import { describe, it } from "node:test";
import { getResumeBulletSymbol } from "../bullet-symbol";
import { EMPTY_RESUME_DATA } from "../constants";

describe("bullet-symbol", () => {
  it("uses fallback when no symbol is provided", () => {
    const data = {
      ...EMPTY_RESUME_DATA,
      personalInfo: {
        ...EMPTY_RESUME_DATA.personalInfo,
        bulletSymbol: "",
      },
    };

    assert.strictEqual(getResumeBulletSymbol(data, "•"), "•");
  });

  it("trims and limits bullet symbol to 3 characters", () => {
    const data = {
      ...EMPTY_RESUME_DATA,
      personalInfo: {
        ...EMPTY_RESUME_DATA.personalInfo,
        bulletSymbol: "  abcdef  ",
      },
    };

    assert.strictEqual(getResumeBulletSymbol(data, "•"), "abc");
  });
});
