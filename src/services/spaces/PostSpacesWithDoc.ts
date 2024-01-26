import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";



export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

    const dddocClient = DynamoDBDocumentClient.from(ddbClient);
    const randomId = v4();
    const item = JSON.parse(event.body);

    const result = await dddocClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: item
    }));
    console.log(result);
    return {
        statusCode:201,
        body: JSON.stringify({id:randomId})
    }
}