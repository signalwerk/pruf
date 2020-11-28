import Get from "./util/get";
export const required = (value) => {
  if (value === false) {
    return true;
  }

  return !!value;
};

export const between = (min, max) => (value) => {
  return value > min && value < max;
};

const hasProp = (obj, prop) =>
  !!obj && !!prop && Object.prototype.hasOwnProperty.call(obj, prop);

const isObject = (obj) => {
  return typeof obj === "object" && !!obj;
};

const isBoolean = (obj) =>
  obj === true || obj === false || toString.call(obj) === "[object Boolean]";

const isFunction = (obj) => {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

const traverse = (ruleObj, dataObj, options) => {
  // set prefs
  let { validKey, parent, visitor, includeKey } = options || {};
  parent = parent || {};
  validKey = validKey || "valid";
  includeKey = includeKey || "include";
  // visitor = visitor || {
  //   apply: (item) => {},
  // };

  let result = {
    [validKey]: true,
  };

  for (const rule in ruleObj) {
    if (hasProp(ruleObj, rule)) {
      if (isObject(ruleObj[rule])) {
        // handling without includes
        if (!hasProp(ruleObj, includeKey)) {
          let validObj = traverse(
            ruleObj[rule],
            dataObj[rule],

            {
              ...options,
              parent: {
                rule,
                dataObj,
                result,
              },
            }
          );

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
            let validObj = Get(parent.result, item);

            let isValid = false;
            if (isBoolean(validObj)) {
              isValid = validObj;
            }

            if (hasProp(validObj, validKey)) {
              isValid = validObj[validKey];
            }

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
      } else {
        // validate
        let isValid = !!ruleObj[rule](dataObj);

        result = {
          ...result,
          [validKey]: result[validKey] && isValid,
          [rule]: isValid,
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
