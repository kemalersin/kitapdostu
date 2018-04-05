/**
 * Matching model events
 */

'use strict';

import {EventEmitter} from 'events';
var MatchingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MatchingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Matching) {
  for(var e in events) {
    let event = events[e];
    Matching.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    if (event === 'save' && doc.deleted) {
      return;
    }

    MatchingEvents.emit(event + ':' + doc._id, doc);
    MatchingEvents.emit(event, doc);
  };
}

export {registerEvents};
export default MatchingEvents;
