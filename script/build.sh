#!/bin/bash

build_react() {
    echo 'building react'
    rm -rf dist/*

    # chrome extension doesn't allow inline script
    export INLINE_RUNTIME_CHUNK=false
    # prevent generating sourcemap
    export GENERATE_SOURCEMAP=false

    # react-scripts build generate by default PRODUCTION build
    react-scripts build

    # copy from build to dist, build could still be used by 'npm run start'
    mkdir -p dist
    cp -r build/* dist
}

build_others() {
    echo 'building others'
    cp src/background/background.js dist
    cp build/index.html dist/index.html

    cp src/background/background.html dist
    cat build/index.html | sed -e "s/=\"\//=\"/g" > dist/my_main.html
    mv dist/index.html dist/popup.html
    cp dist/popup.html dist/options.html
    cp public/manifest.json dist/manifest.json
    cp public/html2canvas.js dist/html2canvas.js

    cp -r public/images dist
}

if [ $# -eq 0 ]; then
    echo 'build react|others'
fi

case $1 in
'react')
    build_react
    ;;
'others')
    build_others
    ;;
esac
