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

/*
*   'http'模块提供两种使用方式：
*       作为服务端使用时，创建一个HTTP服务器，监听HTTP客户端请求并返回响应。
*       作为客户端使用时，发起一个HTTP客户端请求，获取服务端响应。
*
*   首先需要使用.createServer方法创建一个服务器，然后调用.listen方法监听端口。
*   之后，每当来了一个客户端请求，创建服务器时传入的回调函数就被调用一次。
*   可以看出，这是一种事件机制。
*
*   1、服务端模式下如何工作:
*
*   HTTP请求本质上是一个数据流，由请求头（headers）和请求体（body）组成
*   HTTP请求在发送给服务器时，可以认为是按照从头到尾的顺序一个字节一个字节地以数据流方式发送的。
*   而http模块创建的HTTP服务器在接收到完整的请求头后，就会调用回调函数。
*   在回调函数中，除了可以使用request对象访问请求头数据外，还能把request对象当作一个只读数据流来访问请求体数据。
*
*   HTTP响应本质上也是一个数据流，同样由响应头（headers）和响应体（body）组成。
*   在回调函数中，除了可以使用response对象来写入响应头数据外，还能把response对象当作一个只写数据流来写入响应体数据。
*/
//  例如在以下例子中，服务端原样将客户端请求的请求体数据返回给客户端。
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    request.on('data', function (chunk) {
        response.write(chunk);
    });

    request.on('end', function () {
        response.end();
    });
}).listen(80);

/*
*   2、客户端模式下如何工作
*
*   为了发起一个客户端HTTP请求，我们需要指定目标服务器的位置并发送请求头和请求体
*/

var options = {
    hostname: 'www.example.com',
    port: 80,
    path: '/upload',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

var request = http.request(options, function (response) {});

request.write('Hello World');
request.end();

/*
*   .request方法创建了一个客户端，并指定请求目标和请求头数据。
*   之后，就可以把request对象当作一个只写数据流来写入请求体数据和结束请求。
*   另外，由于HTTP请求中GET请求是最常见的一种，并且不需要请求体，因此http模块也提供了以下便捷API。
*   http.get('http://www.example.com/', function (response) {});
*
*   当客户端发送请求并接收到完整的服务端响应头时，就会调用回调函数。
*   在回调函数中，除了可以使用response对象访问响应头数据外，还能把response对象当作一个只读数据流来访问响应体数据。
*/

http.get('http://www.example.com/', function (response) {
    var body = [];

    console.log(response.statusCode);
    console.log(response.headers);

    response.on('data', function (chunk) {
        body.push(chunk);
    });

    response.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
});
/*
*   ----------------------------------------------
 200
 { 'content-type': 'text/html',
 server: 'Apache',
 'content-length': '801',
 date: 'Tue, 05 Nov 2013 06:08:41 GMT',
 connection: 'keep-alive' }
 <!DOCTYPE html>
 ...
* */


/*
*   HTTPS
*
*   https模块与http模块极为类似，区别在于https模块需要额外处理SSL证书。
*
*/

var options = {
    key: fs.readFileSync('./ssl/default.key'),
    cert: fs.readFileSync('./ssl/default.cer')
};

var server = https.createServer(options, function (request, response) {
    // ...
});

/*
*
*
*/