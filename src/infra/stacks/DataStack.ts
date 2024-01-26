import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DataStack extends Stack {

    constructor(scopes: Construct, id: string, props? : StackProps){
        super(scopes, id, props);
    }

}