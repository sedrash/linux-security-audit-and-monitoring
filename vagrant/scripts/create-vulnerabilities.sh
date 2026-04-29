#!/bin/bash
set -e

echo "==== Creating Vulnerabilities and Weak Configurations ===="

# 1. Create weak file permissions
mkdir -p /tmp/weak_files
touch /tmp/weak_files/sensitive.txt
echo "Sensitive data with weak permissions" > /tmp/weak_files/sensitive.txt
chmod 777 /tmp/weak_files/sensitive.txt

# 2. Create a world-readable shadow backup
cp /etc/shadow /var/tmp/shadow.bak 2>/dev/null || true
chmod 644 /var/tmp/shadow.bak 2>/dev/null || true

# 3. Add some test users with weak passwords (for demo only)
useradd -m -s /bin/bash testuser 2>/dev/null || true
echo "testuser:password123" | chpasswd 2>/dev/null || true

# 4. Create an unnecessary service that listens on a high port
cat > /etc/systemd/system/vulnerable-service.service << 'EOF'
[Unit]
Description=Vulnerable Test Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/bin/nc -l -p 9999 -e /bin/bash
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 5. Enable and start the service (optional - uncomment to enable)
# systemctl enable vulnerable-service 2>/dev/null || true
# systemctl start vulnerable-service 2>/dev/null || true

# 6. Create SUDO configuration allowing commands without password
mkdir -p /etc/sudoers.d
cat >> /etc/sudoers.d/test << 'EOF'
testuser ALL=(ALL) NOPASSWD: /bin/ls, /bin/cat
EOF
chmod 440 /etc/sudoers.d/test

# 7. SSH configuration weaknesses
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config || true
sed -i 's/PermitEmptyPasswords no/PermitEmptyPasswords yes/' /etc/ssh/sshd_config || true
sed -i 's/#X11Forwarding no/X11Forwarding yes/' /etc/ssh/sshd_config || true

# Restart SSH to apply changes (safely)
systemctl restart ssh || true

# 8. Create cron jobs with verbose logging
cat > /etc/cron.d/audit-logging << 'EOF'
*/5 * * * * root echo "Audit cron execution $(date)" >> /var/audit-logs/cron.log
EOF

# 9. Install unnecessary services that could be attack vectors
apt-get install -y telnetd 2>/dev/null || true
systemctl enable inetd 2>/dev/null || true
systemctl start inetd 2>/dev/null || true

# 10. Create sample security logs for audit
mkdir -p /var/audit-logs

# Sample failed SSH login attempts
cat > /var/audit-logs/auth.log << 'EOF'
Aug 15 10:23:45 security-audit-vm sshd[1234]: Failed password for invalid user admin from 192.168.1.100 port 54321 ssh2
Aug 15 10:23:46 security-audit-vm sshd[1235]: Failed password for invalid user root from 192.168.1.100 port 54322 ssh2
Aug 15 10:23:47 security-audit-vm sshd[1236]: Failed password for invalid user test from 192.168.1.100 port 54323 ssh2
Aug 15 10:23:48 security-audit-vm sshd[1237]: Accepted password for user vagrant from 192.168.33.1 port 51234 ssh2
Aug 15 10:24:00 security-audit-vm sudo: vagrant : TTY=pts/0 ; PWD=/home/vagrant ; USER=root ; COMMAND=/usr/bin/apt-get update
EOF
chmod 644 /var/audit-logs/auth.log

# Web server access logs
cat > /var/audit-logs/access.log << 'EOF'
192.168.1.50 - - [15/Aug/2024:10:20:15 +0000] "GET /admin HTTP/1.1" 404 245 "-" "Mozilla/5.0"
192.168.1.50 - - [15/Aug/2024:10:20:16 +0000] "POST /upload HTTP/1.1" 405 301 "-" "curl/7.68.0"
192.168.1.50 - - [15/Aug/2024:10:20:17 +0000] "GET /vulnerable/test.php HTTP/1.1" 200 5234 "-" "Mozilla/5.0"
192.168.33.1 - - [15/Aug/2024:10:20:18 +0000] "GET / HTTP/1.1" 200 10234 "-" "Mozilla/5.0"
EOF
chmod 644 /var/audit-logs/access.log

# 11. Create weak database password in config file
mkdir -p /var/www/html/config
cat > /var/www/html/config/db.php << 'EOF'
<?php
// Weak database credentials - for demo only
$db_user = 'admin';
$db_pass = 'admin123';
$db_host = 'localhost';
$db_name = 'vulnerable_db';
?>
EOF
chmod 644 /var/www/html/config/db.php

# 12. Create temporary SSH keys with weak permissions
mkdir -p /root/.ssh
ssh-keygen -t rsa -N "" -f /root/.ssh/id_rsa 2>/dev/null || true
chmod 644 /root/.ssh/id_rsa 2>/dev/null || true  # Weak permissions

echo "Vulnerabilities created for demonstration"
