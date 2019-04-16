# Athena-ide package

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Travis_ci](https://travis-ci.org/aergoio/athena-ide-atom.svg?branch=master)](https://travis-ci.org/aergoio/athena-ide-atom/)

A package for writing smart contract in aergo using atom

## Compatible Aergo Version

v1.0.x

## Features

- [X] Syntax highlighting
- [X] Basic autocomplete
- [X] Basic linter
- [X] Compile
- [X] Deploy smart contract
- [X] Execute smart contract
- [X] Query smart contract result
- [X] Advanced autocomplete (lua specific, nested table)

- [ ] Advanced linter (recommandation)
- [ ] Simulation


## How to use

### Installation

With atom package manager

```sh
$ apm install athena-ide-atom
```

With atom ui

![install_with_atom_ui](./screenshots/install_with_atom_ui.gif)

### Open panel

Open Athena Ide View: `Alt + Shift + L`

![open_with_shortcut](./screenshots/open_with_shortcut.gif)

Open with menu bar

![open_with_menubar](./screenshots/open_with_menubar.gif)

### AutoComplete

![autocomplete](./screenshots/autocomplete.gif)

### Lint

![lint](./screenshots/lint.gif)

### Node Managing

New

![new_node](./screenshots/new_node.gif)

Remove

![remove_node](./screenshots/remove_node.gif)

### Account Managing

New

![new_account](./screenshots/new_account.gif)

Import

![import_account](./screenshots/import_account.gif)

Export

![export_account](./screenshots/export_account.gif)

### Compile

Compile current file: `f7`

![compile_with_shortcut](./screenshots/compile_with_shortcut.gif)

By pressing compile button

![compile_with_button](./screenshots/compile_with_button.gif)

### Deploy

Without constructor arguments

![deploy_without_constructor](./screenshots/deploy_without_constructor.gif)

With constructor arguments

![deploy_with_constructor](./screenshots/deploy_with_constructor.gif)

### Contract Managing

Import

![import_contract](./screenshots/import_contract.gif)

Remove

![remove_contract](./screenshots/remove_contract.gif)

### Execute / Query

Execute

![execute_contract](./screenshots/execute_contract.gif)

Query

![query_contract](./screenshots/query_contract.gif)

## Build

Clone

```sh
$ git clone https://github.com/aergoio/athena-ide-atom.git
```

Install dependency

```sh
$ npm install
```

Run lint

```sh
$ npm run lint
```

Run test (including lint)

```sh
$ npm run test
```

Link to local atom package

```sh
$ apm link
```
