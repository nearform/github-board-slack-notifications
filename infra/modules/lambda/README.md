# Terraform Lambda module

This Terraform module creates a lambda function along with an API Gateway REST endpoint.
API Gateway REST endpoint is used to expose the `/webhook` endpoint of the app, so Github can send requests to it.

This project is deployed using the Github Actions. Look at the `.github/workflows/iac-apply-dev.yaml` and `.github/workflows/iac-apply-prod.yaml` to see how the deployment is done. Github Action assumes the role `arn:aws:iam::740172916922:role/github-actions-terraform-role-dev`, which has to be manually configured before the provisioning of this module. The role has a policy assinged which grants it the rigts to modify lambda, api gateway and IAM resources mentioned in this module.

Example of usage:

```
module "lambda" {
  source               = "./modules/lambda"
  project              = var.project
  env                  = var.env
  aws_region           = var.aws_region
  slack_token          = var.slack_token
  slack_signing_secret = var.slack_signing_secret
  slack_channel        = var.slack_channel
  org_webhook_secret   = var.org_webhook_secret
  org_private_key      = var.org_private_key
  org_app_id           = var.org_app_id
}
```

All variables are described below.

<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_archive"></a> [archive](#provider\_archive) | n/a |
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_api_gateway_deployment.apideploy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_deployment) | resource |
| [aws_api_gateway_integration.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_integration.lambda_root](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_integration) | resource |
| [aws_api_gateway_method.proxyMethod](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method.proxy_root](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method) | resource |
| [aws_api_gateway_method_settings.gateway_stage](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method_settings) | resource |
| [aws_api_gateway_resource.proxy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_resource) | resource |
| [aws_api_gateway_rest_api.apiLambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_rest_api) | resource |
| [aws_cloudwatch_log_group.convert_log_group](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_iam_role.lambda_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_lambda_function.board_notification](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_permission.lambda_permission](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [archive_file.zip](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |
| [aws_iam_policy_document.lambda_assume_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region where the deployment will be done | `any` | n/a | yes |
| <a name="input_env"></a> [env](#input\_env) | Project environment | `any` | n/a | yes |
| <a name="input_org_app_id"></a> [org\_app\_id](#input\_org\_app\_id) | Application ID for the Organization | `any` | n/a | yes |
| <a name="input_org_private_key"></a> [org\_private\_key](#input\_org\_private\_key) | Private key for the Github Organization | `any` | n/a | yes |
| <a name="input_org_webhook_secret"></a> [org\_webhook\_secret](#input\_org\_webhook\_secret) | Webhook secret for the Github Organization | `any` | n/a | yes |
| <a name="input_project"></a> [project](#input\_project) | Name of the project | `any` | n/a | yes |
| <a name="input_slack_channel"></a> [slack\_channel](#input\_slack\_channel) | Slack channel where the messages will be sent to | `any` | n/a | yes |
| <a name="input_slack_signing_secret"></a> [slack\_signing\_secret](#input\_slack\_signing\_secret) | Slack signing secret | `any` | n/a | yes |
| <a name="input_slack_token"></a> [slack\_token](#input\_slack\_token) | Slack token | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_api_gateway_id"></a> [api\_gateway\_id](#output\_api\_gateway\_id) | n/a |
| <a name="output_webhook_url"></a> [webhook\_url](#output\_webhook\_url) | n/a |
<!-- END_TF_DOCS -->
