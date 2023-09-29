import { FormatterOptions } from "../../types/Formatter";

export const formatCpp: FormatterOptions = {
  simpleList: {
    enclosure: { start: "{", end: "}" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    indentItems: -1,
  },
};
