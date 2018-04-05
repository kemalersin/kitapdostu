/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import _ from 'lodash';
import MatchingEvents from './matching.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`matching:${event}`, socket);

    MatchingEvents.on(event, listener);
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
    MatchingEvents.removeListener(event, listener);
  };
}
