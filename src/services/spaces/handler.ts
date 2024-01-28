import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { JsonError, MissingFieldError } from "../shared/Validator";
import { addCoresHeadher } from "../shared/Utils";
  
process.env.TABLE_NAME = "SpaceTable-02e50c715a33";

const ddbClient = new DynamoDBClient({})

async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{

    let repsonse: APIGatewayProxyResult;
    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getSpaces(event, ddbClient);
                repsonse = getResponse
                break;
            case 'POST':
                const postResponse = await postSpaces(event, ddbClient);
                repsonse =  postResponse;
                break;
            case 'PUT':
                const putResponse = await updateSpace(event, ddbClient);
                repsonse =  putResponse;
                break;
            case 'DELETE':
                const deleteResponse = await deleteSpace(event, ddbClient);
                repsonse =  deleteResponse;   
                break;                        
            default:
                break;
        }
    } catch (error) {
        if(error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        if(error instanceof JsonError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        return {
            statusCode:500,
            body: JSON.stringify(error.message)
        }
    }

    addCoresHeadher(repsonse);
    return repsonse;
}

export { handler }
