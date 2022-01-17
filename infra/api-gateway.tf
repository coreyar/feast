resource "aws_api_gateway_rest_api" "api_gateway_rest_api" {
  name        = "feast"
  description = "Api Gateway for Feast Lambda"
}

resource "aws_api_gateway_resource" "api_gateway_detail" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway_rest_api.id
  parent_id   = aws_api_gateway_rest_api.api_gateway_rest_api.root_resource_id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "api_gateway_post_method" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.api_gateway_detail.id
  http_method   = "POST"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_method" "api_gateway_get_method" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.api_gateway_detail.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "api_gateway_post_integration" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway_rest_api.id
  resource_id = aws_api_gateway_method.api_gateway_post_method.resource_id
  http_method = aws_api_gateway_method.api_gateway_post_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_gateway_get_integration" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway_rest_api.id
  resource_id = aws_api_gateway_method.api_gateway_get_method.resource_id
  http_method = aws_api_gateway_method.api_gateway_get_method.http_method

  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}


resource "aws_api_gateway_method" "api_gateway_root_method" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway_rest_api.id
  resource_id   = aws_api_gateway_rest_api.api_gateway_rest_api.root_resource_id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_gateway_root_integration" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway_rest_api.id
  resource_id = aws_api_gateway_method.api_gateway_root_method.resource_id
  http_method = aws_api_gateway_method.api_gateway_root_method.http_method

  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "api_gateway_deployment" {
  depends_on = [
    aws_api_gateway_integration.api_gateway_post_integration,
    aws_api_gateway_integration.api_gateway_root_integration,
    aws_api_gateway_integration.api_gateway_get_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.api_gateway_rest_api.id
  stage_name  = local.var.app_name_env
}
