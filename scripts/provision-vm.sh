#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

cat >/etc/apt/apt.conf.d/99audit-lab-retries <<'APT'
Acquire::Retries "5";
Acquire::ForceIPv4 "true";
APT

if grep -R "mirrors.edge.kernel.org" /etc/apt/sources.list /etc/apt/sources.list.d >/dev/null 2>&1; then
  sed -i \
    -e 's|https://mirrors.edge.kernel.org/ubuntu|http://archive.ubuntu.com/ubuntu|g' \
    -e 's|http://mirrors.edge.kernel.org/ubuntu|http://archive.ubuntu.com/ubuntu|g' \
    /etc/apt/sources.list /etc/apt/sources.list.d/*.list 2>/dev/null || true
fi

apt-get update
apt-get install -y \
  apache2 \
  auditd \
  chkrootkit \
  clamav \
  fail2ban \
  lynis \
  net-tools \
  nikto \
  nmap \
  openssh-server \
  rkhunter \
  rsyslog \
  ufw \
  yara

id auditlab >/dev/null 2>&1 || useradd -m -s /bin/bash auditlab
echo "auditlab:password123" | chpasswd
usermod -aG sudo auditlab
echo "auditlab ALL=(ALL) NOPASSWD:ALL" >/etc/sudoers.d/auditlab
chmod 440 /etc/sudoers.d/auditlab

mkdir -p /var/www/html/uploads /opt/audit-lab
cat >/var/www/html/index.html <<'HTML'
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>Audit Lab</title>
  </head>
  <body>
    <h1>Audit Lab VM</h1>
    <p>Serveur volontairement mal configure pour demonstration d'audit.</p>
    <p>Indice: compte de test auditlab / password123.</p>
  </body>
</html>
HTML

cat >/etc/apache2/conf-available/audit-lab-weak.conf <<'APACHE'
ServerTokens Full
ServerSignature On
TraceEnable On
<Directory /var/www/html/uploads>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
APACHE
a2enconf audit-lab-weak >/dev/null

sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin .*/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/^#\?MaxAuthTries .*/MaxAuthTries 10/' /etc/ssh/sshd_config
grep -q '^AllowUsers' /etc/ssh/sshd_config || echo 'AllowUsers auditlab vagrant root' >>/etc/ssh/sshd_config
echo "root:toor123" | chpasswd

cat >/opt/audit-lab/suspicious.yar <<'YARA'
rule DemoSuspiciousShell {
  strings:
    $shell = "/bin/bash"
    $marker = "audit-lab-demo"
  condition:
    all of them
}
YARA

cat >/tmp/audit-lab-marker.sh <<'SH'
#!/bin/bash
echo audit-lab-demo
/bin/bash -c true
SH
chmod 777 /tmp/audit-lab-marker.sh

cat >/etc/fail2ban/jail.d/audit-lab.conf <<'F2B'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = %(sshd_log)s
maxretry = 3
findtime = 600
bantime = 300
F2B

ufw --force reset
ufw default allow incoming
ufw default allow outgoing

systemctl restart ssh || systemctl restart sshd
systemctl restart apache2
systemctl enable apache2 ssh fail2ban auditd rsyslog >/dev/null 2>&1 || true
systemctl restart fail2ban || true

echo "Audit lab provisioned at 192.168.56.101 with auditlab/password123"
