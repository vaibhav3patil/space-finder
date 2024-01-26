import { Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';

export class LambdaStack extends Stack {

    constructor(scopes: Construct, id: string, props? : StackProps){
        super(scopes, id, props);

        new LambdaFunction(this, 'HelloLambda',{
            runtime: Runtime.NODEJS_18_X,
            handler:'hello.main',
            code: Code.fromAsset(join(__dirname, '..', '..', 'services'))
        })
    }

}