# ooft

Takes an image file and shrinks it to a size of your liking, using only the wonders of JavaScript. Browser support is not great due it's use of several experimental APIs, especially `Blob` but I'm looking into alternative solutions. Can be used with [`browserify`](https://www.npmjs.com/package/browserify), [`webpack`](https://www.npmjs.com/package/webpack), or `dist/ooft.js` can be included directly in your project.

Why does this exist? I wanted to upload pictures from my phone quickly on a mobile connection and the >3MB images the camera was taking were making it difficult.

### Browser APIs in use
- [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [`FileReader`](https://developer.mozilla.org/en/docs/Web/API/FileReader)

### Example Usage:
```
let options = {

  // Desired output file size in MB.
  // Required.
  outputSize: 2,

  // Percentage accuracy tolerance acceptable for output size.
  // Default is 10%.
  buffer: 10,

  // Desired output format, 'jpg' or 'png'.
  // Default is 'jpg'.
  format: 'jpg'

};
```
```
<input id='imageFile' type='file' name='picture' accept='image/*' capture='camera'>
```
```
let ooft = require('ooft');

let file = document.getElementById('imageFile').files[0];

ooft(file, options)
.then( file => {

  // http://stackoverflow.com/questions/21044798/how-to-use-formdata-for-ajax-file-upload
  var formData = new FormData();
  formData.append('image', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  });

})
.catch( err => console.log(err) );
```

### Issues
- Can be unpredictable with large (~10MB) files.
- Where many resizing cycles are necessary it can be quite slow.

### BONUS!
`tools/convertJpgToBase64.js` can be used to turn a jpg into an importable Base64 string like so:  
`FILE=imageFileName node tools/convertJpgToBase64.js`  
(Leave `.js` off the filename.)
