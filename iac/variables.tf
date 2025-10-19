variable "stage" {
  type        = string
  description = "Ambiente de deploy (somente dev por enquanto)"
}

variable "aws_region" {
  type = string
  description = "Regiao de deploy"
}

variable "project_name" {
  type        = string
  description = "Nome base do projeto"
}
