# Branch model & Release process

## Branch model

Follow [successful git branch model](https://nvie.com/posts/a-successful-git-branching-model/)

## Release process

1. `rm -rf node_modules && npm install && npm run build`
2. Regression test && test new features if exist
3. Update version in package.json (also package-lock.json by `npm install`)
4. Update compatibility & changelog
5. Update screenshots if necessary
6. `git add . && git commit -m "Prepare for vx.x.x && git push origin"`
7. `git tag vx.x.x && git push origin vx.x.x`
8. `apm publish --tag vx.x.x`
9. `git checkout master && git merge develop && git push origin`
10. `git checkout develop`

