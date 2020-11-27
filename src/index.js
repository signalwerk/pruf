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

const isFunction = (obj) => {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

const traverse = (ruleObj, dataObj, options) => {
  // set prefs
  let { root, level, validKey, parent } = options || {};
  parent = parent || {};
  root = root || {};
  level = level || 0;
  validKey = validKey || "valid";

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
        let validObj = traverse(ruleObj[rule], dataObj[rule] || {}, {
          ...options,
          parent: {
            rule,
            dataObj,
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

  return { result, globalValid };
};

export const validate = (ruleObj, dataObj, options) => {
  return traverse(ruleObj, dataObj, options).result;
};
