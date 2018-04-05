'use strict';

import _ from 'lodash';
import async from 'async';

import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import {registerEvents} from './reader.events';

import Matching from '../matching/matching.model.js';

var ReaderSchema = new mongoose.Schema({
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

ReaderSchema
  .virtual('matchings', {
    ref: 'Matching',
    localField: '_id',
    foreignField: 'reader'
  });

ReaderSchema.statics = {
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
          path: 'book',
          select: 'name tags'
        },
        select: 'startDate finishDate status',
      })
      .lean()
      .then((readers) => {
        readers = _.map(readers, (reader) => {
          let matching = _.head(reader.matchings);
          let reading = _.get(matching, 'status') === 1;
          
          _.assign(reader, { matching, reading });

          return withAllMatchings ?
            reader : _.omit(reader, 'matchings');
        });

        return _id ? _.head(readers) : readers;
      });
    }
};

ReaderSchema.pre('save', function (next) {
  this.name = this.name
    .replace(/i/g, 'İ')
    .toLocaleUpperCase('tr-TR');

  next();
});

ReaderSchema.post('save', function (reader) {
  if (reader.deleted) {
    mongoose.model('Reader')
      .withMatching(reader.user, reader._id, true, true)
      .then((reader) =>
        async.eachSeries(reader.matchings, (matching, callback) =>
          Matching.findById(matching._id)
            .then((matching) => 
              matching.delete()
                .then(() => callback())
            )
        )
      );  
  }
});

ReaderSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

registerEvents(ReaderSchema);
export default mongoose.model('Reader', ReaderSchema);
