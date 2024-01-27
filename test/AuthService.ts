import {type CognitoUser} from '@aws-amplify/auth';
import { Auth } from '@aws-amplify/auth';
import { Amplify } from '@aws-amplify/core';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers';

const awsRegion = 'ap-south-1';

Amplify.configure({
    Auth:{
        region: awsRegion,
        userPoolId: 'ap-south-1_HnUeCX7Ni',
        userPoolWebClientId: '52l8p902490ql0hrvo0dd5h2b7',
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        identityPoolId: 'ap-south-1:ab50e28c-7b0f-4272-abfd-f0edc20762e4'
    }    
})

export class AuthService {

    public async login(username: string, password: string) {
        const result = await Auth.signIn(username, password) as CognitoUser;
        return result;
    }

    public async generateTemporaryCredetials(user: CognitoUser) {
        const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-south-1_HnUeCX7Ni`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'ap-south-1:ab50e28c-7b0f-4272-abfd-f0edc20762e4',
                logins: {
                    [cognitoIdentityPool]: jwtToken
                }
            })
        })

        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}