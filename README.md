# Athena-ide package

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Travis_ci](https://travis-ci.org/aergoio/athena-ide-atom.svg?branch=develop)](https://travis-ci.org/aergoio/athena-ide-atom/)
[![apm version](https://img.shields.io/apm/v/athena-ide-atom.svg)](https://atom.io/packages/athena-ide-atom)
[![apm downloads](https://img.shields.io/apm/dm/athena-ide-atom.svg)](https://atom.io/packages/athena-ide-atom)

A package for writing smart contract in aergo using atom

## Compatibility

- Atom: v1.28 or higher
- Aergo: v2.2.x

Need to rebuild for atom compatible electron version for grpc native modules in a herajs

- atom 1.28.0: electron 2.0.0
- atom 1.39.0: electron 3.1.1
- atom 1.41.0: electron 4.2.0

And for all platform (win32, linux, darwin) for packaging

Check [release notes of atom](https://github.com/atom/atom/releases)

## Features

- [X] Syntax highlighting
- [X] Basic autocomplete
- [X] Basic linter
- [X] Compile
- [X] Deploy smart contract
- [X] Execute smart contract
- [X] Query smart contract result
- [X] Fee delegation
- [X] Re-deploy smart contract (private mode only)
- [X] Advanced autocomplete (lua specific, nested table)

`./screenshots` holds all the supported features

## Build from source

- Install dependency: `npm install`
- Lint: `npm run lint`
- Run test (including lint): `npm run test`
- Link and run as dev mode (real time ui changes)
  - Atom package link: `apm link`
  - Run dev mode: `npm run dev`
- Build dist: `npm run build`
- Make installer: `npm run archive`

## Product

### Prerequisite

- [Atom](https://atom.io/)
- [Git bash (windows only)](https://git-scm.com/downloads)
- [Aergo smart contract guide](https://docs.aergo.io/en/latest/smart-contracts/lua/index.html)

### Install

With atom package manager

```sh
> apm install athena-ide-atom
```

With atom ui

![install-with-atom-ui](./screenshots/install-with-atom-ui.gif)

With installer (use gitbash in windows)

[Release page](https://github.com/aergoio/athena-ide-atom/releases)

```sh
> ./athena-ide-atom-x.x.x-installer.bin
```

### Open panel

With shortcut: `Alt + Shift + L`

![open-with-shortcut](./screenshots/open-with-shortcut.gif)

With menu bar

![open-with-menubar](./screenshots/open-with-menubar.gif)

### Editor

AutoComplete

![editor-autocomplete](./screenshots/editor-autocomplete.gif)

Lint

![editor-lint](./screenshots/editor-lint.gif)

### Node

New

![node-new](./screenshots/node-new.gif)

Remove

![node-remove](./screenshots/node-remove.gif)

### Account

New

![account-new](./screenshots/account-new.gif)

Import

![account-import](./screenshots/account-import.gif)

Export

![account-export](./screenshots/account-export.gif)

Remove

![account-remove](./screenshots/account-remove.gif)

### Deployment

#### Compile

With shortcut: `f7`

![compile-with-shortcut](./screenshots/compile-with-shortcut.gif)

With button

![compile-with-button](./screenshots/compile-with-button.gif)

#### Deploy

Without args

![deploy-without-args](./screenshots/deploy-without-args.gif)

Without args with gas limit

![deploy-without-args-with-gas-limit](./screenshots/deploy-without-args-with-gas-limit.gif)

Without args with amount

![deploy-without-args-with-amount](./screenshots/deploy-without-args-with-amount.gif)

With args

![deploy-with-args](./screenshots/deploy-with-args.gif)

### Import / Remove

Import deployed contract

![import-deployed-contract](./screenshots/import-deployed-contract.gif)

Remove contract

![remove-contract](./screenshots/remove-contract.gif)

### Execute / Query

Execute contract

![execute-contract](./screenshots/execute-contract.gif)

Execute with varargs

![execute-with-varargs](./screenshots/execute-with-varargs.gif)

Execute contract set gas limit

![execute-contract-set-gas-limit](./screenshots/execute-contract-set-gas-limit.gif)

Execute contract with fee delegation

![execute-contract-with-fee-delegation](./screenshots/execute-contract-with-fee-delegation.gif)

Execute contract with amount

![execute-contract-with-amount](./screenshots/execute-contract-with-amount.gif)

Query contract state

![query-contract-state](./screenshots/query-contract-state.gif)

### Redeploy (private mode only)

Redeploy to already deployed one (Deployer must be an origin deployer)

![redeploy](./screenshots/redeploy.gif)

## Contribution

1. Do not write custom scripts as external file like

   ```json
   "scripts": {
     "some-script": "scripts/some-script.sh",
   },
   ```

   It would break windows build in cmd.exe. Which causes package install failure in windows.

2. Since atom is electron-based, make sure external library is build on electron target.\
   Do not use `electron-rebuild` because of grpc [see also](https://www.npmjs.com/package/grpc#about-electron).

Following these rules, feel free to make any pull requests.
