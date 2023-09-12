import { WorkspaceConfiguration } from "vscode";
import { CustomFormatters, Indent, Pretty } from "./Formatter";

export interface ExtensionConfiguration extends WorkspaceConfiguration {
  additionalFormats: CustomFormatters;
  prettyPrint: Pretty;
}