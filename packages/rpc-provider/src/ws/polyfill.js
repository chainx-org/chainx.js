"use strict";
// Copyright 2017-2018 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// tslint:disable-next-line
if (typeof WebSocket === 'undefined') {
    // @ts-ignore
    global.WebSocket = require('websocket').w3cwebsocket;
}
