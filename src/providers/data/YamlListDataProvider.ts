import JSONLikeListDataProvider from "./JSONLikeListDataProvider";
import JavaScriptListDataProvider from "./JavaScriptListDataProvider";

export default class YamlListDataProvider extends JSONLikeListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"`;
  protected parseKeyRegex = `([\\p{Letter}_$][0-9\\p{Letter}_$]*|${this.parseStringRegex})`;
  protected parseValueRegex = `(${this.parseStringRegex}|[^\\n\\r]+`;
  protected parseObjectEntriesRegex = `(${this.parseKeyRegex})\\s*:\\s*(${this.parseValueRegex})`;
  protected parseObjectRegex = `\\s*-\\s*(${this.parseObjectEntriesRegex}\\s*\\n\\s*)*`;
  protected parseArrayRegex = `\\s*-\\s*(${this.parseValueRegex}\\s*\\n\\s*)*`;
}
