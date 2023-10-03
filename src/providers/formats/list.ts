import { FormatterOptions } from "../../types/Formatter";
import { csvParameters } from "./csv";

export const formatTextList: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "${delimiter}",
    enclosure: { start: "${enclosure}", end: "${enclosure}" },
    parameters: csvParameters,
  },
};
