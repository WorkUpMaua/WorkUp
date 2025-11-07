resource "aws_s3_bucket" "uploads" {
  bucket = "${var.project_name}-${var.stage}-uploads"
}

resource "aws_s3_account_public_access_block" "account_unblock" {
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_public_access_block" "uploads_public_access" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "uploads_public_policy" {
  bucket = aws_s3_bucket.uploads.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid: "PublicReadWrite",
        Effect = "Allow",
        Principal = "*",
        Action = ["s3:GetObject", "s3:PutObject"],
        Resource = "arn:aws:s3:::${aws_s3_bucket.uploads.bucket}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "uploads_cdn" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.uploads.bucket_regional_domain_name
    origin_id   = "uploadsOrigin"

  }

  default_cache_behavior {
    target_origin_id       = "uploadsOrigin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}


output "uploads_bucket_name" {
  value = aws_s3_bucket.uploads.bucket
}

output "uploads_cdn_url" {
  value = aws_cloudfront_distribution.uploads_cdn.domain_name
}
