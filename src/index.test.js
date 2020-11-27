/* globals test describe  expect */
import { validate, required, between } from ".";

describe("validate with grouping", () => {
  test("simple validation", async () => {
    const rule = {
      name: {
        firsName: {
          required,
        },
        familyName: {
          required,
        },
      },
      age: {
        required,
      },
      zip: {
        required,
        between: between(999, 10000),
      },
      person: {
        include: ["name.firsName", "age"],
      },
    };

    const data = {
      name: {
        firsName: "Jane",
        familyName: "",
      },
      age: null,
      zip: 500,
    };

    expect(validate(rule, data)).toEqual({
      valid: false,
      name: {
        valid: false,
        firsName: {
          valid: true,
          required: true,
        },
        familyName: {
          valid: false,
          required: false,
        },
      },
      age: {
        valid: false,
        required: false,
      },
      zip: {
        valid: false,
        required: true,
        between: false,
      },

      person: {
        valid: false,
        "name.firsName": {
          valid: true,
          required: true,
        },
        age: {
          valid: false,
          required: false,
        },
      },
    });
  });
});

describe("validate with custom inline function", () => {
  test("require in simple obj", async () => {
    const rule = {
      myData: { isPruf: (value) => value === "pruf" },
    };
    const data = {
      myData: "prufpruf",
    };

    expect(validate(rule, data)).toEqual({
      valid: false,
      myData: {
        valid: false,
        isPruf: false,
      },
    });
  });
});

describe("validate with custom function", () => {
  test("require in simple obj", async () => {
    const isPruf = (value) => value === "pruf";
    const containsPruf = (value) =>
      String.prototype.includes.call(value, "pruf");

    const rule = {
      dataYeah: { containsPruf },
      dataNo: { isPruf, containsPruf },
    };
    const data = {
      dataYeah: "prufpruf",
      dataNo: "prufpruf",
    };

    expect(validate(rule, data)).toEqual({
      valid: false,
      dataYeah: {
        valid: true,
        containsPruf: true,
      },
      dataNo: {
        valid: false,
        isPruf: false,
        containsPruf: true,
      },
    });
  });
});

describe("validate", () => {
  test("require in simple obj", async () => {
    const rule = {
      name: {
        required,
      },
    };
    const data = {
      name: "",
    };

    expect(validate(rule, data)).toEqual({
      valid: false,
      name: {
        valid: false,
        required: false,
      },
    });
  });

  test("require in simple obj with custom key", async () => {
    const rule = {
      name: {
        required,
      },
    };
    const data = {
      name: "",
    };

    expect(validate(rule, data, { validKey: "$valid" })).toEqual({
      $valid: false,
      name: {
        $valid: false,
        required: false,
      },
    });
  });

  test("multiple checks in simple obj", async () => {
    const rule = {
      zip: {
        required,
        between: between(999, 10000),
      },
    };
    const data = {
      zip: null,
    };

    expect(validate(rule, data)).toEqual({
      valid: false,
      zip: {
        valid: false,
        required: false,
        between: false,
      },
    });
  });

  test("multiple mixed checks in simple obj", async () => {
    const rule = {
      zip: {
        required,
        between: between(999, 10000),
      },
    };
    const data = {
      zip: 800,
    };

    expect(validate(rule, data)).toEqual({
      valid: false,
      zip: {
        valid: false,
        required: true,
        between: false,
      },
    });
  });

  test("multiple valid checks in simple obj", async () => {
    const rule = {
      zip: {
        required,
        between: between(999, 10000),
      },
    };
    const data = {
      zip: 8000,
    };

    expect(validate(rule, data)).toEqual({
      valid: true,
      zip: {
        valid: true,
        required: true,
        between: true,
      },
    });
  });

  test("multiple require in simple obj", async () => {
    const rule = {
      name: {
        required,
      },
      age: {
        required,
      },
      zip: {
        required,
        between: between(999, 10000),
      },
    };
    const data = {
      name: "",
      age: 20,
      zip: 500,
    };

    expect(validate(rule, data)).toEqual({
      valid: false,
      name: {
        valid: false,
        required: false,
      },
      age: {
        valid: true,
        required: true,
      },
      zip: {
        valid: false,
        required: true,
        between: false,
      },
    });
  });

  test("require in nested obj", async () => {
    const rule = {
      data: {
        name: {
          required,
        },
      },
    };
    const data = {
      data: { name: "" },
    };
    expect(validate(rule, data)).toEqual({
      valid: false,
      data: {
        valid: false,
        name: {
          valid: false,
          required: false,
        },
      },
    });
  });
  test("multiple checks in nested obj", async () => {
    const rule = {
      data: {
        name: {
          required,
        },
        work: {
          zip: {
            required,
            between: between(999, 10000),
          },
        },
        home: {
          zip: {
            required,
            between: between(999, 10000),
          },
        },
      },
    };
    const data = {
      data: {
        name: "",
        work: { zip: 8000 },
        home: { zip: 10 },
      },
    };
    expect(validate(rule, data)).toEqual({
      valid: false,
      data: {
        valid: false,
        name: {
          valid: false,
          required: false,
        },

        work: {
          valid: true,
          zip: {
            valid: true,
            required: true,
            between: true,
          },
        },

        home: {
          valid: false,
          zip: {
            valid: false,
            required: true,
            between: false,
          },
        },
      },
    });
  });
});
