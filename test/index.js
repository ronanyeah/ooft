'use strict';

let test = require('tape');

let ooft = require('../src/index.js');
let f    = require('../src/methods.js');

let base64Image = require('./smallImg.js');
let file        = f.base64ToBlob(base64Image);
let bigFile     = f.base64ToBlob(require('./bigImg.js'));

test('Blob being created correctly.', t => {
  t.plan(1);

  let blob = f.base64ToBlob(base64Image);

  t.equals(blob.size, 2119781, 'Correct size');

});

test('Convert image file to base64.', t => {
  t.plan(1);

  f.convertImageToBase64(file)
  .then( b64 => t.equals(b64.length, 2826398, 'Correct size') );

});

test('Calculate desired file size, no buffer.', t => {
  t.plan(1);

  var res = f.getTargetSize(2);

  t.equals(res, 2200000, 'Correct size');

});

test('Calculate desired file size, with buffer.', t => {
  t.plan(1);

  var res = f.getTargetSize(2, 20);

  t.equals(res, 2400000, 'Correct size');

});

test('Integration test', t => {
  t.plan(1);

  let options = {
    outputSize: 1 // 1MB
  };

  ooft(file, options)
  .then( res => {
    t.equals(res.size, 1027133, 'Correct size');
  });

});

test('Large File Integration test', t => {
  t.plan(1);

  let options = {
    outputSize: 5
  };

  ooft(bigFile, options)
  .then( res => {
    t.equals(res.size, 3981296, 'Correct size');
  });

});
