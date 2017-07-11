#!/bin/bash

TARGET="45.55.204.101"
TARGET_USER="deployer"
TARGET_PATH="/www/weather.srly.io/"

rsync -aP --delete _site/* ${TARGET_USER}@${TARGET}:${TARGET_PATH}
