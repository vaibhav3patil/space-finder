import { AuthService } from "./AuthService";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'vaibhav',
        'Centerfresh@03'//'***********'
    )
    console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());
}

testAuth();