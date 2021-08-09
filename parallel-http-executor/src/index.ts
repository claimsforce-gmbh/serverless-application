import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ParallelRequestExecutor, Request, Response } from './ParallelRequestExecutor';

const requestExecutor = new ParallelRequestExecutor();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const requests: Request[] = JSON.parse(event.body || '[]');
    const responses: Response[] = await requestExecutor.executeAll(requests);

    return {
        statusCode: 200,
        body: JSON.stringify(responses)
    };
};
