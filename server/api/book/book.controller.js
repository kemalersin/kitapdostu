'use strict';

import _ from 'lodash';
import Book from './book.model';
import BookEvents from './book.events';

import {
  respondWithResult,
  patchUpdates,
  removeEntity,
  handleEntityNotFound,
  handleError
} from '../../helpers.js'; 

export function index(req, res) {
  return Book.withMatching(req.user._id)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function tags(req, res) {
  return Book.distinct('tags', {
    user: req.user._id,
    deleted: { $ne: true }
  })
    .sort()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function show(req, res) {
  return Book.withMatching(
      req.user._id,
      req.params.id,
      false,
      true
  )
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function create(req, res) {
  return Book.create(_.assign(req.body, {
    user: req.user._id
  }))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Book.findOneAndUpdate({
    _id: req.params.id,
    user: req.user._id
  }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
  }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Book.findOne({
    _id: req.params.id,
    user: req.user._id
  }).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function destroy(req, res) {
  return Book.findOne({
    _id: req.params.id,
    user: req.user._id
  }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res, BookEvents))
    .catch(handleError(res));
}
