import Get from "./util/get";
import { required as _required } from "./validator/required";
import { between as _between } from "./validator/between";

export const required = _required;
export const between = _between;

export const reporter = (validator, message) => {
  return (value) => {
    const valid = validator(value);
    return {
      valid,
      ...(!valid && { error: message }),
    };
  };
};

const hasProp = (obj, prop) =>
  !!obj && !!prop && Object.prototype.hasOwnProperty.call(obj, prop);

const isBoolean = (obj) =>
  obj === true || obj === false || toString.call(obj) === "[object Boolean]";

const isFunction = (obj) => {
  return typeof obj === "function";
};

const isValidLike = (value, validKey) => {
  let isValid = false;
  if (isBoolean(value)) {
    isValid = value;
  }

  if (hasProp(value, validKey)) {
    isValid = value[validKey];
  }

  return isValid;
};

const traverse = (ruleObj, dataObj, options) => {
  // set prefs
  let { validKey, parent, visitor, includeKey } = options || {};
  parent = parent || {};
  validKey = validKey || "valid";
  includeKey = includeKey || "include";
  visitor = visitor || {
    isValidator: ({ value }) => isFunction(value),
    validate: ({ validator, data }) => validator(data),
  };

  let result = {
    [validKey]: true,
  };

  for (const [rule] of Object.entries(ruleObj)) {
    if (visitor.isValidator({ value: ruleObj[rule] })) {
      // validate
      const value = visitor.validate({
        validator: ruleObj[rule],
        data: dataObj,
      });

      const isValid = isValidLike(value, validKey);

      result = {
        ...result,
        [validKey]: result[validKey] && isValid,
        [rule]: value,
      };
    } else {
      // handling without includes
      if (!hasProp(ruleObj, includeKey)) {
        let validObj = traverse(ruleObj[rule], dataObj[rule], {
          ...options,
          parent: result,
        });

        result = {
          ...result,
          [rule]: validObj,
          [validKey]: result[validKey] && validObj[validKey],
        };
      } else {
        // handling for includes

        let groupResult = {
          [validKey]: true,
        };
        ruleObj[includeKey].forEach((item) => {
          let validObj = Get(parent, item);

          const isValid = isValidLike(validObj, validKey);

          groupResult = {
            ...groupResult,
            [item]: validObj,
            [validKey]: result[validKey] && isValid,
          };
        });

        result = {
          ...result,
          ...groupResult,
          [validKey]: result[validKey] && groupResult[validKey],
        };
      }
    }
  }

  return result;
};

export const validate = (ruleObj, dataObj, options) => {
  const result = traverse(ruleObj, dataObj, options);

  return result;
};
