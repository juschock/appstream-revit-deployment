#!/bin/bash
set -e

DESIRED_INSTANCES=${DESIRED_INSTANCES:-2}
IMAGE_NAME=${IMAGE_NAME:-MyRevitImage-2025-02}
FLEET_INSTANCE_TYPE=${FLEET_INSTANCE_TYPE:-stream.standard.medium}

echo "Bootstrapping CDK environment..."
cdk bootstrap

echo "Deploying CDK stack with parameters:"
echo "  desiredInstances = ${DESIRED_INSTANCES}"
echo "  imageName = ${IMAGE_NAME}"
echo "  fleetInstanceType = ${FLEET_INSTANCE_TYPE}"

cdk deploy --context desiredInstances=${DESIRED_INSTANCES} --context imageName=${IMAGE_NAME} --context fleetInstanceType=${FLEET_INSTANCE_TYPE}
