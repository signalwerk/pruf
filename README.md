# pruf

framework agnostic validation library

![npm](https://img.shields.io/npm/v/pruf) ![NPM](https://img.shields.io/npm/l/pruf) ![Lines](https://img.shields.io/badge/Coverage-97.67%25-brightgreen.svg)

## Installation

```sh
npm i --save pruf
```

## Use

Import `validate` to validate objects by a set of rules

```js
import { validate, required, between } from "pruf";

const data = {
  name: "",
  data: { age: 14 },
  zip: 500,
};

const rule = {
  name: {
    required,
  },
  data: {
    age: {
      required,
      over16: (value) => value > 16,
    },
  },
  zip: {
    required,
    between: between(999, 10000),
  },
};

const result = validate(rule, data);
```

the validation results in a new object with `valid`-keys corresponding to the validations done.

```js
const result = {
  valid: false,
  name: {
    valid: false,
    required: false,
  },
  data: {
    valid: false,
    age: {
      valid: false,
      required: true,
      over16: false,
    },
  },
  zip: {
    valid: false,
    required: true,
    between: false,
  },
};
```

## `validate()`

Pruf provides you a simple way to validate data by a set if rules.

With `validate(rule, data, options?)` you validate an object `data` by a set of rules provided in a `rule` object. With an `options` object you can control some additional behaviour.

### `rule`

The validation follows this set of rules. If a value in the `rule` object is a `function` this will be used as the validator for the corresponding `data`.  
The `return` will have the same structure as the rule.

```js
const rule = {
  name: {
    required,
  },
  data: {
    age: {
      required,
      over16: (value) => value > 16,
    },
  },
  zip: {
    required,
    between: between(999, 10000),
  },
};
```

### `data`

Any kind of object. Including deeply nested objects.

```js
const data = {
  name: "",
  data: { age: 14 },
  zip: 500,
};
```

### `options`

#### `validKey`

`string?` — default: `valid`  
The name of the key generated during validation.

#### `includeKey`

`string?` — default: `include`
The name of the key to detect groups during validation.

### `return`

The result of the function returns a new object where each object will have a `valid`-key with the result of the validation of the values and sub-values. Each validator will leave a key in the object.

```js
const result = {
  valid: false,
  name: {
    valid: false,
    required: false,
  },
  data: {
    valid: false,
    age: {
      valid: false,
      required: true,
      over16: false,
    },
  },
  zip: {
    valid: false,
    required: true,
    between: false,
  },
};
```

## Validators

`pruf` comes with some often used validation functions.

| Helper   | Parameters | Description                                                              |
| -------- | ---------- | ------------------------------------------------------------------------ |
| required | –          | Checks if a value is given                                               |
| between  | min, max   | Checks if a number is between min and max. Min and max are not included. |

## Custom validators

Custom validations can be defined by adding simple functions:

```js
const isPruf = (value) => value === "pruf";
```

The validation can then be used like all other checks:

```js
const rule = {
  dataYeah: { required, isPruf },
  dataNo: { required, isPruf },
};
```

## Grouping

Sometimes it's useful to have validations grouped. This can be achieved if the key `include` is set with an array of include paths.

```js
const rule = {
  name: {
    firsName: {
      required,
    },
  },
  age: {
    required,
  },
  person: {
    include: ["name.firsName", "age"], // ← 💫 includes
  },
};
```

```js
const result = {
  valid: false,
  name: {
    valid: false,
    firsName: {
      valid: true,
      required: true,
    },
  },
  age: {
    valid: false,
    required: false,
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
};
```

## Credits

`pruf` is inspred by projects like [vuelidate](https://vuelidate.js.org/), [formik](https://formik.org/) and many others.

## License & Authors

[MIT](https://opensource.org/licenses/mit) · Started by [signalwerk](https://github.com/signalwerk) supported by [contributors](https://github.com/signalwerk/pruf/graphs/contributors)
