/*
 *  �������
 *
 *  NodeJS��������;�Ǳ�д������Web��������
 */

//ʹ��NodeJS���õ�httpģ���ʵ��һ��HTTP������
var http = require('http');

//���ϳ��򴴽���һ��HTTP������������8124�˿ڣ�����������ʸö˿�http://127.0.0.1:8124/���ܹ�����Ч����
//��*nixϵͳ�£�����1024���¶˿���ҪrootȨ�ޡ���ˣ���������80��443�˿ڵĻ�����Ҫʹ��sudo������������
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text-plain' });
    response.end('Hello World\n');
}).listen(8124);
