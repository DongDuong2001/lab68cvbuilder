import assert from "node:assert";
import { describe, it } from "node:test";
import { EMPTY_RESUME_DATA } from "../constants";
import { getPublicResumeData } from "../public-resume";

describe("public-resume", () => {
  it("masks private contact fields when toggles are disabled", () => {
    const input = {
      ...EMPTY_RESUME_DATA,
      personalInfo: {
        ...EMPTY_RESUME_DATA.personalInfo,
        email: "a@example.com",
        phone: "123",
        location: "Hanoi",
        shareEmail: false,
        sharePhone: false,
        shareLocation: false,
      },
    };

    const output = getPublicResumeData(input);
    assert.strictEqual(output.personalInfo.email, "");
    assert.strictEqual(output.personalInfo.phone, "");
    assert.strictEqual(output.personalInfo.location, "");
  });

  it("keeps contact fields when toggles are enabled", () => {
    const input = {
      ...EMPTY_RESUME_DATA,
      personalInfo: {
        ...EMPTY_RESUME_DATA.personalInfo,
        email: "a@example.com",
        phone: "123",
        location: "Hanoi",
        shareEmail: true,
        sharePhone: true,
        shareLocation: true,
      },
    };

    const output = getPublicResumeData(input);
    assert.strictEqual(output.personalInfo.email, "a@example.com");
    assert.strictEqual(output.personalInfo.phone, "123");
    assert.strictEqual(output.personalInfo.location, "Hanoi");
  });
});
