/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	;(function(global) {
	  global.ooft = __webpack_require__(1);
	})(window);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let f = __webpack_require__(2);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  getTargetSize,
	  base64ToBlob,
	  convertImageToBase64,
	  shrinkImage
	};

	/**
	 * Gets the desired file size for the resize.
	 * @param {number} size Desired size in MB.
	 * @param {number} buffer Range of tolerance for target size, 0-100.
	 * @returns {number} Desired file size in bytes.
	 */
	function getTargetSize(size, buffer) {
	  size *= 1000000; // Converting to MB to B.

	  // 10% is default.
	  buffer = 1 + (buffer ? buffer / 100 : 0.1);

	  return Math.round(size * buffer);
	}

	/**
	 * Rewrites base64 image using canvas until it is down to desired file size.
	 * @param {string} base64Image Base64 image string.
	 * @param {number} targetSize Desired file size in bytes.
	 * @returns {string} Base64 string of resized image.
	 */
	function shrinkImage(base64Image, targetSize) {

	  return new Promise( (resolve, reject) => {

	    let canvas  = document.createElement('canvas');
	    let image   = new Image();

	    image.onload = _ => {

	      canvas.height = image.naturalHeight;
	      canvas.width  = image.naturalWidth;

	      canvas.getContext('2d').drawImage(image, 0, 0);

	      return resolve(shrink(95));

	      function shrink(quality) {
	        let redrawnImage = canvas.toDataURL('image/jpeg', quality/100);

	        // 1. Stop at zero because quality can't get any worse!
	        // 2. Base64 encoded images are 1.33 times larger than once they are converted back to a blob.
	        return quality !== 0 && redrawnImage.length / 1.33 > targetSize ? shrink(quality - 5) : redrawnImage;
	      }

	    };

	    image.src = base64Image;

	  });
	}

	/**
	 * Converts Base64 image into a blob file.
	 * @param {string} base64Image Base64 image string.
	 * @param {string} contentType 'image/jpg' or 'image/png'.
	 * @returns {file} Image file as a blob.
	 */
	function base64ToBlob(base64Image, contentType) {
	  // http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript

	  // Remove leading 'data:image/jpeg;base64,' or 'data:image/png;base64,'
	  base64Image = base64Image.split(',')[1];

	  let byteCharacters = atob(base64Image);

	  // http://stackoverflow.com/questions/6259515/javascript-elegant-way-to-split-string-into-segments-n-characters-long
	  let byteArrays = byteCharacters.match(/[\s\S]{1,512}/g).map( slice => {

	    let byteNumbers = slice.split('').map( x => x.charCodeAt(0) );

	    return new Uint8Array(byteNumbers);
	  });

	  let blob = new Blob(byteArrays, { type: contentType || 'image/jpg' /* or 'image/png' */ });

	  return blob;
	}

	/**
	 * Gets image height and width in pixels.
	 * @param {file} image Image file as a blob.
	 * @returns {string} Base64 image string.
	 */
	function convertImageToBase64(image) {
	  let fileReader = new FileReader();

	  return new Promise( (resolve, reject) => {

	    fileReader.onload = fileLoadedEvent => resolve(fileLoadedEvent.target.result);

	    fileReader.readAsDataURL(image);

	  });
	}


/***/ }
/******/ ]);