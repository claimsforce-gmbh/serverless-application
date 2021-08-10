import axios from 'axios';

export interface Request {
    id: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: string;
    headers?: Record<string, string | undefined>;
}

export interface Response {
    requestId: string;
    body?: string;
    status: number;
}

export class ParallelRequestExecutor {
    constructor(private readonly requestTimeout: number) {
    }

    public executeAll(requests: Request[]): Promise<Response[]> {
        return Promise.all(requests.map((r) => this.makeRequest(r)));
    }

    private async makeRequest(request: Request): Promise<Response> {
        try {
            const response = await axios({
                method: request.method,
                url: request.url,
                data: request.body,
                headers: request.headers,
                timeout: this.requestTimeout
            });
            return {
                requestId: request.id,
                status: response.status,
                body: response.data
            }
        } catch (e) {
            return {
                requestId: request.id,
                status: 500,
                body: e.message
            }
        }
    }
}
