import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthStack extends Stack {

    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    
    constructor(scopes: Construct, id: string, props? : StackProps){
        super(scopes, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createAdminGroup();
        this.createIdentityPool();
    }

    private createUserPool() {
        this.userPool = new UserPool(this, 'SpaceUserPool', {
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        })

        new CfnOutput(this, 'SpaceUserPoolId', {
            value: this.userPool.userPoolId
        })
    }

    private createUserPoolClient() {
        this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            }
        })

        new CfnOutput(this, 'SpaceUserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        })
    }

    private createAdminGroup() {
        new CfnUserPoolGroup(this, 'SpaceAdmins', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins'
        })
    }

    private createIdentityPool() {
        this.identityPool = new CfnIdentityPool(this, 'SpaceIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        })

        new CfnOutput(this, 'SpaceIdentityPoolId', {
            value: this.identityPool.ref
        })
    }
}