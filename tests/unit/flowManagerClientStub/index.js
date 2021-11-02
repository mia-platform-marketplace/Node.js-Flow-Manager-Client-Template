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

const FlowManagerClientStub = require('./flowManagerClientStub')
const pluginBuilder = require('../../../plugin')

class ClientBuilder {
  constructor(log, kafkaConfig) {
    this.log = log
    this.kafkaConfig = kafkaConfig
  }

  configureCommandsExecutor() {
    return this
  }

  configureEventsEmitter() {
    return this
  }

  enableMetrics(prometheusMetrics) {
    this.metrics = prometheusMetrics
    return this
  }

  build() {
    return new FlowManagerClientStub()
  }
}

// this allows to instantiate the same identical plugin,
// but using a stubbed version of the flow-manager client for test purposes
module.exports = pluginBuilder(ClientBuilder)
