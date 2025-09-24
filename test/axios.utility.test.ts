import { it, describe, expect } from "@jest/globals";
import { buildUrl } from "../src/axios.utility";

describe("Build URL function", () => {
  const baseUrl = "https://localhost:3000/";

  it("Should build url with number params", async () => {
    const url = buildUrl(`${baseUrl}:id`, { id: 123 });
    expect(url).toEqual(`${baseUrl}123`);
  });

  it("Should build url with string params", async () => {
    const url = buildUrl(`${baseUrl}:id`, { id: "123" });
    expect(url).toEqual(`${baseUrl}123`);
  });
});
