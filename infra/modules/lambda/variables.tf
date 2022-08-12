variable "project" {
  description = "Name of the project"
}
variable "env" {
  description = "Project environment"
}

variable "aws_region" {
  description = "AWS region where the deployment will be done"
}

variable "slack_token" {
  description = "Slack token"
  sensitive   = true
}

variable "slack_signing_secret" {
  description = "Slack signing secret"
  sensitive   = true
}

variable "slack_channel" {
  description = "Slack channel where the messages will be sent to"
  sensitive   = true
}

variable "org_webhook_secret" {
  description = "Webhook secret for the Github Organization"
  sensitive   = true
}

variable "org_private_key" {
  description = "Private key for the Github Organization"
  sensitive   = true
}

variable "org_app_id" {
  description = "Application ID for the Organization"
  sensitive   = true
}
