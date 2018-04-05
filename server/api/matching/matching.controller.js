'use strict';

import _ from 'lodash';
import uid from 'uid';
import async from 'async';
import mongoose from 'mongoose';

import Book from '../book/book.model';
import Reader from '../reader/reader.model';
import Matching from './matching.model';
import MatchingEvents from './matching.events';
import {respondWithResult, patchUpdates, removeEntity, handleEntityNotFound, handleError} from '../../helpers.js'; 

export function create(req, res) {
  Book.unmatched(
    req.user._id,
    req.body.bookTags
  )
    .then((books) => {
      Reader.unmatched(
        req.user._id,
        req.body.readerTags
      )
        .then((readers) => {
          if (_.isEmpty(books) || _.isEmpty(readers)) {
            return res.sendStatus(404);
          }

          let mPrev = [];
          let data = { matching: [] };
          let readersCount = readers.length;

          while (
              (mPrev.length !== readersCount) &&
              !(_.isEmpty(books) || _.isEmpty(readers))
          ) {
            let reader = _.sample(readers);

            let book = _.chain(books)
              .filter((book) => {
                return !_.some(book.matchings, (matching) => {
                  return _.isEqual(matching.reader, reader._id); 
                });  
              })
              .sample()
              .value();

            _.pull(readers, reader);

            if (!book) {
              mPrev.push(reader);
              continue;
            }

            _.pull(books, book);
            _.set(book, 'reader', reader); 
            
            data.matching.push(book);
          }

          _.merge(readers, mPrev);
          _.set(data, 'remains', {books, readers});

          res.status(_.isEmpty(data.matching) ? 404 : 200).json(data);
        })
        .catch(handleError(res))
    }) 
    .catch(handleError(res));
}

export function save(req, res) {
  const guid = uid(10);

  async.eachSeries(req.body.matching, (match, callback) => {
    Matching.update(
      {
        book: match.book,
        status: 1
      },
      {
        status: 2,
        finishDate: new Date()
      }
    ).then((updated) => {
      let matching = new Matching({
        guid,
        user: req.user._id,
        book: match.book,
        reader: match.reader
      });

      matching.save()
        .then(() => {
          callback();
        });
    });
  }, (err) => {
   err ?
     res.status(500).send(err) :
     res.end(); 
  });
}

// Deletes Matching from the DB
export function destroy(req, res) {
  return Matching.findOne({
    _id: req.params.id,
    user: req.user._id
  }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res, MatchingEvents))
    .catch(handleError(res));
}

export function finish(req, res) {
  return Matching
    .findById(req.body._id)
    .then(handleEntityNotFound(res))
    .then((matching) => {
      if (matching) {
        matching.status = 2;
        matching.finishDate = new Date();
        matching.save();
      }

      return res.end();
    })
    .catch(handleError(res));
}
