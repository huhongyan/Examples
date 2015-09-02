/*
 *  网络操作
 *
 *  NodeJS本来的用途是编写高性能Web服务器。
 */

//使用NodeJS内置的http模块简单实现一个HTTP服务器
var http = require('http');

//以上程序创建了一个HTTP服务器并监听8124端口，打开浏览器访问该端口http://127.0.0.1:8124/就能够看到效果。
//在*nix系统下，监听1024以下端口需要root权限。因此，如果想监听80或443端口的话，需要使用sudo命令启动程序。
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text-plain' });
    response.end('Hello World\n');
}).listen(8124);
