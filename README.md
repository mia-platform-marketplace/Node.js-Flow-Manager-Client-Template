<div align="center">

# Node.js-Flow-Manager-Client-Template

[![Build Status][github-actions-svg]][github-actions]
[![javascript style guide][standard-mia-svg]][standard-mia]
[![Coverage Status][coverall-svg]][coverall-io]

</div>

## Testing locally

#### Create a network connection

```
docker network create app-tier --driver bridge
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
npm test
```

[standard-mia-svg]: https://img.shields.io/badge/code_style-standard--mia-orange.svg
[standard-mia]: https://github.com/mia-platform/eslint-config-mia

[coverall-svg]: https://coveralls.io/repos/github/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template/badge.svg?branch=main
[coverall-io]: https://coveralls.io/github/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template

[github-actions-svg]: https://github.com/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template/actions/workflows/node.js.yml/badge.svg
[github-actions]: https://github.com/mia-platform-marketplace/Node.js-Flow-Manager-Client-Template/actions
