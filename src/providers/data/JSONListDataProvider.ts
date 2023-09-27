import JSONLikeListDataProvider from "./JSONLikeListDataProvider";
import JavaScriptListDataProvider from "./JavaScriptListDataProvider";

export default class JSONListDataProvider extends JSONLikeListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"`;
  protected parseKeyRegex = this.parseStringRegex;
  protected parseValueRegex = `(${this.parseStringRegex}|true|false|null|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`;
  protected parseObjectEntriesRegex = `(${this.parseKeyRegex})\\s*:\\s*(${this.parseValueRegex})`;
  protected parseObjectRegex = `\\{\\s*(${this.parseObjectEntriesRegex}\\s*,?\\s*)*\\s*\\}`;
  protected parseArrayRegex = `\\[\\s*(${this.parseValueRegex}\\s*,?\\s*)*\\s*\\]`;
}
