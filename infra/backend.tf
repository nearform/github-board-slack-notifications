# Variables not allowed here
terraform {
  required_version = "~> 1.2.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.25"
    }
  }

  backend "s3" {
    bucket = "github-board-slack-notifications-tfstate"
    region = "us-east-1"

  }
}
