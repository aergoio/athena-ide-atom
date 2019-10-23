# Athena-ide package

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Travis_ci](https://travis-ci.org/aergoio/athena-ide-atom.svg?branch=develop)](https://travis-ci.org/aergoio/athena-ide-atom/)
[![apm version](https://img.shields.io/apm/v/athena-ide-atom.svg)](https://atom.io/packages/athena-ide-atom)
[![apm downloads](https://img.shields.io/apm/dm/athena-ide-atom.svg)](https://atom.io/packages/athena-ide-atom)

A package for writing smart contract in aergo using atom

## Compatibility

- Atom: v1.28 or higher
- Aergo: v1.3.0 or higher

Need to rebuild for atom compatible electron version for grpc native modules in a herajs

- atom 1.28.0: electron 2.0.0
- atom 1.39.0: electron 3.1.1
- atom 1.41.0: electron 4.2.0

Check release notes of atom : https://github.com/atom/atom/releases

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

`./screenshots` holds all the supported features

## Build from source

- Install dependency: `npm install`
- Lint: `npm run lint`
- Run test (including lint): `npm run test`
- Link and run as dev mode (real time ui changes)
  - Atom package link: `apm link`
  - Run dev mode: `npm run dev`
- Build dist: `npm run build`

## Product

### Install

With atom package manager

```sh
> apm install athena-ide-atom
```

With atom ui

![install_with_atom_ui](./screenshots/1.install_with_atom_ui.gif)

### Open panel

Open Athena Ide View: `Alt + Shift + L`

![open_with_shortcut](./screenshots/2.open_with_shortcut.gif)

Open with menu bar

![open_with_menubar](./screenshots/3.open_with_menubar.gif)

### AutoComplete

![autocomplete](./screenshots/4.autocomplete.gif)

### Lint

![lint](./screenshots/5.lint.gif)

### Node Managing

New

![new_node](./screenshots/6.new_node.gif)

Remove

![remove_node](./screenshots/7.remove_node.gif)

### Account Managing

New

![new_account](./screenshots/8.new_account.gif)

Import

![import_account](./screenshots/9.import_account.gif)

Export

![export_account](./screenshots/10.export_account.gif)

Remove

![remove_account](./screenshots/11.remove_account.gif)

### Compile

Compile current file: `f7`

![compile_with_shortcut](./screenshots/12.compile_with_shortcut.gif)

By pressing compile button

![compile_with_button](./screenshots/13.compile_with_button.gif)

### Deploy & Import

Deploy without constructor arguments

![deploy_without_constructor](./screenshots/14.deploy_without_constructor.gif)

Deploy with constructor arguments

![deploy_with_constructor](./screenshots/15.deploy_with_constructor.gif)

Deploy With constructor arguments and amount

![deploy_with_constructor_and_amount](./screenshots/16.deploy_with_constructor_and_amount.gif)

Import already deployed contract

![import_contract](./screenshots/17.import_contract.gif)

Remove contract

![remove_contract](./screenshots/18.remove_contract.gif)

### Execute / Query

Execute contract

![execute_contract](./screenshots/19.execute_contract.gif)

Execute contract with amount

![execute_contract_with_amount](./screenshots/20.execute_contract_with_amount.gif)

Query contract

![query_contract](./screenshots/21.query_contract.gif)

## Contribution

Do not write custom scripts as external file like

```json
  "scripts": {
    "some-script": "scripts/some-script.sh",
  },
```

It would be broken in windows cmd.exe. Which causes package install failure in windows.

Following single rule, feel free to make any pull requests.
