'use strict';

import _ from 'lodash';
import ReaderEvents from './reader.events';

var events = ['save', 'remove'];

export function register(socket) {
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`reader:${event}`, socket);

    ReaderEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}

function createListener(event, socket) {
  return function(doc) {
    if (_.has(socket.rooms, doc.user)) {
      socket.emit(event, doc);
    }
  };
}

function removeListener(event, listener) {
  return function() {
    ReaderEvents.removeListener(event, listener);
  };
}
