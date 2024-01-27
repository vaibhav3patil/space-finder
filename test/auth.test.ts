import { AuthService } from "./AuthService";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'vaibhav',
        '***********'
    )
    console.log(loginResult);
}

testAuth();