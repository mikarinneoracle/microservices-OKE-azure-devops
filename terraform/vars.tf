variable "region" {
  type    = string
  default = "REGION"
  #default = "eu-amsterdam-1"
}

variable "compartment_id" {
  type    = string
  default = "ocid1.compartment.oc1..aaaaaaaawccfklp2wj4c5ymigrkjfdhcbcm3u5ripl2whnznhmvgiqdatqgq"
}

variable "use_always_free" {
  default = false
}

variable "tags" {
  type    = string
  default = "Created by Azure DevOps"
}

variable "demo_shape" {
  type    = string
  default = "VM.Standard.E4.Flex"
}

variable "demo_shape_mem" {
  type    = string
  default = "8"
}

variable "demo_shape_ocpus" {
  type    = string
  default = "2"
}

variable "ssh_public_key" {
  type    = string
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAQEA2laLGYCdv26vEQV3U3HqOIBsaW+ZSzsR49RvVfliaTDD+T8QSjgs4f0FxVINFxKHDYNONCl8iOwn7e0kDlrYooezsheKY8eOlaq7okfnVWBliRlFM/ncwKTOZoUVdvyEq/J4/WrQH26oEk24yYHlB2bFArxd+MoTIuoU04W3EIVK9jR4F6mORnUcQX3yFx2QuVBT7aweCDq/DNR3HiAGrMieOMZFvQSoYU8BaHghJnzstpJhmvneDmutp6YKQp7slS6q7Hpchf6LXkhWwSFuv8jpIpW7iqgDxBkqtYL06jzndjrdKvoYQFrb7IKLCxisGlEx0HjRswm3EAk+7CYBXw== rsa-key-20160908"
}