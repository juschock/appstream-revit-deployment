#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AppStreamStack } from '../lib/appstream-stack';

const app = new cdk.App();
new AppStreamStack(app, 'AppStreamRevitStack', {
});
