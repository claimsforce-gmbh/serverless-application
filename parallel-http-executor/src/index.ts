import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ParallelRequestExecutor, Request, Response } from './ParallelRequestExecutor';

const requestExecutor = new ParallelRequestExecutor();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const requests: Request[] = JSON.parse(event.body || '[]');
    const requestsWithCommonHeaders = requests.map((request): Request => ({
        ...request,
        headers: event.headers
    }))

    const responses: Response[] = await requestExecutor.executeAll(requestsWithCommonHeaders);

    return {
        statusCode: 200,
        body: JSON.stringify(responses)
    };
};
