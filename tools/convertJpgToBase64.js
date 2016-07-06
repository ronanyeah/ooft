'use strict';

let fs   = require('fs');
let file = process.env.FILE;

let img = fs.readFileSync(`./${file}.jpg`);

fs.writeFileSync(
  `${file}.js`,
  `module.exports = "data:image/jpeg;base64,${new Buffer(img).toString('base64')}";`
);
