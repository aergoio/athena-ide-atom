# Branch model & Release process

## Branch model

Follow [successful git branch model](https://nvie.com/posts/a-successful-git-branching-model/)

## Release process

1. Make a branch and checkout to it : `git branch release/vx.x.x && git checkout release/vx.x.x`
2. Clean source : `rm -rf node_modules && npm install && npm run build`.
3. Regression test && test new features.
   - Run aergo node (check genesis.json for test account).
   - Import rich account (has enough aergo) and test based on `${PROJECT_HOME}/test/resources/*.lua` files hand by hand (see shouldXXX in *.lua files).
4. Update version in package.json.
5. Update version in package-lock.json by `npm install`.
6. Update compatibility, docs
   - Atom, Aergo compatibility in `README.md` (check electron version of atom, add rebuild scripts if necessary).
   - Engines in `package.json` (atom engine).
   - Change log file : `CHANGELOG.md`.
   - Rst docs : `${PROJECT_HOME}/docs`, hosted by [readthedocs](https://readthedocs.org/).
7. Commit prepare : `git add . && git commit -m "Prepare for vx.x.x && git push origin"`
   - DO NOT forget to add dist directory. It's entry point for atom package (defined in `package.json::main`).
8. Publish tag : `git tag vx.x.x && git push origin vx.x.x`
9. Publish to atom packages repository : `apm publish --tag vx.x.x`
10. Upload `*.bin` files to release note : `npm run archive` && upload *.bin file to [release notes](https://github.com/aergoio/athena-ide-atom/releases).
11. Merge release to master branch : `git checkout master && git merge release/vx.x.x && git push origin`
12. Merge release to develop branch : `git checkout develop && git merge release/vx.x.x && git push origin`
13. Remove release branch : `git branch -d release/vx.x.x`
14. Checkout to develop : `git checkout develop`
