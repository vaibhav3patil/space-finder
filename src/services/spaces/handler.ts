import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
  
async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{

    let message: string;
    switch (event.httpMethod) {
        case 'GET':
            message = "hello from GET!"
            break;
        case 'POST':
            message = "hello from POST!"
            break;
        default:
            break;
    }
    const repsonse : APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }
    
    return repsonse;
}

export { handler }
