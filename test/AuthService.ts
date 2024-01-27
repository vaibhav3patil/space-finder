import {type CognitoUser} from '@aws-amplify/auth';
import { Auth } from '@aws-amplify/auth';
import { Amplify } from '@aws-amplify/core';

const awsRegion = 'ap-south-1';

Amplify.configure({
    Auth:{
        region: awsRegion,
        userPoolId: 'ap-south-1_HnUeCX7Ni',
        userPoolWebClientId: '52l8p902490ql0hrvo0dd5h2b7',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }    
})

export class AuthService {

    public async login(username: string, password: string) {
        const result = await Auth.signIn(username, password) as CognitoUser;
        return result;
    }
}