# Variables not allowed here
terraform {
  backend "s3" {
    bucket = "github-board-slack-notifications-tfstate"
    key    = "dev-terraform.state"
    region = "us-east-1"
  }
}
