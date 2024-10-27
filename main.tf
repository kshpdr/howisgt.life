terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  project = "31194329109"
  region  = "us-central1"  # Specify the region
}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

resource "google_compute_instance" "app_instance" {
  name         = "react-flask-vm"
  machine_type = "e2-micro"
  zone         = "us-central1-a"  # Specify the zone

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
      size  = 20
    }
  }

  network_interface {
    network = google_compute_network.vpc_network.name

    access_config {
      // Ephemeral IP
    }
  }

  tags = ["http-server", "https-server"]
}

resource "google_compute_firewall" "default" {
  name    = "default-allow-http-https"
  network = google_compute_network.vpc_network.name

  allow {
    protocol = "tcp"
    ports    = ["22", "80", "443"]
  }

  source_ranges = ["0.0.0.0/0", "35.235.240.0/20"]
  target_tags   = ["http-server", "https-server"]
}