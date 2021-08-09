import axios from 'axios';

export interface Request {
    id: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: string;
    headers?: { [name: string]: string | undefined; }
}

export interface Response {
    requestId: string;
    body?: string;
    status: number;
}

export class ParallelRequestExecutor {
    public executeAll(requests: Request[]): Promise<Response[]> {
        return Promise.all(requests.map((r) => this.makeRequest(r)));
    }

    private async makeRequest(request: Request): Promise<Response> {
        try {
            const response = await axios({
                method: request.method,
                url: request.url,
                data: request.body,
                headers: request.headers
            });
            return {
                requestId: request.id,
                status: response.status,
                body: response.data
            }
        } catch (e) {
            console.error(e);
            return {
                requestId: request.id,
                status: 500
            }
        }
    }
}
