import { ParallelRequestExecutor, Request } from '../src/ParallelRequestExecutor';

test('parallel requests', async () => {
    const parallelRequestExecutor = new ParallelRequestExecutor();
    const requests: Request[] = [
        {
            id: 'REQUEST_1',
            url: 'https://samples.openweathermap.org/data/2.5/weather?q=London&appid=b1b15e88fa797225412429c1c50c122a1',
            method: 'GET'
        },
        {
            id: 'REQUEST_2',
            url: 'https://samples.openweathermap.org/data/2.5/weather?q=Hamburg',
            method: 'GET'
        }
    ]
    const response = await parallelRequestExecutor.executeAll(requests);

    expect(response.length).toBe(2);
    expect(response[0].status).toBe(200);
    expect(response[1].status).toBe(200);
});
