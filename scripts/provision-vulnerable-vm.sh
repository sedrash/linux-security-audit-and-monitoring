#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y \
  apache2 \
  auditd \
  chkrootkit \
  clamav \
  fail2ban \
  lynis \
  nmap \
  nikto \
  openssh-server \
  rkhunter \
  rsyslog \
  ufw \
  yara

systemctl enable --now ssh apache2 rsyslog auditd

# Lab-only weak SSH configuration for reproducible findings.
sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin .*/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/^#\?X11Forwarding .*/X11Forwarding yes/' /etc/ssh/sshd_config
echo 'root:root' | chpasswd
echo 'vagrant:vagrant' | chpasswd
systemctl restart ssh

# Intentionally expose more services than a hardened baseline.
ufw --force reset
ufw allow 22/tcp
ufw allow 80/tcp
ufw --force disable

cat >/var/www/html/index.html <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Audit Lab Vulnerable Web Server</title>
  </head>
  <body>
    <h1>Audit Lab</h1>
    <p>This intentionally vulnerable web service is for local security-audit training only.</p>
    <!-- sample-leak: admin / password123 -->
  </body>
</html>
HTML

cat >/etc/apache2/conf-available/audit-lab-weak.conf <<'APACHE'
ServerTokens Full
ServerSignature On
TraceEnable On
Options Indexes FollowSymLinks
APACHE
a2enconf audit-lab-weak
systemctl reload apache2

cat >/etc/fail2ban/jail.d/audit-lab.conf <<'FAIL2BAN'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
findtime = 10m
bantime = 10m
FAIL2BAN
systemctl enable --now fail2ban
systemctl restart fail2ban

cat >/opt/audit-lab-yara-rule.yar <<'YARA'
rule LabCredentialLeak {
  strings:
    $credential = "password123"
  condition:
    $credential
}
YARA

chmod 0644 /opt/audit-lab-yara-rule.yar
echo "Audit lab VM provisioned. This machine is intentionally weak and must stay isolated."
