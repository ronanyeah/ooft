'use strict';

let f = require('./methods.js');

module.exports = (source, options) => {

  let mimeType   = options.format === 'png' ? 'image/png' : 'image/jpeg';
  let targetSize = f.getTargetSize(options.outputSize, options.buffer);

  if (!options.outputSize || targetSize >= source.size) {
    return Promise.resolve(source);
  }

  if (!source) { return Promise.reject('ERROR: File must be provided.'); }

  return f.convertImageToBase64(source)
  .then( base64Image => f.shrinkImage(base64Image, targetSize)
    .then( res => f.base64ToBlob(res, mimeType) )
  );

};
