#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AppStreamStack } from '../lib/appstream-stack';

const app = new cdk.App();
new AppStreamStack(app, 'AppStreamRevitStack', {
  /* If you need to specify the AWS Account and Region, uncomment below:
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  */
});
