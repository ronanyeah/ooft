module.exports = function(source, outputFileSize, outputFormat) {

  return new Promise(function(resolve, reject) {

    var mimeType = setFileType(outputFormat);
    var quality = 95;

    convertImageToBase64(source).then(function(base64Image) {

      if (outputFileSize === 'max') {
        return resolve(base64Image);
      }

      outputFileSize *= 1000000; // Converting MB to B.
      outputFileSize *= 1.1; // Add a ten percent buffer.

      if (outputFileSize > source.size) {
        return resolve(base64Image);
      }

      getImageDimensions(base64Image).then(function(dimensions) {
        var cvs = document.createElement('canvas');

        cvs.width = dimensions.width;
        cvs.height = dimensions.height;

        var context = cvs.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function() {
          context.drawImage(imageObj, 0, 0);
          var redrawnImage = cvs.toDataURL(mimeType, quality/100);

          // Base64 encoded images are 1.33 times larger than once they are saved to disk.
          if (redrawnImage.length / 1.33 > outputFileSize) {
            quality -= 5;
            imageObj.src = base64Image;
          } else {
            resolve(redrawnImage);
          }
        };

        imageObj.src = base64Image;
      });

    });

  })

  function getImageDimensions(image) {
    return new Promise(function(resolve, reject) {
      var imageElement = document.createElement('img');

      imageElement.onload = function() {
        resolve({height: imageElement.naturalHeight, width: imageElement.naturalWidth});
      }

      imageElement.src = image;
    });
  }

  function convertImageToBase64(source) {
    var fileReader = new FileReader();

    return new Promise(function(resolve, reject) {

      fileReader.onload = function(fileLoadedEvent) {

        resolve(fileLoadedEvent.target.result);

      }

      fileReader.readAsDataURL(source);

    });
  }

  function setFileType(outputFormat) {
    return outputFormat === 'png' ? 'image/png' : 'image/jpeg';
  }

}
