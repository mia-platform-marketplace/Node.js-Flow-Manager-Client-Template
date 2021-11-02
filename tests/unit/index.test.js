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

const {
  returnSame,
  ping,
} = require('../fixtures')
const { COMMANDS } = require('../../plugin/constants')

tap.test('Flow Manager Client Template', async t => {
  nock.disableNetConnect()
  // verify that no calls are performed other than the expected ones
  nock.emitter.on('no match', (request) => {
    // eslint-disable-next-line no-console
    console.log(request)
    throw new Error('Unexpected HTTP call performed')
  })

  const config = getConfig()
  const service = await startService(config)
  const { fmClient } = service

  t.teardown(async() => {
    await service.close()
    nock.emitter.removeAllListeners()
    nock.enableNetConnect()
  })

  t.test('returnSame command', async t => {
    for (const testData of Object.values(returnSame.mainCases)) {
      const { description, sagaId, metadata, expectedEvents } = testData

      t.test(description, async assert => {
        fmClient.clearEvents()
        fmClient.clearErrorOnEmit()
        await fmClient.simulateCommandReception(COMMANDS.RETURN_SAME, sagaId, metadata)

        const actualEvents = fmClient.getEvents()
        assert.strictSame(actualEvents, expectedEvents)
        assert.end()
      })
    }

    // NOTE: this is a single test
    t.test('error emitting message', async assert => {
      fmClient.clearEvents()
      fmClient.setErrorOnEmit()
      assert.teardown(() => { fmClient.clearErrorOnEmit() })

      const {
        sagaId,
        metadata,
        expectedEvents,
        onErrorCommitted,
      } = returnSame.edgeCases.errorEmittingEvent

      await fmClient.simulateCommandReception(COMMANDS.RETURN_SAME, sagaId, metadata)

      const actualEvents = fmClient.getEvents()
      assert.strictSame(actualEvents, expectedEvents)
      assert.same(fmClient.getCommittedOnError(), onErrorCommitted)
      assert.end()
    })

    t.end()
  })

  t.test('ping event', async t => {
    for (const testData of Object.values(ping.mainCases)) {
      const { description, request, expectedResponse, expectedEvents } = testData

      t.test(description, async assert => {
        fmClient.clearEvents()
        fmClient.clearErrorOnEmit()

        const { statusCode, payload } = await service.inject(request)

        assert.strictSame(statusCode, expectedResponse.status)
        assert.strictSame(JSON.parse(payload), expectedResponse.payload)

        const actualEvents = fmClient.getEvents()
        assert.strictSame(actualEvents, expectedEvents)
        assert.end()
      })
    }

    // NOTE: this is a single test
    t.test('error emitting message', async assert => {
      fmClient.clearEvents()
      fmClient.setErrorOnEmit()
      assert.teardown(() => { fmClient.clearErrorOnEmit() })

      const {
        request,
        expectedResponse,
        expectedEvents,
        onErrorCommitted,
      } = ping.edgeCases.emitError

      const { statusCode, payload } = await service.inject(request)

      assert.strictSame(statusCode, expectedResponse.status)
      assert.strictSame(JSON.parse(payload), expectedResponse.payload)

      const actualEvents = fmClient.getEvents()
      assert.strictSame(actualEvents, expectedEvents)
      assert.same(fmClient.getCommittedOnError(), onErrorCommitted)
      assert.end()
    })

    t.end()
  })

  t.end()
})

async function startService(conf) {
  // NOTE: this launch a customized version of the implemented plugin,
  // which employs a stubbed flow-manager-client for test purposes
  return lc39('./tests/unit/flowManagerClientStub/index.js', {
    logLevel: conf.LOG_LEVEL || 'silent',
    envVariables: conf,
  })
}
