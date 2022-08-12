variable "project" {}

variable "aws_region" {}

variable "slack_token" {
  sensitive = true
}

variable "slack_signing_secret" {
  sensitive = true
}

variable "slack_channel" {
  sensitive = true
}

variable "org_webhook_secret" {
  sensitive = true
}

variable "org_private_key" {
  sensitive = true
}

variable "org_app_id" {
  sensitive = true
}
