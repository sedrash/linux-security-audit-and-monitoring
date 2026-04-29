#!/bin/bash
set -e

echo "==== Configuring Services ===="

# Apache Configuration - Enable some risky modules for demo
a2enmod userdir 2>/dev/null || true
a2enmod cgid 2>/dev/null || true
a2enmod ssl 2>/dev/null || true

# Create a simple vulnerable PHP page
mkdir -p /var/www/html/vulnerable
cat > /var/www/html/vulnerable/test.php << 'EOF'
<?php
// Simple vulnerable page for testing
echo "Vulnerable Server - PHP Version: " . phpversion();
phpinfo();
?>
EOF

# Allow directory listing (risky)
cat > /var/www/html/vulnerable/.htaccess << 'EOF'
Options +Indexes
EOF

# Start Apache
systemctl enable apache2
systemctl start apache2

# MySQL - Start with basic config
systemctl enable mysql
systemctl start mysql

# Configure UFW (firewall) with weak settings
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 25/tcp

# Setup Fail2ban with basic config
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local 2>/dev/null || true
systemctl enable fail2ban
systemctl start fail2ban

# Configure rsyslog for logging
systemctl enable rsyslog
systemctl start rsyslog

echo "Services configuration completed"
