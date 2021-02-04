# dns-alias-function

This project is a Cloud Function that reads a config file from a Storage Bucket and updates Cloud DNS Zone A records accordingly. Its purpose is to simulate an ALIAS/ANAME like functionality.

## Requirements

A service account that can read a bucket and update DNS records

## Deploy

```bash
gcloud functions deploy dns-alias-updater \
    --region=us-central1 \
    --runtime=nodejs12 \
    --trigger-http \
    --service-account=dns-alias-admin@dns-alias-example.iam.gserviceaccount.com --entry-point=updateRecords
```