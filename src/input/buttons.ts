import { QuickInputButton, ThemeIcon, Uri } from "vscode";
import ListFormatProvider from "../providers/formats/ListFormatProvider";

export class ObjectListButton implements QuickInputButton {
  public readonly iconPath: Uri | { light: Uri; dark: Uri } | ThemeIcon;
  public readonly tooltip: string;

  constructor() {
    this.iconPath = new ThemeIcon("symbol-object");
    this.tooltip = "Format list as object list instead";
  }
}

export class SimpleListButton implements QuickInputButton {
  public readonly iconPath: Uri | { light: Uri; dark: Uri } | ThemeIcon;
  public readonly tooltip: string;

  constructor() {
    this.iconPath = new ThemeIcon("symbol-array");
    this.tooltip = "Format list as simple list instead";
  }
}

export class TogglePrettyButton implements QuickInputButton {
  public readonly iconPath: Uri | { light: Uri; dark: Uri } | ThemeIcon;
  public readonly tooltip: string;

  constructor(public readonly pretty: boolean) {
    this.iconPath = new ThemeIcon(pretty ? "eye" : "eye-closed");
    this.tooltip = `Toggle pretty formatting ${pretty ? "on" : "off"}`;
  }
}

export class ChangeDataProviderButton implements QuickInputButton {
  public readonly iconPath: Uri | { light: Uri; dark: Uri } | ThemeIcon;
  public readonly tooltip: string;

  constructor() {
    this.iconPath = new ThemeIcon("files");
    this.tooltip = "Change data provider";
  }
}

export type ListFormattingButton = ObjectListButton | SimpleListButton | TogglePrettyButton | ChangeDataProviderButton; 