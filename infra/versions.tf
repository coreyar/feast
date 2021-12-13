terraform {
  required_version = "0.14.2"
  backend "s3" {
    # bucket: required
    # key
    # US East (Northern Virginia)
    region  = "us-east-2"
    # profile
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }

    mongodbatlas = {
      source = "mongodb/mongodbatlas"
    }
  }
}

provider "aws" {
  region     = "us-east-2"
}

provider "aws" {
  alias      = "acm_provider"
  region     = "us-east-1"
}

provider "mongodbatlas" {
  public_key = local.var.mongodbatlas_public_key
  private_key  = local.var.mongodbatlas_private_key
}
