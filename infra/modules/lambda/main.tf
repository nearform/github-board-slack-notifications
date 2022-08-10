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
  handler       = "dist/lambda.handler"
  runtime       = "nodejs16.x"
  timeout       = 10

  environment {
    variables = {
      foo = "bar"
    }
  }
}

resource "aws_lambda_alias" "alias_dev" {
  name             = "dev"
  description      = "dev"
  function_name    = aws_lambda_function.hello.arn
  function_version = "$LATEST"
}

resource "aws_cloudwatch_log_group" "convert_log_group" {
  name = "/aws/lambda/${aws_lambda_function.hello.function_name}"
}
