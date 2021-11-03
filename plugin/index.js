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

const { COMMANDS } = require('./constants')
const { randomString } = require('./utils')

const {
  returnSame,
} = require('./commands')
const {
  ping,
} = require('./events')

const customService = require('@mia-platform/custom-plugin-lib')({
  type: 'object',
  required: [
    'KAFKA_BROKERS_LIST',
    'KAFKA_CLIENT_ID',
    'KAFKA_GROUP_ID',
    'KAFKA_COMMANDS_TOPIC_NAME',
    'KAFKA_EVENTS_TOPIC_NAME',
  ],
  properties: {
    LOG_LEVEL: { type: 'string', default: 'info' },
    // Kafka Config
    KAFKA_BROKERS_LIST: { type: 'string' },
    KAFKA_CLIENT_ID: { type: 'string' },
    KAFKA_GROUP_ID: { type: 'string' },
    KAFKA_COMMANDS_TOPIC_NAME: { type: 'string' },
    KAFKA_EVENTS_TOPIC_NAME: { type: 'string' },
    KAFKA_AUTH_METHOD: { type: 'string' },
    KAFKA_SASL_USERNAME: { type: 'string' },
    KAFKA_SASL_PASSWORD: { type: 'string' },
  },
})

module.exports = (FMCBuilder) => customService(async function index(service) {
  const { log, customMetrics, config } = service
  const {
    KAFKA_COMMANDS_TOPIC_NAME,
    KAFKA_EVENTS_TOPIC_NAME,
  } = config

  const { kafkaConfig, consumerConfig } = prepareKafkaConfig(config)
  const client = new FMCBuilder(log, kafkaConfig)
    .configureCommandsExecutor(KAFKA_COMMANDS_TOPIC_NAME, consumerConfig)
    .configureEventsEmitter(KAFKA_EVENTS_TOPIC_NAME, { /* use default config */ })
    .enableMetrics(customMetrics)
    .build()
  log.info({ event: 'START' }, 'initialized flow manager client')


  // TODO: insert your commands below
  client.onCommand(COMMANDS.RETURN_SAME, returnSame.handler, returnSame.onError)


  // TODO: register plugins that emits events through the flow manager client
  service.register(ping())


  service.decorate('fmClient', client)
  service.addHook('onClose', async() => {
    log.fatal({ event: 'END' })
    await client.stop()
  })

  await client.start()
  log.info({ event: 'READY' })
})

function prepareKafkaConfig(config) {
  const {
    KAFKA_BROKERS_LIST,
    KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID,
    KAFKA_AUTH_METHOD,
    KAFKA_SASL_USERNAME,
    KAFKA_SASL_PASSWORD,
  } = config

  return {
    kafkaConfig: {
      // a random suffix is added to the client id,
      // so that it can be recognized by Kafka monitoring tools
      clientId: `${KAFKA_CLIENT_ID}-${randomString(7)}`,
      brokers: KAFKA_BROKERS_LIST,
      authMechanism: KAFKA_AUTH_METHOD,
      username: KAFKA_SASL_USERNAME,
      password: KAFKA_SASL_PASSWORD,
    },
    consumerConfig: {
      groupId: KAFKA_GROUP_ID,
    },
  }
}
