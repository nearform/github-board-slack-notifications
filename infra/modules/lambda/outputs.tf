output "api_gateway_id" {
  value = aws_api_gateway_rest_api.api_gateway.id
}

output "webhook_url" {
  value = "${aws_api_gateway_stage.dev.invoke_url}/webhook"
}
