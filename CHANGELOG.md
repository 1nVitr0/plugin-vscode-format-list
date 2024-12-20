# [1.11.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.10.1...v1.11.0) (2024-12-18)


### Bug Fixes

* escape keys and values in sql output ([c01bafb](https://github.com/1nVitr0/plugin-vscode-format-list/commit/c01bafb3aaaebcabfc54a883636a7286832e2ef4))
* escape quotes in csv strings ([52134df](https://github.com/1nVitr0/plugin-vscode-format-list/commit/52134df3c29ccd4a909f89a2b7c24a71ea711803))
* return quick pick item for free quick picks ([b48696f](https://github.com/1nVitr0/plugin-vscode-format-list/commit/b48696f420d5eecc254b45dfc5c4969b504cf567))


### Features

* support basic pipes in parameters ([c2003d1](https://github.com/1nVitr0/plugin-vscode-format-list/commit/c2003d1ff2fd511c36492728dd073ca82aae3952))

## [1.10.1](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.10.0...v1.10.1) (2024-09-17)


### Bug Fixes

* enclose Infinity as string ([33683ba](https://github.com/1nVitr0/plugin-vscode-format-list/commit/33683ba909d620533a7d2d1cae8d018bad387149))
* escape quotes in sql ([a3e77fa](https://github.com/1nVitr0/plugin-vscode-format-list/commit/a3e77fa1c39ca4f1f41f83818641a6e73437c766))

# [1.10.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.9.3...v1.10.0) (2024-08-07)


### Bug Fixes

* fix csv parsing when '#' is in the middle of cell ([c151b04](https://github.com/1nVitr0/plugin-vscode-format-list/commit/c151b044fd56c917086494de19b5f277af1418c7))
* fix enclosure for php array items ([cc7d061](https://github.com/1nVitr0/plugin-vscode-format-list/commit/cc7d061e66e84a92f9f6d1ce9788b18764e3bfc9))
* show progress notification while loading data ([1f8a9df](https://github.com/1nVitr0/plugin-vscode-format-list/commit/1f8a9df3a278210e0daa3ce5ffc0e736432b0133))


### Features

* open converted lists in new file by default ([295dd91](https://github.com/1nVitr0/plugin-vscode-format-list/commit/295dd918b54d628548335fc241b06986d4725e2c))

## [1.9.3](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.9.2...v1.9.3) (2024-08-07)


### Bug Fixes

* use designated yaml parser ([3912979](https://github.com/1nVitr0/plugin-vscode-format-list/commit/391297979f5d5f21e51fe8d0171950c03db84607))

## [1.9.2](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.9.1...v1.9.2) (2024-08-06)


### Bug Fixes

* fix regex error in yaml parsing ([685f448](https://github.com/1nVitr0/plugin-vscode-format-list/commit/685f448a27687e2f9cff536fe78283f9e3ee33a4))

## [1.9.1](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.9.0...v1.9.1) (2024-01-02)


### Bug Fixes

* render markdown object-list output as table ([fc6c039](https://github.com/1nVitr0/plugin-vscode-format-list/commit/fc6c03985d9f33c76a7772fcabb4b7ade9015169))

# [1.9.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.8.0...v1.9.0) (2023-12-21)


### Bug Fixes

* support jsonl (newline separated json objects) ([017abf9](https://github.com/1nVitr0/plugin-vscode-format-list/commit/017abf994ebb4509d2842cc4ecfae1bc4647a2e2))


### Features

* add json log output format support ([aba7f2b](https://github.com/1nVitr0/plugin-vscode-format-list/commit/aba7f2b9674e2bfd415185349990c4d61fbe544f))
* add support for repeatable parameters ([413bdae](https://github.com/1nVitr0/plugin-vscode-format-list/commit/413bdae04574b88c0fb9df240e92c01aeb94fcd3))

# [1.8.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.7.1...v1.8.0) (2023-11-30)


### Features

* add latex output support ([4f43367](https://github.com/1nVitr0/plugin-vscode-format-list/commit/4f43367f03e041bcd79f197bbebc0239e0b4ddc0))

## [1.7.1](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.7.0...v1.7.1) (2023-11-19)


### Bug Fixes

* apply valueEnclosure on value alias ([8d9ab76](https://github.com/1nVitr0/plugin-vscode-format-list/commit/8d9ab767b34edf34e4a57a56961e27519c3421d6))
* escape xml tokens in values ([6af5f0c](https://github.com/1nVitr0/plugin-vscode-format-list/commit/6af5f0ccf35a9c8beb1e8a0c68854cb3831c3251))

# [1.7.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.6.1...v1.7.0) (2023-11-15)


### Bug Fixes

* output null value as empty in csv ([c5c6cf7](https://github.com/1nVitr0/plugin-vscode-format-list/commit/c5c6cf764284daba5a462711c2e40ef8e560db6d))


### Features

* flatten parsed json & support keyed data ([ee4c69f](https://github.com/1nVitr0/plugin-vscode-format-list/commit/ee4c69f343e21b0920b8867381652e04965f0f47))

## [1.6.1](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.6.0...v1.6.1) (2023-11-15)


### Bug Fixes

* escape quotes and line breaks in output ([3819305](https://github.com/1nVitr0/plugin-vscode-format-list/commit/381930517ba3730053376df442e8562245fe1a25))
* support line breaks and quotes in csv ([da49d9a](https://github.com/1nVitr0/plugin-vscode-format-list/commit/da49d9ac94666e39d9d4d9e7a20b8a06c6042ec7))

# [1.6.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.5.0...v1.6.0) (2023-10-23)


### Bug Fixes

* add support for SQL update queries ([425674f](https://github.com/1nVitr0/plugin-vscode-format-list/commit/425674fa0033ac24bdd2d84d73585514bc732a89))


### Features

* support nested parameter substitution ([5a55e6d](https://github.com/1nVitr0/plugin-vscode-format-list/commit/5a55e6d7f06ea2b1a61ab448171e7d273ed71805))

# [1.5.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.4.1...v1.5.0) (2023-10-19)


### Bug Fixes

* add l10n to query parameters ([fd9f526](https://github.com/1nVitr0/plugin-vscode-format-list/commit/fd9f52664bda57d95d00ef21ebccf0858f5f5863))


### Features

* add l10n support ([1dfbbc3](https://github.com/1nVitr0/plugin-vscode-format-list/commit/1dfbbc3bd7dc9b82fe314b40d21c51dd08f06228))

## [1.4.1](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.4.0...v1.4.1) (2023-10-16)


### Bug Fixes

* allow overriding key escape regexps ([31dfc74](https://github.com/1nVitr0/plugin-vscode-format-list/commit/31dfc7461a88c58da8fc6200fff862579263ccf8))
* fix toggle pretty print button ([b17ffed](https://github.com/1nVitr0/plugin-vscode-format-list/commit/b17ffed95be851a133e0733eaaf95c98257a7bac))
* make pretty printing langauge-overridable ([c9c110d](https://github.com/1nVitr0/plugin-vscode-format-list/commit/c9c110dfb143a315e5f9bc0c6f49bd5c5deaa898))

# [1.4.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.3.2...v1.4.0) (2023-10-14)


### Bug Fixes

* allow custom separators for xml ([5facb90](https://github.com/1nVitr0/plugin-vscode-format-list/commit/5facb900792b2017423da290069f2b3b588915df))


### Features

* add support for xml data ([59285a0](https://github.com/1nVitr0/plugin-vscode-format-list/commit/59285a01f089bf5b51152665739d5781ead0256d))

## [1.3.2](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.3.1...v1.3.2) (2023-10-08)


### Bug Fixes

* add commands for immediate pretty printing ([d71273f](https://github.com/1nVitr0/plugin-vscode-format-list/commit/d71273f883d49a8be605a2f3f7b90a7574a8dcb7))

## [1.3.1](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.3.0...v1.3.1) (2023-10-07)


### Bug Fixes

* fix csv failing wih trailing newline ([c205efc](https://github.com/1nVitr0/plugin-vscode-format-list/commit/c205efc34eaeaf8cb0e6fe096540d4fc1821e612))
* simplify formatters and fix inconsistencies ([9a02be3](https://github.com/1nVitr0/plugin-vscode-format-list/commit/9a02be3c05384940fd4e0de81b49849583b08911))

# [1.3.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.2.0...v1.3.0) (2023-10-06)


### Features

* add sql format support ([c97721a](https://github.com/1nVitr0/plugin-vscode-format-list/commit/c97721a0b84f8aab2ffcb88fa6a10d5c28c7d993))

# [1.2.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.1.0...v1.2.0) (2023-10-03)


### Features

* add repeat last action command ([a0a990f](https://github.com/1nVitr0/plugin-vscode-format-list/commit/a0a990f94bb27bc64dbbebef4eb2040aec436d6d))

# [1.1.0](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.0.1...v1.1.0) (2023-10-02)


### Features

* add parameter support for formats ([de76ee0](https://github.com/1nVitr0/plugin-vscode-format-list/commit/de76ee02fedd4e779acc29051def040a1ca09656))
* add xml format support ([ea8fe95](https://github.com/1nVitr0/plugin-vscode-format-list/commit/ea8fe958b21e0bf389c12bfa6e6643ff0899bcc6))

## [1.0.1](https://github.com/1nVitr0/plugin-vscode-format-list/compare/v1.0.0...v1.0.1) (2023-09-30)


### Bug Fixes

* add extension icon ([aede5a9](https://github.com/1nVitr0/plugin-vscode-format-list/commit/aede5a9687fc968b7cdc91fec92c5ec402e6f47c))
* simplify settings ([3906ca8](https://github.com/1nVitr0/plugin-vscode-format-list/commit/3906ca829a413fe431106cdc5f54a0d944d2aa54))
* strip quotes from keys ([9b7fbda](https://github.com/1nVitr0/plugin-vscode-format-list/commit/9b7fbda84ee2c2c391fefe1cd9b7677af5897b65))

# 1.0.0 (2023-09-27)


### Bug Fixes

* add js to formats and fix formatting ([019aa08](https://github.com/1nVitr0/plugin-vscode-format-list/commit/019aa08b812a20a1737f1f3a3156340f51cbccb4))
* fix formattings ([ae0bf8b](https://github.com/1nVitr0/plugin-vscode-format-list/commit/ae0bf8b3419e62698f001a1cd370ebe00b2557ac))
* simplify object formatting options ([7e31d69](https://github.com/1nVitr0/plugin-vscode-format-list/commit/7e31d694c5365181fd234cb4f63272de7802b15e))


### Features

* add more data providers ([8fcece4](https://github.com/1nVitr0/plugin-vscode-format-list/commit/8fcece424d5f63fb030198e24438f04035e5f838))
* support js, ts and json input ([41c83e2](https://github.com/1nVitr0/plugin-vscode-format-list/commit/41c83e2e17532bcc6888e8d7b2dc0a96b3bd6f45))

# 1.0.0 (2023-09-27)


### Bug Fixes

* add js to formats and fix formatting ([019aa08](https://github.com/1nVitr0/plugin-vscode-format-list/commit/019aa08b812a20a1737f1f3a3156340f51cbccb4))
* fix formattings ([ae0bf8b](https://github.com/1nVitr0/plugin-vscode-format-list/commit/ae0bf8b3419e62698f001a1cd370ebe00b2557ac))
* simplify object formatting options ([7e31d69](https://github.com/1nVitr0/plugin-vscode-format-list/commit/7e31d694c5365181fd234cb4f63272de7802b15e))


### Features

* add more data providers ([8fcece4](https://github.com/1nVitr0/plugin-vscode-format-list/commit/8fcece424d5f63fb030198e24438f04035e5f838))
* support js, ts and json input ([41c83e2](https://github.com/1nVitr0/plugin-vscode-format-list/commit/41c83e2e17532bcc6888e8d7b2dc0a96b3bd6f45))
