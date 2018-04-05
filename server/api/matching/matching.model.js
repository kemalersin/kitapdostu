'use strict';

import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import {registerEvents} from './matching.events';

import Book from '../book/book.model.js';
import Reader from '../reader/reader.model.js';

var MatchingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  reader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reader'
  },
  status: {
    type: Number,
    default: 1
  },
  guid: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  finishDate: Date
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

MatchingSchema.post('save', (matching, next) => {
  Book.findById(matching.book)
    .then((book) => {
      if (book) {
        book.matched = !matching.deleted && matching.status === 1;
        book.save();
      }

      next();
    });
});

MatchingSchema.post('save', (matching, next) => {
  Reader.findById(matching.reader)
    .then((reader) => {
      if (reader) {
        reader.matched = !matching.deleted && matching.status === 1
        reader.save();
      } 

      next();
    });
});

MatchingSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

registerEvents(MatchingSchema);
export default mongoose.model('Matching', MatchingSchema);
