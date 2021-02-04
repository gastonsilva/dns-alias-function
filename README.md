# dns-alias-function

This project is a Cloud Function that reads a config file from a Storage Bucket and updates Cloud DNS Zone A records accordingly. Its purpose is to simulate an ALIAS/ANAME like functionality.

## Example "config.json"

```json
{
    "rules": [
        {
            "zone": "my-zone-1",
            "name": "my-hostname.com.",
            "host": "my-hostname-resolver.some-dns.com"
        },
        {
            "zone": "my-zone-2",
            "name": "my-other-hostname.com.",
            "host": "my-other-hostname-resolver.some-other-dns.com"
        }
    ]
}
```

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