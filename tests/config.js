/*
* Copyright 2021 Mia srl
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict'

const { KAFKA_HOSTS_CI } = process.env
const { randomString } = require('../plugin/utils')

const KAFKA_DEFAULT_HOSTS = 'localhost:9092,localhost:9093'

// provides dynamic config so that parallel tests do not interfere each other
module.exports = () => ({
  LOG_LEVEL: 'silent',
  // Mia
  USERID_HEADER_KEY: 'userid',
  GROUPS_HEADER_KEY: 'groups',
  CLIENTTYPE_HEADER_KEY: 'clienttype',
  BACKOFFICE_HEADER_KEY: 'backoffice',
  MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway',
  // Kafka related vars
  KAFKA_BROKERS_LIST: KAFKA_HOSTS_CI || KAFKA_DEFAULT_HOSTS,
  KAFKA_CLIENT_ID: `client-consumer-${randomString()}`,
  KAFKA_GROUP_ID: `dev-consumer-${randomString()}`,
  KAFKA_COMMANDS_TOPIC_NAME: `commands-${randomString()}`,
  KAFKA_EVENTS_TOPIC_NAME: `events-${randomString()}`,
})
