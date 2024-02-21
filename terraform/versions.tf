terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">=4.93.0"
    }
  }
  backend "http" {
    address = "https://objectstorage.eu-amsterdam-1.oraclecloud.com/p/q-9i-3q__W7TSVv-9OXoc4XMHkfYTc1vcn1xWvOki1hv1fhKT1qnBUe9T8MYpacQ/n/frsxwtjslf35/b/tf-state/o/terraform.tfstate"
    update_method = "PUT"
  }
}

provider "oci" {
   auth = "InstancePrincipal"
   region = "eu-frankfurt-1"
}