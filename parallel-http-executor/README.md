# Parallel HTTP executor

Use backend capacities to do parallel http executions.

## How to install it?

### Install through AWS CloudFormation

```yml
Resources:
    ParallelHttpExecutor:
      Type: AWS::Serverless::Application
      Properties:
        Location:
          ApplicationId: arn:aws:serverlessrepo:eu-central-1:973295464626:applications/parallel-http-executor
          SemanticVersion: 1.0.0
        Parameters:
          MemorySize: 1024
          Timeout: 10
          LogRetentionInDays: 14
```

### Install through AWS Console

1. Go to https://eu-central-1.console.aws.amazon.com/serverlessrepo/home?region=eu-central-1#/available-applications
2. Search for "parallel-http-executor"
3. Configure the settings and click `Deploy`
4. Use it 🚀

### Available Parameters (optional)

#### MemorySize (Default: `1024`)
The `MemorySize` configuration of the AWS Lambda who is doing the http executions.

#### Timeout (Default: `10`)
The `Timeout` configuration of the AWS Lambda who is doing the http executions.

#### LogRetentionInDays (Default: `14`)
The AWS CloudWatch `RetentionInDays` configuration of the AWS Lambda who is doing the http executions.

## How to use it?

Doing a `POST` request against the created `Endpoint` with the following body structure*:

```json
[
    {
        "id": "REQUEST_1",
        "url": "https://jsonplaceholder.typicode.com/todos/1",
        "method": "GET"
    }
]
```

*body structure: A list of `Request`

```typescript
export interface Request {
    id: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: string;
    headers?: Record<string, string | undefined>;
}
```

## How to publish a new version?

1. Increase semantic version in `package.json` and `template.yml`
2. Run `npm run sam:publish`
