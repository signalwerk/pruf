import { required } from "./required";

describe("required", () => {
  test("falsy null", async () => {
    expect(required(null)).toEqual(false);
  });

  test("falsy string", async () => {
    expect(required("")).toEqual(false);
  });

  test("falsy number", async () => {
    expect(required(0)).toEqual(true);
  });

  test("false", async () => {
    expect(required(false)).toEqual(true);
  });

  test("true", async () => {
    expect(required(true)).toEqual(true);
  });

  test("truthy string", async () => {
    expect(required("Hello World")).toEqual(true);
  });

  test("truthy number", async () => {
    expect(required(1)).toEqual(true);
    expect(required(-1)).toEqual(true);
  });

  test("falsy array", async () => {
    expect(required([])).toEqual(true);
  });

  test("truthy array", async () => {
    expect(required([1])).toEqual(true);
  });
});
