#!/bin/bash

CONTAINER_NAME=lxd-webui

lxc info lxd-webui &> /dev/null || {
    lxc launch images:ubuntu/xenial/amd64 ${CONTAINER_NAME} -c security.privileged=true
    lxc exec ${CONTAINER_NAME} -- apt-get update
    lxc exec ${CONTAINER_NAME} -- apt-get install -y apt-transport-https curl
    lxc exec ${CONTAINER_NAME} -- bash << EOF
        curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
        echo 'deb https://deb.nodesource.com/node_4.x trusty main' > /etc/apt/sources.list.d/nodesource.list
        echo 'deb-src https://deb.nodesource.com/node_4.x trusty main' >> /etc/apt/sources.list.d/nodesource.list
EOF
    lxc exec ${CONTAINER_NAME} -- apt-get update
    lxc exec ${CONTAINER_NAME} -- apt-get install -y nodejs graphicsmagick imagemagick icnsutils ruby-dev build-essential
    lxc exec ${CONTAINER_NAME} -- gem install fpm
}
lxc config device add ${CONTAINER_NAME} lxd-webui disk source=$PWD path=/home/ubuntu/lxd-webui

lxc exec ${CONTAINER_NAME} -- sudo -u ubuntu -i