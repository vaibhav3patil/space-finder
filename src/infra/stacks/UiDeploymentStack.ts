import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";



export class UiDeployementStack extends Stack {

    constructor(scopes: Construct, id: string, props? : StackProps){
        super(scopes, id, props);
        const suffix = getSuffixFromStack(this);
        
        const deploymentBucket = new Bucket(this, 'uiDeplymentBucket', {
            bucketName: `space-finder-frontend-${suffix}`
        })

        const uiDir = join(__dirname, '..', '..', 'space-finder-frontend', 'dist');
        if (!existsSync(uiDir)) {
            console.log('Ui directory not found' + uiDir);
            return;
        }

        new BucketDeployment(this, 'SpaceFinderDeployment',{
            destinationBucket: deploymentBucket,
            sources: [Source.asset(uiDir)]
        })

        const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
        deploymentBucket.grantRead(originIdentity);
        
        const distribution = new Distribution(this, 'SpaceFinderDistribution',{
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new S3Origin(deploymentBucket,{
                    originAccessIdentity: originIdentity
                })
            }
        })

        new CfnOutput(this, 'SpaceFinderUrl', {
            value: distribution.distributionDomainName
        })
    }
}