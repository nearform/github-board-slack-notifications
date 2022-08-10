module "lambda" {
  source               = "./modules/lambda"
  project              = var.project
  aws_region           = var.aws_region
  slack_token          = var.slack_token
  slack_signing_secret = var.slack_signing_secret
  slack_channel        = var.slack_channel
  org_webhook_secret   = var.org_webhook_secret
  org_private_key      = var.org_private_key
  org_app_id           = var.org_app_id
}
