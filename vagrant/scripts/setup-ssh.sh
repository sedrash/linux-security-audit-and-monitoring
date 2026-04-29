#!/bin/bash
set -e

echo "==== Setting up SSH for Backend Connection ===="

# Create vagrant user if doesn't exist
if ! id -u vagrant > /dev/null 2>&1; then
    useradd -m -s /bin/bash vagrant
fi

# Add vagrant to sudoers
echo "vagrant ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/vagrant
chmod 440 /etc/sudoers.d/vagrant

# Configure SSH for key-based authentication
mkdir -p /home/vagrant/.ssh
chmod 700 /home/vagrant/.ssh

# Create insecure vagrant key (this is standard for Vagrant)
cat > /home/vagrant/.ssh/authorized_keys << 'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6NF8iallmveE+T4jCn5QJ3GrwOl+DdtIq/JqO0dQixur0SIM1nJsYb+Yl/hHnRkCrxDp51PP5ibY51pWI6PNw6KPfZoTtw+7qLcVZ5u75z1y2B+QVTVf7V+Eo+qkj8bAxnuVVM41d7dh2n0PVESQwvxNhTd7VGrffDeJ8f7zNbINuayL+MSsCGSdVYs0z5mrzKNBeIYMaE7DkQMEuS3/JuNnBo8LnQTaxVBB2dEDMCXZj7guichXV/2Sh6DEQYg+BINYipBsPMTAKJb4WitXUicvQXZKMEUlhMEoqvJl7MxJ5h7YG6UWm5kxfIH7p2WnEg3BLXvT8OA== vagrant insecure public key
EOF
chmod 600 /home/vagrant/.ssh/authorized_keys
chown -R vagrant:vagrant /home/vagrant/.ssh

# Ensure SSH is configured for password and key auth
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config || true
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config || true

# Restart SSH
systemctl restart ssh

echo "SSH setup completed"
