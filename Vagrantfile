Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "audit-lab-vm"

  config.vm.network "private_network", ip: "192.168.56.101"
  config.vm.network "forwarded_port", guest: 22, host: 2222, id: "ssh"
  config.vm.network "forwarded_port", guest: 80, host: 8081

  config.vm.provider "virtualbox" do |vb|
    vb.name = "linux-security-audit-lab"
    vb.memory = 2048
    vb.cpus = 2
  end

  config.vm.provision "shell", path: "scripts/provision-vulnerable-vm.sh"
end
