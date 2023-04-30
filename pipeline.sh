#!/bin/bash

# Set the repository URL and branch name
REPO_URL="https://github.com/kehiy/seartudio-backend.git"
BRANCH_NAME="main"

# Set the container name
CONTAINER_NAME="seartudioBackend"

# Pull the repository (or clone it if it doesn't exist)
if [ ! -d "seartudio-backend" ]; then
    git clone --branch $BRANCH_NAME $REPO_URL seartudio-backend
else
    cd seartudio-backend
    git pull
    cd ..
fi

# Build the project
cd seartudio-backend


# Rename the running container
if docker ps | grep -q $CONTAINER_NAME; then

    echo "Run if renam"
    docker rename $CONTAINER_NAME ${CONTAINER_NAME}-old  true
    docker stop ${CONTAINER_NAME}-old #because port in use
    docker tag seartudio-backend:latest seartudio-backend-old:latest
else
 echo "Run else rename"
fi


# Create the Docker image
docker build -t seartudio-backend:latest .



# Run the container
docker run -d -p 3000:3000 --name=${CONTAINER_NAME} seartudio-backend:latest


# Check if the container is running
if docker ps | grep -q $CONTAINER_NAME; then
    # If the container is running, delete the old container and image
    docker rm -f ${CONTAINER_NAME}-old  true
    docker rmi -f seartudio-backend-old:latest  true
else
    # If the container is not running, rename it back to the original name

    #delete Container and Image (new) that failed
    docker rm -f ${CONTAINER_NAME}  true
    docker rmi seartudio-backend:latest

    #rename and start pervious container and image
    docker rename ${CONTAINER_NAME}-old $CONTAINER_NAME
    docker tag seartudio-backend-old:latest seartudio-backend:latest
     

fi