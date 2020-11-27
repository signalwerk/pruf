# pruf

framework agnostic validation library

[![Downloads][downloads-badge]][downloads] ![Lines](https://img.shields.io/badge/Coverage-0%25-brightgreen.svg)

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
  age: 20,
  zip: 500,
};

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

const result = validate(rule, data);
/*
result = {
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
};
*/
```

## Validators

`pruf` comes with some often used validation functions.

| Helper   | Parameters | Description                                                              |
| -------- | ---------- | ------------------------------------------------------------------------ |
| required | –          | Checks if a value is given                                               |
| between  | min, max   | Checks if a number is between min and max. Min and max are not included. |

## Data and rules can be nested

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
