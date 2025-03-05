import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appstream from 'aws-cdk-lib/aws-appstream';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class AppStreamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const desiredInstances = Number(this.node.tryGetContext('desiredInstances')) || 2;
    const imageArn = this.node.tryGetContext('imageArn');
    const fleetInstanceType = this.node.tryGetContext('fleetInstanceType') || 'stream.standard.medium';

    if (!imageArn) {
      throw new Error("Error: You must provide an AppStream image ARN in cdk.json");
    }

    const vpc = new ec2.Vpc(this, 'AppStreamVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    const persistentStorageBucket = new s3.Bucket(this, 'PersistentStorageBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      versioned: false,
    });

    const fleetRole = new iam.Role(this, 'AppStreamFleetRole', {
      assumedBy: new iam.ServicePrincipal('appstream.amazonaws.com'),
      description: 'IAM role for AppStream fleet instances to access persistent storage',
    });
    persistentStorageBucket.grantReadWrite(fleetRole);

    const appStreamFleet = new appstream.CfnFleet(this, 'RevitFleet', {
      name: 'RevitFleet',
      instanceType: fleetInstanceType,
      imageArn: imageArn,
      vpcConfig: {
        subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }).subnetIds,
      },
      computeCapacity: {
        desiredInstances: desiredInstances
      },
      iamRoleArn: fleetRole.roleArn,
      fleetType: 'ON_DEMAND'
    });

    const appStreamStack = new appstream.CfnStack(this, 'RevitStack', {
      name: 'RevitStack',
      userSettings: [
        {
          action: 'CLIPBOARD_COPY_FROM_LOCAL_DEVICE',
          permission: 'DISABLED'
        },
        {
          action: 'CLIPBOARD_COPY_TO_LOCAL_DEVICE',
          permission: 'DISABLED'
        },
        {
          action: 'FILE_UPLOAD',
          permission: 'DISABLED'
        },
        {
          action: 'FILE_DOWNLOAD',
          permission: 'DISABLED'
        }
      ],
      storageConnectors: [
        {
          connectorType: 'HOMEFOLDERS'
        }
      ]
    });

    new appstream.CfnStackFleetAssociation(this, 'RevitStackFleetAssociation', {
      fleetName: appStreamFleet.name!,
      stackName: appStreamStack.name!
    }).addDependency(appStreamFleet);

    new cdk.CfnOutput(this, 'PersistentStorageBucketName', {
      value: persistentStorageBucket.bucketName,
      description: 'The S3 bucket used for persistent storage'
    });

    new cdk.CfnOutput(this, 'AppStreamFleetRoleArn', {
      value: fleetRole.roleArn,
      description: 'IAM Role ARN for AppStream Fleet'
    });

    new cdk.CfnOutput(this, 'VPCId', {
      value: vpc.vpcId,
      description: 'The ID of the created VPC'
    });
  }
}
