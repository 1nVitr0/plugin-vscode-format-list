import JSONLikeListDataProvider from "./JSONLikeListDataProvider";

export default class CListDataProvider extends JSONLikeListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"`;
  protected parseValueRegex = `(${this.parseStringRegex}|true|false|NULL|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`;
  protected parseKeyRegex = `.([a-zA-Z0-9_]+)`;
  protected parseObjectEntriesRegex = `(${this.parseKeyRegex})\\s*=\\s*(${this.parseValueRegex})`;
  protected parseObjectRegex = `\\{\\s*(${this.parseObjectEntriesRegex}\\s*,?\\s*)*\\s*\\}`;
  protected parseArrayRegex = `\\{\\s*(${this.parseValueRegex}\\s*,?\\s*)*\\s*\\}`;
}
