import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import {S3Client, ListBucketsCommand} from '@aws-sdk/client-s3';

const s3Client = new S3Client({});
  
async function handler(event:APIGatewayProxyEvent, context: Context){

    // in order to access the s3 bucket from lambda we need to add policy to access s3 buckets in lambda stack
    const command = new ListBucketsCommand({});
    const listBucketResult = (await s3Client.send(command)).Buckets;


    const repsonse : APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify("hello fron lambda, here are your bucket:" + JSON.stringify(listBucketResult))
    }
    console.log(repsonse);
    return repsonse;
}

export { handler }
