resource "aws_s3_bucket" "static_site" {
  bucket = local.var.domain
  acl    = "public-read"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [{
      "Sid" : "PublicReadGetObject",
      "Effect" : "Allow",
      "Principal" : "*",
      "Action" : "s3:GetObject",
      "Resource" : "arn:aws:s3:::${local.var.domain}/*"
      },
      {
        "Action" : "s3:GetObject"
        "Effect" : "Allow"
        "Principal" : {
          "AWS" : aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn
        }
        "Resource" : "arn:aws:s3:::${local.var.domain}/*"
        "Sid" : "2"
      }
    ]
  })
}

resource "aws_iam_role" "frontend" {
  name = "${local.var.project_name}-frontend-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      }
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "unauthenticated" {
  name = "unauthenticated_policy"
  role = aws_iam_role.frontend.id

  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Action" : [
            "mobileanalytics:PutEvents",
            "cognito-sync:*",
            "cognito-identity:*"
          ],
          "Resource" : [
            "*"
          ]
        },
        {
          "Sid" : "Stmt1573099473",
          "Effect" : "Allow",
          "Action" : [
            "s3:GetObject",
            "s3:PutObject",
            "s3:PutObjectAcl",
            "s3:PutObjectVersionAcl"
          ],
          "Resource" : [
            "arn:aws:s3:::${local.var.domain}/meals/*.json"
          ]
        }
      ]
  })
}

resource "aws_cognito_identity_pool_roles_attachment" "frontend" {
  identity_pool_id = aws_cognito_identity_pool.frontend.id

  roles = {
    "unauthenticated" = aws_iam_role.frontend.arn
  }
}

locals {
  s3_origin_id = "MenuShareS3Origin"
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "MenuShare"
}

resource "aws_acm_certificate" "ssl_cert" {
  provider          = aws.acm_provider # because ACM needs to be used in the "us-east-1" region
  domain_name       = aws_s3_bucket.static_site.bucket
  validation_method = "DNS"
}

resource "aws_acm_certificate_validation" "ssl_cert_validation" {
  provider        = aws.acm_provider # because ACM needs to be used in the "us-east-1" region
  certificate_arn = aws_acm_certificate.ssl_cert.arn

  timeouts {
    create = "120m"
  }
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.static_site.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.origin_access_identity.id}"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.ssl_cert_validation.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  enabled         = true
  is_ipv6_enabled = true
  default_root_object = "index.html"

  aliases = [local.var.domain]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}


resource "aws_cognito_identity_pool" "frontend" {
  identity_pool_name               = "frontend identity pool"
  allow_unauthenticated_identities = true
}
