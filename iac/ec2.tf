data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default_public" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "k3s_sg" {
  name        = "${var.project_name}-${var.stage}-sg"
  description = "SG for k3s single node"
  vpc_id      = data.aws_vpc.default.id
  
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  ingress {
    description = "NodePorts (k8s Services)"
    from_port   = 32080
    to_port     = 32085
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.project_name
    Stage = var.stage
  }
}

locals {
  user_data = templatefile("${path.module}/user_data.sh.tmpl", {
    repo_url      = var.repo_url
    env_map       = join("\n", [for k, v in var.config_map : "${k}=${v}"])
    secret_map    = join("\n", [for k, v in var.secret_map : "${k}=${v}"])
  })
}

resource "aws_instance" "k3s" {
  ami                         = "ami-0807bd3aff0ae7273"
  instance_type               = "t3a.small"
  subnet_id                   = data.aws_subnets.default_public.ids[0]
  associate_public_ip_address = true                                   

  vpc_security_group_ids = [aws_security_group.k3s_sg.id]
  key_name               = var.key_name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data                   = local.user_data
  user_data_replace_on_change = true

  tags = {
    Name = var.project_name
  }
}

output "EC2_URL" {
  value = aws_instance.k3s.public_dns
}

output "EC2_public_ip" {
  value = aws_instance.k3s.public_ip
}
