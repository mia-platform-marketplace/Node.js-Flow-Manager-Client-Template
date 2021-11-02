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

async function handler(sagaId, metadata, emitEvent) {
  // it is recommended to clone metadata (e.g. using lodash cloneDeep)
  // when necessary to edit them to avoid misleading situations
  // TODO: add here your logic

  // just send an event message with the same payload of the command
  await emitEvent(EVENTS.RETURNED_SAME, metadata)
}

// eslint-disable-next-line no-unused-vars
async function onError(sagaId, error, commit) {
  // By default, in case of any error that prevents command completion do not skip it, but rather re-execute it.
  // This behaviour is acceptable due to the combination of Kafka and the Flow-Manager's finite state machine.
  // The former one guarantees the order across messages with the same key, that is the sagaId,
  // while the latter prevents the duplications of commands when duplicated messages arrives,
  // since the finite state machine must be in a specific state to receive/recognize the incoming event.

  // On the contrary, in the situations where is required to handle errors manually,
  // add here your error handling logic and decide whether to commit
  // (that is skip command execution completed with success) or allow its re-execution
}

module.exports = {
  handler,
  onError,
}
