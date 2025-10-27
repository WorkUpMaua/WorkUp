variable "stage" {
  type        = string
  description = "Ambiente de deploy (somente dev por enquanto)"
}

variable "project_name" {
  type        = string
  description = "Nome base do projeto"
}
variable "ssh_cidr"     {
  type = number
}

variable "repo_url" {
  type = string
  description = "URL do repositório remoto"
}

variable "config_map" {
  type = string
  description = "Config Map k3s"
}

variable "secret_map" {
type = string
description = "Secret Map k3s"
}

variable "key_name" {
  type = string
  description = "SSH key"
}
