import JSONLikeListDataProvider from "./JSONLikeListDataProvider";

export default class PhpListDataProvider extends JSONLikeListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)'`;
  protected parseValueRegex = `(${this.parseStringRegex}|true|false|null|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`;
  protected parseKeyRegex = this.parseValueRegex;
  protected parseObjectEntriesRegex = `(${this.parseKeyRegex})\\s*=>\\s*(${this.parseValueRegex})`;
  protected parseObjectRegex = `\\[\\s*(${this.parseObjectEntriesRegex}\\s*,?\\s*)*\\s*\\]`;
  protected parseArrayRegex = `\\[\\s*(${this.parseValueRegex}\\s*,?\\s*)*\\s*\\]`;
}
