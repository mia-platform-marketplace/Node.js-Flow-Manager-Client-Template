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

const { EVENTS } = require('../constants')

const pingSchema = {
  tags: ['<flow-manager-client-template>'],
  consumes: ['application/json'],
  produces: ['application/json'],
  params: {
    type: 'object',
    required: ['sagaId'],
    properties: {
      sagaId: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        sagaId: {
          type: 'string',
        },
        msg: {
          type: 'string',
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        sagaId: {
          type: 'string',
          nullable: true,
        },
        msg: {
          type: 'string',
        },
      },
    },
  },
}

function ping() {
  return async service => {
    const { log, fmClient } = service

    service.addRawCustomPlugin(
      'GET',
      '/ping/:sagaId',
      pong(log, fmClient),
      pingSchema,
    )
  }
}

function pong(log, client) {
  return async(req, res) => {
    const { sagaId } = req.params

    if (!sagaId) {
      return res.code(400).send({ sagaId: null, msg: 'out' })
    }

    try {
      // Note: this is the important line where the communication with the Flow Manager happens
      await client.emit(EVENTS.PONG, sagaId, { msg: 'this is the way' })
    } catch (error) {
      res.code(400).send({ sagaId, msg: 'net' })
    }

    res.send({ sagaId, msg: 'pong' })
  }
}

module.exports = ping
