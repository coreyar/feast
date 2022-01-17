data "archive_file" "function_archive" {
  type        = "zip"
  source_dir  = "./../packages/lambda/dist/function"
  output_path = "./../packages/lambda/dist/function.zip"

  depends_on = [null_resource.build_lambda_function]
}

resource "aws_lambda_layer_version" "dependency_layer" {
  filename            = "./../packages/lambda/dist/layers/layers.zip"
  layer_name          = "dependency_layer"
  compatible_runtimes = ["nodejs14.x"]
#   source_code_hash    = base64sha256(file("./../packages/lambda/dist/layers/layers.zip"))

  depends_on = [null_resource.lambda_nodejs_layer]
}

resource "aws_lambda_function" "lambda" {
  filename      = data.archive_file.function_archive.output_path
  function_name = local.var.project_name
  role          = aws_iam_role.manage_lambas.arn
  handler       = "index.handler"

  # Lambda Runtimes can be found here: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
  runtime     = "nodejs14.x"
  timeout     = "30"
  memory_size = 128

  depends_on = [
    aws_cloudwatch_log_group.feast,
  ]

  environment {
    variables = {
      "MONGO_DB_NAME" = local.var.mongo_db_name
      "MONGODB_URI"   = local.var.mongo_uri
    }
  }

}

resource "aws_lambda_permission" "lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.api_gateway_rest_api.execution_arn}/*/*"
}

resource "null_resource" "build_lambda_function" {
  provisioner "local-exec" {
    working_dir = "./"
    command     = "yarn workspace feast-lambda build"
  }

  triggers = {
    source_code_changed = filebase64sha256("../packages/lambda/src/index.ts")
  }
}

resource "null_resource" "lambda_nodejs_layer" {
  provisioner "local-exec" {
    working_dir = "./"
    command     = "yarn workspace feast-lambda script:build-dependency-layer"
  }

  triggers = {
    dependencies_changed = filebase64sha256("../yarn.lock")
  }
}

resource "aws_cloudwatch_log_group" "feast" {
  name              = "/aws/lambda/${local.var.project_name}"
  retention_in_days = 14
}
