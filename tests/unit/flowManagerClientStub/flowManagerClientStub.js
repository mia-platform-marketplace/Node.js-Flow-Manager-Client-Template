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

class FlowManagerClientStub {
  constructor() {
    this.commandsHandlersMap = new Map()
    this._eventsEmitted = 0
    this._events = []
    this._errorOnEmit = false
    this._committedOnError = false
  }

  onCommand(command, handler, onError) {
    this.commandsHandlersMap.set(command, { handler, onError })
  }

  async start() { /* no-op */ }
  async stop() { /* no-op */ }

  /* istanbul ignore next */
  async emit(event, sagaId, metadata = {}) {
    if (this._errorOnEmit) {
      throw new Error(`error on emitting event ${event}`)
    }
    this._events.push({
      event,
      sagaId,
      metadata,
    })
  }

  clearEvents() {
    this._events = []
  }

  getEvents() {
    return this._events
  }

  /* istanbul ignore next */
  setErrorOnEmit() {
    this._errorOnEmit = true
  }

  clearErrorOnEmit() {
    this._errorOnEmit = false
    this._committedOnError = false
  }

  getCommittedOnError() {
    return this._committedOnError
  }

  async simulateCommandReception(command, idSaga, metadata) {
    const { handler, onError } = this.commandsHandlersMap.get(command)
    try {
      await handler(idSaga, metadata, async(event, payload) => { await this.emit(event, idSaga, payload) })
    } catch (error) {
      /* istanbul ignore next */
      await onError(idSaga, error, () => { this._committedOnError = true })
      /* istanbul ignore next */
      return error
    }
  }
}

module.exports = FlowManagerClientStub
