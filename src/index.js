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

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const isObject = (obj) => obj === Object(obj);

const isFunction = (obj) => {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

const traverse = (ruleObj, dataObj, options) => {
  // set prefs
  let { validKey, parent, visitor, includeKey } = options || {};
  parent = parent || {};
  validKey = validKey || "valid";
  includeKey = includeKey || "include";
  visitor = visitor || {
    apply: (item) => {},
  };

  let globalValid = true;

  let result = {
    [validKey]: true,
  };

  for (const rule in ruleObj) {
    if (hasProp(ruleObj, rule)) {
      if (isFunction(ruleObj[rule])) {
        let valid = !!ruleObj[rule](parent.dataObj[parent.rule]);

        if (valid === false) {
          globalValid = false;
        }

        result = {
          ...result,
          [validKey]: result[validKey] && valid,
          [rule]: valid,
        };
      } else {
        if (rule !== includeKey) {
          let validObj = traverse(ruleObj[rule], dataObj[rule] || {}, {
            ...options,
            parent: {
              rule,
              dataObj,
              result,
            },
          });

          if (validObj.globalValid === false) {
            globalValid = false;
          }

          result = {
            ...result,
            [validKey]: result[validKey] && validObj.globalValid,
            [rule]: validObj.result,
          };
        }
      }
    }
  }

  // for includes
  if (ruleObj[includeKey]) {
    let isValid = true;
    ruleObj[includeKey].forEach((item) => {
      let validObj = Get(parent.result, item);
      result[validKey] = result[validKey] && validObj[validKey];
      result[item] = validObj;
    });
  }

  return { result, globalValid };
};

export const validate = (ruleObj, dataObj, options) => {
  return traverse(ruleObj, dataObj, options).result;
};
