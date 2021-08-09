import { ParallelRequestExecutor, Request } from '../src/ParallelRequestExecutor';

test('parallel requests', async () => {
    const parallelRequestExecutor = new ParallelRequestExecutor();
    const requests: Request[] = [
        {
            id: 'REQUEST_1',
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            method: 'GET'
        },
        {
            id: 'REQUEST_2',
            url: 'https://jsonplaceholder.typicode.com/todos/2',
            method: 'GET'
        }
    ]
    const response = await parallelRequestExecutor.executeAll(requests);

    expect(response.length).toBe(2);
    expect(response[0].status).toBe(200);
    expect(response[1].status).toBe(200);
});
