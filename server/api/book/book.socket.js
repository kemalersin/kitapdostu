'use strict';

import _ from 'lodash';
import BookEvents from './book.events';

var events = ['save', 'remove'];

export function register(socket) {
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`book:${event}`, socket);

    BookEvents.on(event, listener);
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
    BookEvents.removeListener(event, listener);
  };
}
