
terraform {
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "0.8.3"
    }
  }
}

provider "libvirt" {
  uri = "qemu:///system"
}

resource "libvirt_volume" "ubuntu" {
  name   = "livraria-ubuntu.qcow2"
  pool   = "default"
  source = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
  format = "qcow2"
}

resource "libvirt_volume" "disk" {
  count          = 2
  name           = "livraria-vm${count.index + 1}.qcow2"
  pool           = "default"
  base_volume_id = libvirt_volume.ubuntu.id
  size           = 10737418240
}

resource "libvirt_cloudinit_disk" "init" {
  count = 2
  name  = "livraria-init${count.index + 1}.iso"
  pool  = "default"

  user_data = templatefile("${path.module}/cloud_init.yaml", {
    ssh_key = trimspace(file(pathexpand("~/.ssh/id_ed25519.pub")))
  })
}

resource "libvirt_domain" "vm" {
  count  = 2
  name   = "livraria-vm${count.index + 1}"
  memory = 2048
  vcpu   = 2

  cloudinit = libvirt_cloudinit_disk.init[count.index].id

  network_interface {
    network_name   = "default"
    wait_for_lease = true
  }

  disk {
    volume_id = libvirt_volume.disk[count.index].id
  }
}

output "vm1_ip" {
  value = libvirt_domain.vm[0].network_interface[0].addresses[0]
}

output "vm2_ip" {
  value = libvirt_domain.vm[1].network_interface[0].addresses[0]
}
