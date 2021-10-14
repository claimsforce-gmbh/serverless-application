# Example

```
1. aws cloudformation package --s3-bucket BUCKET --template-file ./example.yml --output-template-file example-packaged.yml
2. aws cloudformation deploy --stack-name S3VirusScannerExample --template-file ./example-packaged.yml --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
```
