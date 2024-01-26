import { handler } from "../src/services/spaces/handler";

handler({
    httpMethod: 'POST',
    // queryStringParameters: {
    //     id: '982c4c50-8008-435b-b274-8b4f0ef26305'
    // },
    body: JSON.stringify({
        location:'Dublin updated'
    })
} as any, {} as any).then(result=> console.log(result));