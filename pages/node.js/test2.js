var hello = require('./hello');
hello.hello();
hello.hello = function(){
    console.log('update!');
};