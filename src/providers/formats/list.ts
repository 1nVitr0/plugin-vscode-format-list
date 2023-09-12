import { FormatterOptions } from "../../types/Formatter";

export const formatCommaSeparatedList: FormatterOptions = { pretty: 0, indent: 0, simpleList: { delimiter: "," } };
export const formatTabSeparatedList: FormatterOptions = { pretty: 0, indent: 0, simpleList: { delimiter: "\t" } };
export const formatSpaceSeparatedList: FormatterOptions = { pretty: 0, indent: 0, simpleList: { delimiter: " " } };
export const formatNewLineSeparatedList: FormatterOptions = { pretty: 0, indent: 0, simpleList: { delimiter: "\n" } };

export const formatEnclosedCommaSeparatedList: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: { delimiter: ",", valueEnclosure: { string: '"' } },
};
export const formatEnclosedTabSeparatedList: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: { delimiter: "\t", valueEnclosure: { string: '"' } },
};
export const formatEnclosedSpaceSeparatedList: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: { delimiter: " ", valueEnclosure: { string: '"' } },
};
