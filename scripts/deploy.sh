#!/bin/bash
set -e

DESIRED_INSTANCES=${DESIRED_INSTANCES:-2}
IMAGE_ARN=${IMAGE_ARN:-"arn:aws:appstream:ap-southeast-1:995640967788:image/OBD-Revit-AutoCAD"}
FLEET_INSTANCE_TYPE=${FLEET_INSTANCE_TYPE:-stream.standard.medium}

echo "Bootstrapping CDK environment..."
cdk bootstrap

echo "Deploying CDK stack with parameters:"
echo "  desiredInstances = ${DESIRED_INSTANCES}"
echo "  imageArn = ${IMAGE_ARN}"
echo "  fleetInstanceType = ${FLEET_INSTANCE_TYPE}"

cdk deploy --context desiredInstances=${DESIRED_INSTANCES} --context imageArn=${IMAGE_ARN} --context fleetInstanceType=${FLEET_INSTANCE_TYPE}
