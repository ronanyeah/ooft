# ooft

Takes an image file and shrinks it to the size of your liking, in a promise. Only usable on the front end at the moment due to it using several browser APIs, and will likely have trouble with any IE before 11. Also due to being 'required' it needs to be used alongside [`browserify`](https://www.npmjs.com/package/browserify) or [`webpack`](https://www.npmjs.com/package/webpack).

### Example Usage:

```
var options = {

  // Desired file size in MB.
  // Required.
  outputSize: 2,

  // Percentage buffer acceptable for output size.
  // Default is 10.
  buffer: 10,

  // Desired format, 'jpg' or 'png'.
  // Default is 'jpg'.
  format: 'jpg'

};
```
```
var ooft = require('ooft');

ooft(file, options)
.then(function(data) {
  //http://stackoverflow.com/questions/21044798/how-to-use-formdata-for-ajax-file-upload
  var formData = new FormData();
  formData.append('image', data);

  $.ajax({
    method: 'POST',
    url: '/upload',
    data: formData,
    // THIS MUST BE SET FOR FILE UPLOADING
    contentType: false,
    processData: false
  });

})
.catch(function(err) {
  console.log(err);
});
```
