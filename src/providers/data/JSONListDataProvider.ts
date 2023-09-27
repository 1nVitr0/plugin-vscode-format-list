import JavaScriptListDataProvider from "./JavaScriptListDataProvider";

export default class JSONListDataProvider extends JavaScriptListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"`;
  protected parseKeyRegex = this.parseStringRegex;
  protected parseValueRegex = `(${this.parseStringRegex}|true|false|null|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`;
}
