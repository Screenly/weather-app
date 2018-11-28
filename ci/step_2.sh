#!/bin/bash -ex
# vim: tabstop=4 shiftwidth=4 softtabstop=4
# -*- sh-basic-offset: 4 -*-

GITBRANCH=$(git rev-parse --abbrev-ref HEAD)

# Deploy to stage
if [ "$GITBRANCH" == 'production' ]; then
    docker run \
        --rm \
        -v $(pwd):/usr/src/app \
        -e JEKYLL_ENV=production \
        weather_srly_io:latest \
        bundle exec htmlproofer ./_site || true
fi
