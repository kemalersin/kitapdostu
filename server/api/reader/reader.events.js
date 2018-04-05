'use strict';

import Reader from './reader.model';
import {EventEmitter} from 'events';

var ReaderEvents = new EventEmitter();

ReaderEvents.setMaxListeners(0);

var events = {
  save: 'save',
  remove: 'remove'
};

function registerEvents(Reader) {
  for(var e in events) {
    let event = events[e];
    Reader.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    if (event === 'save' && doc.deleted) {
      return;
    }

    Reader.withMatching(doc.user, doc._id)
      .then((reader) => {
        ReaderEvents.emit(event + ':' + reader._id, reader);
        ReaderEvents.emit(event, reader);
      });    
  };
}

export {registerEvents};
export default ReaderEvents;
