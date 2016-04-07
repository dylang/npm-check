#!/usr/bin/env node

var isEs2015;
try {
    isEs2015 = new Function('() => {}');
} catch (e) {
    isEs2015 = false;
}
isEs2015 ? require('../lib/cli') : require('../lib-es5/cli');
