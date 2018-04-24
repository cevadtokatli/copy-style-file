# Copy Style File

Copy style file copies less and css files from source to dist with Webpack. It compiles less to css, then minifies them if you are running in production mode.

**NPM**
```
npm install --save-dev copy-style-file
````

**webpack.config.js**
```
const CopyStyleFile = require('copy-style-file');

plugins : [
	new CopyStyleFile([
		{from:'src/style/style.less', to:'style/style.css'},
		{from:'src/style/util.css', to:'style/util.css'}
	])
]
```