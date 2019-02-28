# Athena-ide package

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Travis_ci](https://travis-ci.org/aergoio/athena-ide-atom.svg?branch=master)](https://travis-ci.org/aergoio/athena-ide-atom/)

A package for writing smart contract in aergo using atom

## Features

- [X] Syntax highlighting
- [X] Basic autocomplete
- [X] Basic linter
- [X] Compile
- [X] Deploy smart contract
- [X] Execute smart contract

- [ ] Query smart contract result
- [ ] Advanced autocomplete (lua specific, nested table)
- [ ] Advanced linter (recommandation)
- [ ] Simulation

## Installation

```sh
$ apm install athena-ide-atom
```

## How to use

* Compile current file: `f7`
* Open Athena Ide View: `alt + shift + l`

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