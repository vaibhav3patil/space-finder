import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    helloLambdaIntegration: LambdaIntegration
}
export class ApiStack extends Stack {

    constructor(scopes: Construct, id: string, props : ApiStackProps){
        super(scopes, id, props);

        const api = new RestApi(this, 'SpacesApi');
        const spacesResource = api.root.addResource('spaces');
        spacesResource.addMethod('GET', props.helloLambdaIntegration)
    }

}