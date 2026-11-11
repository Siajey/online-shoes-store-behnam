import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { errorCopy } from "../copy";
import { NotFoundView } from "./not-found-view";

describe("NotFoundView", () => {
  it("عنوان، توضیح و لینک خانه", () => {
    const out = renderToStaticMarkup(<NotFoundView />);
    expect(out).toContain(errorCopy.notFoundTitle);
    expect(out).toContain(errorCopy.notFoundText);
    expect(out).toMatch(/<a[^>]*href="\/"/);
    expect(out).toContain("<h1");
  });
});
