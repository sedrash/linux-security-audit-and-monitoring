Vagrant.configure("2") do |config|
<<<<<<< HEAD
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "audit-lab-vm"

  config.vm.network "private_network", ip: "192.168.56.101"
=======
  config.vm.box = ENV.fetch("VAGRANT_BOX", "generic/ubuntu2204")
  config.vm.hostname = "audit-lab"

  config.vm.network "private_network",
    ip: ENV.fetch("VM_HOST", "192.168.122.101"),
    libvirt__network_name: ENV.fetch("LIBVIRT_NETWORK_NAME", "default"),
    libvirt__dhcp_enabled: true
>>>>>>> 349b834 (new update)
  config.vm.network "forwarded_port", guest: 22, host: 2222, id: "ssh"
  config.vm.network "forwarded_port", guest: 80, host: 8081

  config.vm.provider "virtualbox" do |vb|
<<<<<<< HEAD
    vb.name = "linux-security-audit-lab"
=======
    vb.name = "dashboard-audit-lab"
>>>>>>> 349b834 (new update)
    vb.memory = 2048
    vb.cpus = 2
  end

<<<<<<< HEAD
  config.vm.provision "shell", path: "scripts/provision-vulnerable-vm.sh"
=======
  config.vm.provider "libvirt" do |lv|
    lv.uri = "qemu:///system"
    lv.memory = 2048
    lv.cpus = 2
  end

  config.vm.provision "shell", path: "scripts/provision-vm.sh"
>>>>>>> 349b834 (new update)
end
