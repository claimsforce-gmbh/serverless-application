import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { ParallelRequestExecutor, Request, Response } from './ParallelRequestExecutor';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // set timeout to 90% of available time to exit gracefully
    const requestTimeout = parseInt((context.getRemainingTimeInMillis() * 0.9).toFixed(0))
    const requestExecutor = new ParallelRequestExecutor(requestTimeout);

    const requests: Request[] = JSON.parse(event.body || '[]');
    const responses: Response[] = await requestExecutor.executeAll(requests);

    return {
        statusCode: 200,
        body: JSON.stringify(responses)
    };
};
