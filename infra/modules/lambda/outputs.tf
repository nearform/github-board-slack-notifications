output "api_gateway_id" {
  value = aws_api_gateway_rest_api.apiLambda.id
}

output "webhook_url" {
  value = "${aws_api_gateway_deployment.apideploy.invoke_url}/webhook"
}
