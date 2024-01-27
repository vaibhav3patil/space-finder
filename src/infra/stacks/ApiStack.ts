import { Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration,
    userPool: IUserPool
}
export class ApiStack extends Stack {

    constructor(scopes: Construct, id: string, props : ApiStackProps){
        super(scopes, id, props);

        const api = new RestApi(this, 'SpacesApi');

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpaceApiAuthorizer',{
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization'
        });

        authorizer._attachToApi(api);
        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }

        const spacesResource = api.root.addResource('spaces');
        spacesResource.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth)
        spacesResource.addMethod('POST', props.spacesLambdaIntegration, optionsWithAuth)
        spacesResource.addMethod('PUT', props.spacesLambdaIntegration, optionsWithAuth)
        spacesResource.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuth)
    }

}