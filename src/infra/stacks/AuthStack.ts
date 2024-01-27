import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AuthStack extends Stack {

    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    private adminRole: Role;
    
    constructor(scopes: Construct, id: string, props? : StackProps){
        super(scopes, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createAdminGroup();
        this.createIdentityPool();
        this.createRoles();
        this.attachedRole();
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

    private createRoles() {
        this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole',{
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals:{
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-deintity.amazonaws.con:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        })

        this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole',{
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals:{
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-deintity.amazonaws.con:amr': 'unauthenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        })

        this.adminRole = new Role(this, 'CognitoAdminRole',{
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals:{
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-deintity.amazonaws.con:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        })
    }

    private attachedRole() {
        new CfnIdentityPoolRoleAttachment(this, 'RoleAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unAuthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }
}