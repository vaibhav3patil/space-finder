import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'vaibhav',
        'Centerfresh@03'//'***********'
    )
    // console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());
    const credetials = await service.generateTemporaryCredetials(loginResult);
    console.log(credetials);
    const bucket = await listBuckets(credetials);
    console.log(bucket);
    
}

async function listBuckets(credentials: any) {
    const client = new S3Client({
        credentials: credentials
    });
    const command = new ListBucketsCommand({});
    const result = await client.send(command);
    return result;
}
testAuth();