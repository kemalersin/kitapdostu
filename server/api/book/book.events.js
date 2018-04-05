'use strict';

import Book from './book.model';
import {EventEmitter} from 'events';

var BookEvents = new EventEmitter();

BookEvents.setMaxListeners(0);

var events = {
  save: 'save',
  remove: 'remove'
};

function registerEvents(Book) {
  for(var e in events) {
    let event = events[e];
    Book.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    if (event === 'save' && doc.deleted) {
      return;
    }

    Book.withMatching(doc.user, doc._id)
      .then((book) => {
        BookEvents.emit(event + ':' + book._id, book);
        BookEvents.emit(event, book);
      });    
  };
}

export {registerEvents};
export default BookEvents;
