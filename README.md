# Node.js-Flow-Manager-Client-Template

[![Build Status][github-actions-svg]][github-actions]
[![javascript style guide][standard-mia-svg]][standard-mia]
[![Coverage Status][coverall-svg]][coverall-io]

This walkthrough will help you learn how to create a Node.js microservice from scratch.

## Create a microservice

In order to do so, access to [Mia-Platform DevOps Console](https://console.cloud.mia-platform.eu/login), create a new project and go to the **Design** area. From the Design area of your project select _Microservices_ and then create a new one, you have now reached [Mia-Platform Marketplace](https://docs.mia-platform.eu/docs/marketplace/overview_marketplace)!  
In the marketplace you will see a set of Examples and Templates that can be used to set-up microservices with a predefined and tested function.

For this walkthrough select the following template: **Node.js Daemon Template**. After clicking on this template you will be asked to give the following information:

- Name (Internal Hostname)
- GitLab Group Name
- GitLab Repository Name
- Docker Image Name
- Description (optional)

You can read more about this fields in [Manage your Microservices from the Dev Console](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/services) section of Mia-Platform documentation.

Give your microservice the name you prefer, in this walkthrough we'll refer to it with the following name: **my-node-service-name**.
Then, fill the other required fields and confirm that you want to create a microservice. You have now generated a *my-node-service-name* repository that is already deployed on Mia-Platform [Nexus Repository Manager](https://nexus.mia-platform.eu/) once build script in CI is successful.

## Save your changes

It is important to know that the microservice that you have just created is not saved yet on the Console. It is not essential to save the changes that you have made, since you will later make other modifications inside of your project in the Console.  
If you decide to save your changes now remember to choose a meaningful title for your commit (e.g "created service my_node_service_name"). After some seconds you will be prompted with a popup message which confirms that you have successfully saved all your changes.  
A more detailed description on how to create and save a Microservice can be found in [Microservice from template - Get started](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/custom_microservice_get_started#1-microservice-creation) section of Mia-Platform documentation.

## Deploy

In order to verify whether your code will work in your runtime environment go to the **Deploy** area of the Console.  
Once here select the environment and the branch you have worked on and confirm your choices clicking on the *deploy* button. When the deploy process is finished you will receveive a pop-up message that will inform you.  
Step 4 of [Microservice from template - Get started](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/custom_microservice_get_started#4-deploy-the-project-through-the-api-console) section of Mia-Platform documentation will explain in detail how to correctly deploy your project.

## Checkout the logs

In order to verify the service has started and it's actually working head over the the **Runtime** area of the Console, here you will be able to search for your service and view its log.

Congratulations! You have successfully learnt how to modify a blank template into an _Hello World_ Node.js microservice!

## Running Test locally

### Integration

#### Create a network connection

```
docker network create app --driver bridge
```

#### Pull the images
```
docker pull bitnami/zookeeper
docker pull bitnami/kafka
```

#### Run the images
```
docker run -d --rm --name zookeeper --network=app -e ALLOW_ANONYMOUS_LOGIN=yes -p 2180:2181 bitnami/zookeeper

docker run --rm \
  --network app-tier \
  --name=kafka \
  -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_CFG_ADVERTISED_LISTENERS='PLAINTEXT://127.0.0.1:9092,INTERNAL://localhost:9093' \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP='PLAINTEXT:PLAINTEXT,INTERNAL:PLAINTEXT' \
  -e KAFKA_CFG_LISTENERS='PLAINTEXT://0.0.0.0:9092,INTERNAL://0.0.0.0:9093' \
  -e KAFKA_INTER_BROKER_LISTENER_NAME='INTERNAL' \
  -e KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true \
  -e ALLOW_PLAINTEXT_LISTENER=yes \
  -p 2181:2181 \
  -p 443:9092 \
  -p 9092:9092 \
  -p 9093:9093 \
  bitnami/kafka
```

#### Run tests

```
npm run integration
```

### Unit

```
npm test
```

[standard-mia-svg]: https://img.shields.io/badge/code_style-standard--mia-orange.svg
[standard-mia]: https://github.com/mia-platform/eslint-config-mia

[coverall-svg]: https://coveralls.io/repos/github/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template/badge.svg?branch=main
[coverall-io]: https://coveralls.io/github/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template

[github-actions-svg]: https://github.com/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template/actions/workflows/node.js.yml/badge.svg
[github-actions]: https://github.com/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template/actions


