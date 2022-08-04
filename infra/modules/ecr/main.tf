resource "aws_ecr_repository" "this" {
  name                 = var.project
  image_tag_mutability = "MUTABLE"
  force_delete         = "false"

  image_scanning_configuration {
    scan_on_push = true
  }
}