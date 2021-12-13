resource "mongodbatlas_project" "project" {
  name   = local.var.project_name
  org_id = local.var.mongo_org_id
}

resource "mongodbatlas_serverless_instance" "db" {
  project_id                   = mongodbatlas_project.project.id
  name                         = mongodbatlas_project.project.name

  provider_settings_backing_provider_name = "AWS"
  provider_settings_provider_name = "SERVERLESS"
  provider_settings_region_name = "US_EAST_1"
}

# resource "mongodbatlas_cluster" "cluster" {
#   project_id                   = mongodbatlas_project.project.id
#   provider_name                = "AWS"
#   provider_region_name         = "us-east-2"
#   name                         = "${mongodbatlas_project.project.name}-cluster"
# #   provider_instance_size_name  = "M00"
#   mongo_db_major_version       = "4.2"
#   cluster_type                 = "REPLICASET"
#   auto_scaling_disk_gb_enabled = true
# }

# resource "mongodbatlas_project_ip_whitelist" "whitelists" {
#   project_id = mongodbatlas_project.project.id
#   cidr_block = "33.67.12.12/32"
# }

# DATABASE USER  [Configure Database Users](https://docs.atlas.mongodb.com/security-add-mongodb-users/)
resource "mongodbatlas_database_user" "user" {
  username           = local.var.mongo_dbuser
  password           = local.var.mongo_dbuser_password
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = local.var.app_name_env # The database name and collection name need not exist in the cluster before creating the user.
  }
}

# resource "mongodbatlas_project_ip_access_list" "ip" {
#   project_id = mongodbatlas_project.project.id
#   ip_address = var.ip_address
#   comment    = "IP Address for accessing the cluster"
# }

# output "ipaccesslist" {
#   value = mongodbatlas_project_ip_access_list.ip.ip_address
# }

output "user" {
  value = mongodbatlas_database_user.user.username
}

output "project_name" {
  value = mongodbatlas_project.project.name
}

