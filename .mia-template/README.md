# nodejs-custom-plugin

## Summary

%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%

## Local Development

To develop the service locally you need:

- Node 14+

To setup node, please if possible try to use [nvm][nvm], so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
`nvm install`, the `.nvmrc` file will install and select the correct version if you don’t already have it.

Once you have all the dependency in place, you can launch:

```shell
npm i
npm run coverage
```

This two commands, will install the dependencies and run the tests with the coverage report that you can view as an HTML
page in `coverage/lcov-report/index.html`.
After running the coverage you can create your local copy of the default values for the `env` variables needed for
launching the application.

```shell
cp ./default.env ./local.env
```

From now on, if you want to change anyone of the default values for the variables you can do it inside the `local.env`
file without pushing it to the remote repository.

Once you have all your dependency in place you can launch:

```shell
set -a && source local.env
npm start
```

After that you will have the service exposed on your machine. In order to verify that the service is working properly you could launch in another terminal shell:

```shell
curl http://localhost:3000/-/ready
```

As a result the terminal should return you the following message:

```json
{"name":"mia_template_service_name_placeholder","status":"OK","version":"0.1.0"}
```

## Contributing

To contribute to the project, please be mindful for this simple rules:

1. Don’t commit directly on master
2. Start your branches with `feature/` or `fix/` based on the content of the branch
3. If possible, refer to the Jira issue id, inside the name of the branch, but not call it only `fix/BAAST3000`
4. Always commit in english
5. Once you are happy with your branch, open a [Merge Request][merge-request]

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

[nvm]: https://github.com/creationix/nvm
[merge-request]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/merge_requests
