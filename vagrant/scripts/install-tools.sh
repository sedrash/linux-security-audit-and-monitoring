#!/bin/bash
set -e

echo "==== Installing Security Tools ===="

# Lynis - Security auditing tool
apt-get install -y lynis

# Nmap - Network discovery and security auditing
apt-get install -y nmap

# Nikto - Web server scanner
apt-get install -y nikto

# Chkrootkit - Rootkit detector
apt-get install -y chkrootkit

# Rkhunter - Rootkit hunter
apt-get install -y rkhunter

# ClamAV - Antivirus engine
apt-get install -y clamav clamav-daemon clamav-freshclam
freshclam || true

# YARA - Pattern matching engine
apt-get install -y yara

# Additional utilities
apt-get install -y \
    auditd \
    aide \
    apparmor \
    fail2ban \
    ufw \
    openssl \
    gzip \
    bzip2 \
    xz-utils

# Start and enable auditing
systemctl enable auditd
systemctl start auditd

echo "Security tools installation completed"
