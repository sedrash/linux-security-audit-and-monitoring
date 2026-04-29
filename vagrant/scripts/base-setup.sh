#!/bin/bash
set -e

echo "==== Base System Setup ===="
apt-get update
apt-get upgrade -y
apt-get install -y \
    build-essential \
    curl \
    wget \
    git \
    vim \
    openssh-server \
    openssh-client \
    net-tools \
    telnet \
    apache2 \
    apache2-utils \
    php \
    php-mysql \
    libapache2-mod-php \
    mysql-server \
    sudo \
    python3 \
    python3-pip \
    perl \
    unzip \
    htop \
    iotop \
    sysstat

# Enable SSH
systemctl enable ssh
systemctl start ssh

# Create audit logs directory
mkdir -p /var/audit-logs
chmod 755 /var/audit-logs

echo "Base system setup completed"
