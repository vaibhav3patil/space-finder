import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from 'uuid'
 
async function handler(event:APIGatewayProxyEvent, context: Context){
    const repsonse : APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify("hello fron lambda, this is the id:" + v4())
    }
    console.log(repsonse);
    return repsonse;
}

export { handler }