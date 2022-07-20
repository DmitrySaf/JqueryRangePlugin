import './assets/sass/styles.sass';
import './assets/sass/panel.sass';
import './assets/css/main.css';
import './index.ts';
import './demo/demo';
import './demo/panel/panel.ts';
const ghpages = require('gh-pages');

ghpages.publish('dist');