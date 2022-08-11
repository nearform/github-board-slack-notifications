output "api_gateway_id" {
  value = module.lambda.api_gateway_id
}

output "lambda_webhook" {
  value = module.lambda.webhook_url
}
