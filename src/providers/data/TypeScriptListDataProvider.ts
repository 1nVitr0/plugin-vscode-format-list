import JavaScriptListDataProvider from "./JavaScriptListDataProvider";

export default class TypeScriptListDataProvider extends JavaScriptListDataProvider {
  protected typeAnnotationRegex = `as\\s+(?:(?:${this.parseKeyRegex}(?:<(?:${this.parseKeyRegex}\\s*,?\\s*)*>)?)\\s*\\|\\s*)*`;
  protected parseValueRegex = `${super.parseValueRegex}(?:\\s*${this.typeAnnotationRegex})?`;
}
