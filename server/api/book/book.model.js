'use strict';

import _ from 'lodash';
import async from 'async';

import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import {registerEvents} from './book.events';

import Matching from '../matching/matching.model.js';

var BookSchema = new mongoose.Schema({
  name: String,
  info: String,
  tags: Array,
  matched: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  collation: { locale: 'tr' }
});

BookSchema
  .virtual('matchings', {
    ref: 'Matching',
    localField: '_id',
    foreignField: 'book'
  });

BookSchema.statics = {
  unmatched(user, tags) {
    let query = {
      user,
      matched: { $ne: true }
    };

    if (!_.isEmpty(tags)) {
      _.set(query, 'tags', { $all: tags });
    }

    return this.find(query, 'name tags')
      .populate('matchings', 'reader')
      .lean();
  },

  withMatching(user, _id, withDeleted, withAllMatchings) {
    let query = { user };

    if (_id) {
      _.set(query, '_id', _id);
    }

    let cursor = withDeleted ?
      this.findWithDeleted(query) :
      this.find(query);

    return cursor
      .populate({
        path: 'matchings',
        options: {
          sort: { $natural: -1 },
        },
        populate: {
          path: 'reader',
          select: 'name tags'
        },
        select: 'startDate finishDate status',
      })
      .lean()
      .then((books) => {
        books = _.map(books, (book) => {
          let matching = _.head(book.matchings);
          let reading = _.get(matching, 'status') === 1;

          _.assign(book, { matching, reading });

          return withAllMatchings ?
            book : _.omit(book, 'matchings');
        });

        return _id ? _.head(books) : books;
      });
    }
};

BookSchema.pre('save', function (next) {
  this.name = this.name
    .replace(/i/g, 'İ')
    .toLocaleUpperCase('tr-TR');

  next();
});

BookSchema.post('save', function (book) {
  if (book.deleted) {
    mongoose.model('Book')
      .withMatching(book.user, book._id, true, true)
      .then((book) =>
        async.eachSeries(book.matchings, (matching, callback) =>
          Matching.findById(matching._id)
            .then((matching) => 
              matching.delete()
                .then(() => callback())
            )
        )
      );  
  }
});

BookSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

registerEvents(BookSchema);
export default mongoose.model('Book', BookSchema);
