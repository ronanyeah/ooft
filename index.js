'use strict';

module.exports = function(source, options) {

  return new Promise(function(resolve, reject) {

    var mimeType = setFileType(options.format);
    var quality = 95;

    if (!options.outputSize) return resolve(source);

    if (!source) return reject('ERROR: File must be provided.');

    var targetSize = calculateDesiredFileSize(options.outputSize);

    if (targetSize >= source.size) {
      return resolve(source);
    }

    convertImageToBase64(source).then(function(base64Image) {

      getImageDimensions(base64Image).then(function(dimensions) {
        var cvs      = document.createElement('canvas');
        var context  = cvs.getContext('2d');
        var imageObj = new Image();

        cvs.width = dimensions.width;
        cvs.height = dimensions.height;

        imageObj.onload = function() {

          context.drawImage(imageObj, 0, 0);
          var redrawnImage = cvs.toDataURL(mimeType, quality/100);

          // Base64 encoded images are 1.33 times larger than once they are saved to disk.
          if (redrawnImage.length / 1.33 > targetSize) {
            quality -= 5;
            imageObj.src = base64Image;
          } else {
            resolve(base64ToBlob(redrawnImage));
          }

        };

        imageObj.src = base64Image;

      });

    });

  });

  function calculateDesiredFileSize(size) {
    size *= 1000000; // Converting to B to MB.

    // 10% is default.
    var buffer = options.buffer ? options.buffer / 100 : 0.1;

    return Math.round(size *= 1 + buffer);
  }

  function base64ToBlob(b64Data) {
    // http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    function b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

    // remove leading data:image/jpeg;base64,
    b64Data = b64Data.split(',')[1];

    return b64toBlob(b64Data, 'image/jpg'); // or 'image/png'
  }

  function getImageDimensions(image) {
    return new Promise(function(resolve, reject) {
      var imageElement = document.createElement('img');

      imageElement.onload = function() {
        resolve({height: imageElement.naturalHeight, width: imageElement.naturalWidth});
      };

      imageElement.src = image;
    });
  }

  function convertImageToBase64(source) {
    // if true return var base64Image = original_data.toString('base64');
    var fileReader = new FileReader();

    return new Promise(function(resolve, reject) {

      fileReader.onload = function(fileLoadedEvent) {

        resolve(fileLoadedEvent.target.result);

      };

      fileReader.readAsDataURL(source);

    });
  }

  function setFileType(outputFormat) {
    return outputFormat === 'png' ? 'image/png' : 'image/jpeg';
  }

};
