# Content to PDF

Convert HTML and/or plain text into a PDF.

## How to install it?

### Install through AWS CloudFormation

```yml
Resources:
    ContentToPDF:
      Type: AWS::Serverless::Application
      Properties:
        Location:
          ApplicationId: arn:aws:serverlessrepo:eu-central-1:973295464626:applications/content-to-pdf
          SemanticVersion: 1.0.0
        Parameters:
          MemorySize: 2048
          Timeout: 10
          LogRetentionInDays: 14
          AssetExpirationInDays: 1
```

### Install through AWS Console

1. Go to https://eu-central-1.console.aws.amazon.com/serverlessrepo/home?region=eu-central-1#/available-applications
2. Search for "content-to-pdf"
3. Configure the settings and click `Deploy`
4. Use it 🚀

### Available Parameters (optional)

#### MemorySize (Default: `2048`)
The `MemorySize` configuration of the AWS Lambda who is doing the conversion.

#### Timeout (Default: `10`)
The `Timeout` configuration of the AWS Lambda who is doing the conversion.

#### LogRetentionInDays (Default: `14`)
The AWS CloudWatch `RetentionInDays` configuration of the AWS Lambda who is doing the conversion.

#### AssetExpirationInDays (Default: `1`)
The AWS S3 `ExpirationInDays` configuration for generated PDFs.

## How to use it?

Invoke the created AWS Lambda through the AWS Console and/or a SDK call (e.g. `lambda.invoke`).

```typescript
interface Request {
    content: string;
    fileName: string;
    ttl?: number;
    contentDispositionType?: 'attachment' | 'inline';
}

interface Response {
    url: string;
}

const lambda = new AWS.Lambda();
const request: Request = {
    content: 'This. is. a. <strong>Test!</strong>',
    fileName: 'Test.pdf',
    ttl: 60, // optional (default 300)
    contentDispositionType: 'attachment' // optional (default 'inline')
};

const { Payload: rawPayload } = await lambda.invoke({
    FunctionName: process.env.FUNCTION_NAME,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(request)
}).promise();

const response = JSON.parse(rawPayload as string) as request;

console.log(response.url);

// output: https://...
```

## How to publish a new version?

1. Increase semantic version in `package.json` and `template.yml`
2. Run `npm run sam:publish`
