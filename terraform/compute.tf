resource "oci_core_instance" "demo_vm" {
  availability_domain = lookup(data.oci_identity_availability_domains.this.availability_domains[0], "name")
  compartment_id      = var.compartment_id
  display_name        = "demo"
  shape               = var.demo_shape
  freeform_tags = {
    Managed = var.tags
  }
  
  shape_config {
    baseline_ocpu_utilization = "BASELINE_1_1"
    memory_in_gbs     = var.demo_shape_mem
    ocpus             = var.demo_shape_ocpus
  }

  create_vnic_details {
    assign_private_dns_record = true
    subnet_id                 = oci_core_subnet.Public_Subnet_demo.id
    display_name              = "demo-VNIC"
    assign_public_ip          = true
    freeform_tags = {
      Managed = var.tags
    }
  }

  source_details {
    source_type = "image"
    source_id   = var.demo_image_source_ocid
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
  }
}