variable "stage" {
  type        = string
  description = "Ambiente de deploy (somente dev por enquanto)"
}

variable "project_name" {
  type        = string
  description = "Nome base do projeto"
}

variable "aws_region" {
  type = string
  description = "Região de deploy"
}

variable "repo_url" {
  type = string
  description = "URL do repositório remoto"
}

variable "config_map" {
  type = map(string)
  description = "Config Map k3s"
}

variable "secret_map" {
type = map(string)
description = "Secret Map k3s"
}

variable "key_name" {
  type = string
  description = "SSH key"
}
