

resource "aws_iam_user" "deployment" {
  name = "deployment"
  tags = {
    project = local.var.project_name
  }
}

resource "aws_iam_access_key" "deployment" {
  user    = aws_iam_user.deployment.name
  pgp_key = "keybase:${local.var.keybase_username}"
}

resource "aws_iam_role" "manage_lambas" {
  name = "manage_lambdas"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Sid": "",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    project = local.var.project_name
  }
}

output "access_key_id" {
  value = aws_iam_access_key.deployment.id
}

output "secret_access_key" {
  value = aws_iam_access_key.deployment.encrypted_secret
}

resource "aws_iam_policy" "lambda_policy" {
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [{
      "Effect" : "Allow",
      "Action" : [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "cloudwatch:PutMetricData",
        "kms:*"
      ],
      "Resource": "*"
    }]
  })
}

resource "aws_iam_user_policy_attachment" "lambda_attachment" {
  user       = aws_iam_user.deployment.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_attachment" {
  role       = aws_iam_role.manage_lambas.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}
