data "archive_file" "zip" {
  type        = "zip"
  source_dir  = "../dist"
  output_path = "../board_notification.zip"
}
