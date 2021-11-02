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

const tap = require('tap')
const lc39 = require('@mia-platform/lc39')
const nock = require('nock')

const getConfig = require('../config')
const kafkaCommon = require('./kafkaTestsHelpers')
const { assertMessages } = kafkaCommon

const {
  returnSame,
  ping,
} = require('../fixtures')
const { COMMANDS } = require('../../plugin/constants')

tap.test('Flow Manager Client Template Integration Tests', async t => {
  nock.disableNetConnect()
  // verify that no calls are performed other than the expected ones
  nock.emitter.on('no match', (request) => {
    // eslint-disable-next-line no-console
    console.log(request)
    throw new Error('Unexpected HTTP call performed')
  })

  t.teardown(async() => {
    nock.emitter.removeAllListeners()
    nock.enableNetConnect()
  })

  // NOTE: config and kafka instance are recreated for each command/event set of tests,
  // since it is easier to synchronize during tests rather than removing current consumer
  // and attach a new one. Indeed, rebalancing operations might occur and alter tests flows
  // and sync, so that consumers are not effectively ready to accept messages when they are sent

  t.test('sameResult command', async t => {
    const config = getConfig()

    const {
      kafkaInstance,
      topicsMap,
      kafkaTeardown,
    } = await kafkaCommon.initializeKafkaClient(config)
    const commandIssuer = await kafkaCommon.createProducer(kafkaInstance)

    const service = await startService(config)

    t.teardown(async() => {
      await service.close()
      await commandIssuer.disconnect()
      await kafkaTeardown()
    })

    for (const testData of Object.values(returnSame.mainCases)) {
      const { description, sagaId, metadata, expectedEvents } = testData

      t.test(description, async assert => {
        const {
          waitForReception,
          messagesReceived,
          stopTestConsumer,
        } = await kafkaCommon.messagesReceiver(kafkaInstance, topicsMap.evn, expectedEvents.length)

        assert.teardown(async() => {
          await stopTestConsumer()
        })

        const commandMessage = {
          key: sagaId,
          value: JSON.stringify({
            messageLabel: COMMANDS.RETURN_SAME,
            messagePayload: metadata,
          }),
        }
        const eventMessages = expectedEvents.map(evn => ({
          key: evn.sagaId,
          value: {
            messageLabel: evn.event,
            messagePayload: evn.metadata,
          },
        }))

        await commandIssuer.send({ topic: topicsMap.cmd, messages: [commandMessage] })

        await waitForReception

        assertMessages(assert, messagesReceived, eventMessages)
        assert.end()
      })
    }

    t.end()
  })

  t.test('ping event', async t => {
    const config = getConfig()

    const {
      kafkaInstance,
      topicsMap,
      kafkaTeardown,
    } = await kafkaCommon.initializeKafkaClient(config)
    const commandIssuer = await kafkaCommon.createProducer(kafkaInstance)

    const service = await startService(config)

    t.teardown(async() => {
      await service.close()
      await commandIssuer.disconnect()
      await kafkaTeardown()
    })

    for (const testData of Object.values(ping.mainCases)) {
      const { description, request, expectedResponse, expectedEvents } = testData

      t.test(description, async assert => {
        const {
          waitForReception,
          messagesReceived,
          stopTestConsumer,
        } = await kafkaCommon.messagesReceiver(kafkaInstance, topicsMap.evn, expectedEvents.length)

        assert.teardown(async() => {
          await stopTestConsumer()
        })

        const eventMessages = expectedEvents.map(evn => ({
          key: evn.sagaId,
          value: {
            messageLabel: evn.event,
            messagePayload: evn.metadata,
          },
        }))

        // call the API to emit the expected event
        const { statusCode, payload } = await service.inject(request)

        assert.strictSame(statusCode, expectedResponse.status)
        assert.strictSame(JSON.parse(payload), expectedResponse.payload)

        await waitForReception

        assertMessages(assert, messagesReceived, eventMessages)
        assert.end()
      })
    }

    t.end()
  })

  t.test('status routes:', async t => {
    const config = getConfig()

    const {
      kafkaInstance,
      kafkaTeardown,
    } = await kafkaCommon.initializeKafkaClient(config)
    const commandIssuer = await kafkaCommon.createProducer(kafkaInstance)

    const service = await startService(config)

    t.teardown(async() => {
      await service.close()
      await commandIssuer.disconnect()
      await kafkaTeardown()
    })

    const routes = ['healthz', 'ready']

    for (const route of routes) {
      t.test(route, async assert => {
        const { statusCode } = await service.inject({
          method: 'GET',
          url: `/-/${route}`,
        })
        assert.strictSame(statusCode, 200)
        assert.end()
      })
    }

    t.end()
  })

  t.end()
})

async function startService(conf) {
  return lc39('./index.js', {
    logLevel: conf.LOG_LEVEL || 'silent',
    envVariables: conf,
  })
}
