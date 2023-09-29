import { FormatterOptions } from "../../types/Formatter";

export const formatJava: FormatterOptions = {
  simpleList: {
    enclosure: { start: "{", end: "}" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    indentItems: -1,
  },
};
