# S3 Virus Scanner

Check S3 objects for viruses and tag them with `clean` or `infected`.

## How to install it?

### Install through AWS CloudFormation

```yml
Resources:
    S3VirusScanner:
      Type: AWS::Serverless::Application
      Properties:
        Location:
          ApplicationId: arn:aws:serverlessrepo:eu-central-1:973295464626:applications/s3-virus-scanner
          SemanticVersion: 1.0.0
        Parameters:
          MemorySize: 2048
          Timeout: 60
          LogRetentionInDays: 14
          BucketName: s3-bucket-to-scan
          NotificationTopicArn: arn:aws:sns:...
          DeadLetterQueueNotificationTopicArn: arn:aws:sns:...
```

### Install through AWS Console

1. Go to https://eu-central-1.console.aws.amazon.com/serverlessrepo/home?region=eu-central-1#/available-applications
2. Search for "s3-virus-scanner"
3. Configure the settings and click `Deploy`
4. Use it 🚀

### Available Parameters

#### MemorySize (Default: `2048`)
The `MemorySize` configuration of the AWS Lambda who is doing the conversion.

#### Timeout (Default: `60`)
The `Timeout` configuration of the AWS Lambda who is doing the conversion.

#### LogRetentionInDays (Default: `14`)
The AWS CloudWatch `RetentionInDays` configuration of the AWS Lambda who is doing the conversion.

#### BucketName (required)
The AWS S3 `BucketName` which owns the object to scan. This parameter is used to grant `s3:getObject` and `s3:putObjectTagging` permissions for the scan AWS Lambda. 

#### NotificationTopicArn (required)
The AWS SNS `TopicArn` to subscribe to.

#### DeadLetterQueueNotificationTopicArn (optional)
An AWS SNS `TopicArn` to notify as soon as something ends in the DLQ of the scan AWS Lambda.

## How to use it?

```yml
  Notifier:
    Type: AWS::SNS::Topic

  NotifierPolicy:
    Type: AWS::SNS::TopicPolicy
    Properties:
      Topics:
        - !Ref Notifier
      PolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              AWS: '*'
            Action: sns:Publish
            Resource: '*'

  Bucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
      NotificationConfiguration:
        TopicConfigurations:
          - Event: s3:ObjectCreated:Put
            Topic: !Ref Notifier

  S3VirusScanner:
    Type: AWS::Serverless::Application
    Properties:
      Location:
        ApplicationId: arn:aws:serverlessrepo:eu-central-1:973295464626:applications/s3-virus-scanner
        SemanticVersion: 1.0.0
      Parameters:
        MemorySize: 2048
        Timeout: 60
        LogRetentionInDays: 14
        BucketName: !Ref Bucket
        NotificationTopicArn: !Ref Notifier
```

## How to publish a new version?

1. Increase semantic version in `package.json` and `template.yml`
2. Run `npm run sam:publish`
