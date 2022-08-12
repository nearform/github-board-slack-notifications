data "archive_file" "zip" {
  type        = "zip"
  source_dir  = "../dist"
  output_path = "../board_notification.zip"
}

resource "aws_lambda_function" "board_notification" {
  filename         = data.archive_file.zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.zip.output_path)

  function_name = "${var.project}-test"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda.handler"
  runtime       = "nodejs16.x"
  timeout       = 10

  environment {
    variables = {
      SLACK_TOKEN          = var.slack_token
      SLACK_SIGNING_SECRET = var.slack_signing_secret
      SLACK_CHANNEL        = var.slack_channel
      ORG_WEBHOOK_SECRET   = var.org_webhook_secret
      ORG_PRIVATE_KEY      = var.org_private_key
      ORG_APP_ID           = var.org_app_id
      LOG_LEVEL            = error
      PRETTY_PRINT         = false
    }
  }
}

resource "aws_lambda_alias" "alias_dev" {
  name             = "dev"
  description      = "dev"
  function_name    = aws_lambda_function.board_notification.arn
  function_version = "$LATEST"
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.board_notification.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*/github-board-slack-notifications-test"
}

resource "aws_cloudwatch_log_group" "convert_log_group" {
  name = "/aws/lambda/${aws_lambda_function.board_notification.function_name}"
}
