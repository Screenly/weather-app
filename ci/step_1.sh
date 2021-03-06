#!/bin/bash -ex
# vim: tabstop=4 shiftwidth=4 softtabstop=4
# -*- sh-basic-offset: 4 -*-

GITBRANCH=$(git rev-parse --abbrev-ref HEAD)

docker-compose build

if [ "$GITBRANCH" == 'master' ]; then
    BUILDARGS="_config.yml,_config_stage.yml"

    # Use staging server
    sed -i 's/weather-backend/stage-weather-backend/g' _assets/js/app.getForecast.js
    sed -i 's/weather-backend/stage-weather-backend/g' _assets/js/app.getLocalData.js
elif [ "$GITBRANCH" == 'production' ]; then
    BUILDARGS="_config.yml"
else
    exit
fi

docker run \
    --rm \
    -v $(pwd):/usr/src/app \
    -e JEKYLL_ENV=production \
    weather_srly_io:latest \
    jekyll build --config "$BUILDARGS"
