# List Tools (Convert / Extract List Data)

[![Visual Studio Code extension 1nVitr0.list-tools](https://img.shields.io/visual-studio-marketplace/v/1nVitr0.list-tools?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.list-tools)
[![Open VSX extension 1nVitr0.list-tools](https://img.shields.io/open-vsx/v/1nVitr0/list-tools)](https://open-vsx.org/extension/1nVitr0/list-tools)
[![Installs for Visual Studio Code extension 1nVitr0.list-tools](https://img.shields.io/visual-studio-marketplace/i/1nVitr0.list-tools?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.list-tools)
[![Rating for Visual Studio Code extension 1nVitr0.list-tools](https://img.shields.io/visual-studio-marketplace/r/1nVitr0.list-tools?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=1nVitr0.list-tools)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

List tools helps you convert effortlessly between common list formats, such as `JSON`, `CSV`, `YAML` or `XML` and programming languages such as `SQL`, `JavaScript`, `TypeScript`, `PHP` or `C` (see [Supported Formats](#supported-formats)).

![List Tools Demo - Convert CSV into JSON](resources/demo.gif)

Simply select any data source and run the command `List Tools: Convert multiple columns to object list` to convert between formats.

## Features

- Extract list data from data sources, such as `JSON`, `CSV`, `YAML` or `XML`
- Extract simple or object list data from programming languages, such as `JavaScript`, `TypeScript`, `PHP` or `C`
- Convert simple or object lists between data sources and programming languages
- Extract single or multiple columns from object lists

### Supported Formats

|                                                                              Input Formats |       | Output Formats                                                                                                      |
| -----------------------------------------------------------------------------------------: | :---: | :------------------------------------------------------------------------------------------------------------------ |
| ![CSV](https://img.shields.io/badge/CSV-237346?logo=googlesheets&logoColor=237346&label=​) |   ⇄   | ![CSV](https://img.shields.io/badge/CSV-237346?logo=googlesheets&logoColor=237346&label=​)                          |
|                        ![JSON](https://img.shields.io/badge/JSON-292929?logo=json&label=​) |   ⇄   | ![JSON](https://img.shields.io/badge/JSON-292929?logo=json&label=​)                                                 |
|                        ![YAML](https://img.shields.io/badge/YAML-cb171e?logo=yaml&label=​) |   ⇄   | ![YAML](https://img.shields.io/badge/YAML-cb171e?logo=yaml&label=​)                                                 |
| ![XML](https://img.shields.io/badge/XML-0060ac?logo=googlesheets&logoColor=0060ac&label=​) |   ⇄   | ![XML](https://img.shields.io/badge/XML-0060ac?logo=googlesheets&logoColor=0060ac&label=​)                          |
|                                                                                            |   ⇄   | ![SQL](https://img.shields.io/badge/SQL-00758F?logo=mysql&label=​)                                                  |
|                                                                                            |   ⇄   | ![Simple separated lists](https://img.shields.io/badge/Separated%20lists-ccc?logo=codefactor&logoColor=ccc&label=​) |
|                                                                                            |   ⇄   | ![Markdown](https://img.shields.io/badge/Markdown-083fa1?logo=markdown&label=​)                                     |
|      ![JavaScript](https://img.shields.io/badge/JavaScript-f1e05a?logo=javascript&label=​) |   ⇄   | ![JavaScript](https://img.shields.io/badge/JavaScript-f1e05a?logo=javascript&label=​)                               |
|      ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&label=​) |   ⇄   |                                                                                                                     |
|     ![Java](https://img.shields.io/badge/Java-b07219?logo=oracle&logoColor=b07219&label=​) |   ⇄   | ![Java](https://img.shields.io/badge/Java-b07219?logo=oracle&logoColor=b07219&label=​)                              |
|                                 ![C](https://img.shields.io/badge/C-555555?logo=c&label=​) |   ⇄   | ![C](https://img.shields.io/badge/C-555555?logo=c&label=​)                                                          |
|    ![C++](https://img.shields.io/badge/C++-f34b7d?logo=cplusplus&logoColor=f34b7d&label=​) |   ⇄   | ![C++](https://img.shields.io/badge/C++-f34b7d?logo=cplusplus&logoColor=f34b7d&label=​)                             |
|                           ![PHP](https://img.shields.io/badge/PHP-4F5D95?logo=php&label=​) |   ⇄   | ![PHP](https://img.shields.io/badge/PHP-4F5D95?logo=php&label=​)                                                    |

### Commands

- `List Tools: Convert single column to simple list`
  - Extract a single column from your current selection
  - Convert them into a simple list in the target language
- `List Tools: Convert multiple columns to object list`
  - Extract multiple columns from your current selection
  - Convert them into an object list in the target language
- `List Tools: Convert single column to simple list (pretty print)`
  - Same as `List Tools: Convert single column to simple list` with pretty printing enabled
- `List Tools: Convert multiple columns to object list (pretty print)`
  - Same as `List Tools: Convert multiple columns to object list` with pretty printing enabled
- `List Tools: Convert single column to simple list (without pretty print)`
  - Same as `List Tools: Convert single column to simple list` with pretty printing disabled
- `List Tools: Convert multiple columns to object list (without pretty print)`
  - Same as `List Tools: Convert multiple columns to object list` with pretty printing disabled
- `List Tools: Extract columns from object list`
  - Extract a single column from your current selection
  - Keep the current language and remove deselected columns from list
- `List Tools: Repeat last action`
  - Repeat the last action (Must be the same language as the previous action)

### Settings

The pretty printing level can be set on a per-language basis by using vscode's language-specific selector:

```json
  "[json]": {
    "list-tools.prettyPrint": 1
  }
```

The level matches the indentation level for most languages, specifying `-1` equates to an infinite depth:

```json
// "list-tools.prettyPrint": -1
// equivalent to "list-tools.prettyPrint": 2
[
  {
    "city": "Tokyo",
    "country": "Japan",
    "population": 37732000,
  }
]

// "list-tools.prettyPrint": 1
[
  { "city": "Tokyo", "country": "Japan", "population": 37732000 }
]

// "list-tools.prettyPrint": 0
[{"city":"Tokyo","country":"Japan","population":37732000}]
```

### Adding Custom Formats

It is possible to add your own formats using the internal descriptors used to generate the shipped output languages. You can either create the format from scratch or use an existing format as a base. For example, output in XML using properties instead of elements could look like this:

```json
{
  "list-tools.additionalFormats": {
    "xml-attributes": {
      "name": "XML with Attributes",
      "objectList": {
        "base": "xml",
        "delimiter": " ", // Override the delimiter to separaten items
        "itemFormat": {
          "assignmentOperator": "=", // Attribute assignment
          "assignmentOperatorSpaced": "=", // There is no spaced version in XML
          "enclosure": {
            "start": "<item ", // Override `<item></item>` enclosure
            "end": "/>",
          },
          "keyEnclosure": [
            {
              "id": "bracket-keys", // Disable enclosing keys in `<{key}></{key}>`
              "disabled": true
            }
          ],
          "valueEnclosure": "\"", // Quote all values
        },
      }
    }
  }
}
```

## Known Limitations

- data sources and programming languages must be in a valid format
- extraction from programming languages only works in cases with simple key-value pairs
- converting may lead to invalid syntax when special characters are involved

## Contributing

Feel free to open pull request or issues with additional formats.
Have a look through [`src/providers/formats`](src/providers/formats) for some examples.

This extension also supports localization through vscodes [l10n](https://github.com/microsoft/vscode-l10n), so l10n bundles are always welcome.
All bundles included in [`l10n/`](l10n/) will always be complete, so any of them can be used as a template.
