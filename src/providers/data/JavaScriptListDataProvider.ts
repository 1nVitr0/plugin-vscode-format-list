import JSONLikeListDataProvider from "./JSONLikeListDataProvider";

export default class JavaScriptListDataProvider extends JSONLikeListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)'|\`((?:[^\`\\\\]|\\\\.)*)\``;
  protected parseKeyRegex = `([\\p{Letter}_$][0-9\\p{Letter}_$]*|${this.parseStringRegex})`;
  protected parseValueRegex = `(${this.parseStringRegex}|true|false|null|undefined|NaN|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`;
  protected parseObjectEntriesRegex = `(${this.parseKeyRegex})\\s*:\\s*(${this.parseValueRegex})`;
  protected parseObjectRegex = `\\{\\s*(${this.parseObjectEntriesRegex}\\s*,?\\s*)*\\s*\\}`;
  protected parseArrayRegex = `\\[\\s*(${this.parseValueRegex}\\s*,?\\s*)*\\s*\\]`;
}
