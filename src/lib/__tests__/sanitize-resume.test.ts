import assert from "node:assert";
import { describe, it } from "node:test";
import { sanitizeResumeData } from "../sanitize-resume";
import { EMPTY_RESUME_DATA } from "../constants";
import type { ResumeData } from "@/db/schema";

describe("Sanitize Resume Data", () => {
  it("strips HTML tags from competitions input to prevent XSS", () => {
    const maliciousData: ResumeData = {
      ...EMPTY_RESUME_DATA,
      competitions: [
        {
          id: "1",
          name: "<script>alert('xss name')</script>Hackathon",
          role: "Developer <img src=x onerror=alert(1)>",
          date: "2026-03",
          location: "<b>San Francisco</b>",
          url: "https://example.com",
          description: "Built the app... <iframe src='http://evil.com'></iframe>",
          highlights: [
            "Highlight 1 <SVG onload=alert(1)>",
            "Highlight <a href='javascript:alert(1)'>Click me</a>",
          ],
        },
      ],
    };

    const sanitized = sanitizeResumeData(maliciousData);
    const comp = sanitized.competitions[0];

    assert.strictEqual(comp.name, "alert('xss name')Hackathon");
    assert.strictEqual(comp.role, "Developer ");
    assert.strictEqual(comp.location, "San Francisco");
    assert.strictEqual(comp.description, "Built the app... ");
    assert.strictEqual(comp.highlights[0], "Highlight 1 ");
    assert.strictEqual(comp.highlights[1], "Highlight Click me");
  });
});
