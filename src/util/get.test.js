import Get from "./get";

const data = {
  a: {
    b: {
      c: {
        d: 1,
        e: [2, 3, 4],
      },
    },
  },
};

describe("Get", () => {
  test("with dot notation", async () => {
    expect(Get(data, "a.b.c.d")).toEqual(1);
  });

  test("with array notation", async () => {
    expect(Get(data, "a.b.c.e[1]")).toEqual(3);
  });

  test("with wrong path", async () => {
    expect(Get(data, "a.b.c.z")).toEqual(undefined);
  });

  test("with no path", async () => {
    expect(Get(data)).toEqual(undefined);
  });

  test("with no object", async () => {
    expect(Get(5, "a.b.c.e[1]")).toEqual(undefined);
  });

  test("with no object but falsy", async () => {
    expect(Get(false, "a.b.c.e[1]")).toEqual(undefined);
  });
});
