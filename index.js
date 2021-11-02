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

const { FMClientBuilder, getMetrics } = require('@mia-platform/flow-manager-client')

const pluginBuilder = require('./plugin')

module.exports = pluginBuilder(FMClientBuilder)

// status routes
module.exports.healthinessHandler = function healthinessHandler(service) {
  return { statusOK: service.fmClient.isHealthy() }
}

module.exports.readinessHandler = function readinessHandler(service) {
  return { statusOK: service.fmClient.isReady() }
}

// expose metrics provided by flow-manager-client library
module.exports.getMetrics = getMetrics
