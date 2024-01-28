import { App } from "aws-cdk-lib"


describe('Intial test suite', ()=>{

    test('intial test',()=>{
        const testApp  = new App({
            outdir: 'cdk.out'
        })
        
        expect(true).toBeTruthy()
    })
})