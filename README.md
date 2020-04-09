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

## Build from source

- Install dependency: `npm install`
- Lint: `npm run lint`
- Run test (including lint): `npm run test`
- Link and run as dev mode (real time ui changes)
  - Atom package link: `apm link`
  - Run dev mode: `npm run dev`
- Build dist: `npm run build`
- Make installer: `npm run archive`

## Tutorial

[readthedocs](https://athena-ide-atom.readthedocs.io/)

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
