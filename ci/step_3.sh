#!/bin/bash -ex
# vim: tabstop=4 shiftwidth=4 softtabstop=4
# -*- sh-basic-offset: 4 -*-

GITBRANCH=$(git rev-parse --abbrev-ref HEAD)
SERVERS=(real.us.hosting.wireload.net)

# Accept SSH keys
for server in "${SERVERS[@]}"; do
    ssh-keyscan -H "$server" >> ~/.ssh/known_hosts
done

# Deploy to stage
if [ "$GITBRANCH" == 'master' ]; then
    DSTFOLDER="stage-weather.srly.io"

elif [ "$GITBRANCH" == 'production' ]; then
    DSTFOLDER="weather.srly.io"
else
    exit
fi

# Configure SSH
eval $(ssh-agent -s)
[ "$DISPLAY"  ] || export DISPLAY=dummydisplay:0
SSH_ASKPASS=/usr/local/bin/srly_add_key.sh ssh-add < /dev/null > /dev/null

for server in "${SERVERS[@]}"; do
    rsync -aP --delete --exclude upload _site/* "deployer@$server:/www/$DSTFOLDER/"
done
