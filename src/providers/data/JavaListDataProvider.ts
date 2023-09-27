import JSONLikeListDataProvider from "./JSONLikeListDataProvider";

export default class JavaListDataProvider extends JSONLikeListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"`;
  protected parseValueRegex = `(${this.parseStringRegex}|true|false|NULL|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`;
  protected parseObjectEntriesRegex = null;
  protected parseObjectRegex = null;
  protected parseArrayRegex = `\\{\\s*(${this.parseValueRegex}\\s*,?\\s*)*\\s*\\}`;
}
