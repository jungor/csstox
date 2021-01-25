import postcss from "postcss";
import postcssJs from "postcss-js";
import transform from "css-to-react-native";

const toJSSObject = (cssText) => {
  const root = postcss.parse(cssText);
  return postcssJs.objectify(root);
};

export const toJSS = (cssText) => {
  try {
    return JSON.stringify(toJSSObject(cssText), null, 2);
  } catch (e) {
    return "Error translating CSS to JSS";
  }
};

const isNumber = (val) => typeof val === "number";

const format = (key, val) => {
  val = val.endsWith("px") ? val.split("px")[0] / 2 + "px" : val;
  if (key === "fontFamily") {
    if (/Medium/i.test(val)) {
      key = "fontWeight";
      val = "500";
    } else if (/Semi-?Bold/i.test(val)) {
      key = "fontWeight";
      val = "600";
    } else if (/Bold/i.test(val)) {
      key = "fontWeight";
      val = "700";
    } else {
      return null;
    }
  }
  return [key, val];
};

export const toRN = (cssText) => {
  try {
    const output = toJSSObject(cssText);
    const result = Object.keys(output)
      .map((rules) => format(rules, output[rules]))
      .filter((x) => x !== null);
    return JSON.stringify(transform(result), null, 2);
  } catch (e) {
    return "Error translating CSS to RN";
  }
};
