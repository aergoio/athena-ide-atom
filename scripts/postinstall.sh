## for grpc native modules in a herajs to be executed in electron environment
## check release notes of atom : https://github.com/atom/atom/releases

# up to 1.28.0
npm rebuild --runtime=electron --target=2.0.0 grpc
# up to 1.39.0
npm rebuild --runtime=electron --target=3.1.1 grpc
# up to 1.41.0
npm rebuild --runtime=electron --target=4.2.0 grpc
