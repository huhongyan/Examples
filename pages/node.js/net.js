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

/*
*   'http'ģ���ṩ����ʹ�÷�ʽ��
*       ��Ϊ�����ʹ��ʱ������һ��HTTP������������HTTP�ͻ������󲢷�����Ӧ��
*       ��Ϊ�ͻ���ʹ��ʱ������һ��HTTP�ͻ������󣬻�ȡ�������Ӧ��
*
*   ������Ҫʹ��.createServer��������һ����������Ȼ�����.listen���������˿ڡ�
*   ֮��ÿ������һ���ͻ������󣬴���������ʱ����Ļص������ͱ�����һ�Ρ�
*   ���Կ���������һ���¼����ơ�
*
*   1�������ģʽ����ι���:
*
*   HTTP����������һ����������������ͷ��headers���������壨body�����
*   HTTP�����ڷ��͸�������ʱ��������Ϊ�ǰ��մ�ͷ��β��˳��һ���ֽ�һ���ֽڵ�����������ʽ���͵ġ�
*   ��httpģ�鴴����HTTP�������ڽ��յ�����������ͷ�󣬾ͻ���ûص�������
*   �ڻص������У����˿���ʹ��request�����������ͷ�����⣬���ܰ�request������һ��ֻ�����������������������ݡ�
*
*   HTTP��Ӧ������Ҳ��һ����������ͬ������Ӧͷ��headers������Ӧ�壨body����ɡ�
*   �ڻص������У����˿���ʹ��response������д����Ӧͷ�����⣬���ܰ�response������һ��ֻд��������д����Ӧ�����ݡ�
*/
//  ���������������У������ԭ�����ͻ�����������������ݷ��ظ��ͻ��ˡ�
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
*   2���ͻ���ģʽ����ι���
*
*   Ϊ�˷���һ���ͻ���HTTP����������Ҫָ��Ŀ���������λ�ò���������ͷ��������
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
*   .request����������һ���ͻ��ˣ���ָ������Ŀ�������ͷ���ݡ�
*   ֮�󣬾Ϳ��԰�request������һ��ֻд��������д�����������ݺͽ�������
*   ���⣬����HTTP������GET�����������һ�֣����Ҳ���Ҫ�����壬���httpģ��Ҳ�ṩ�����±��API��
*   http.get('http://www.example.com/', function (response) {});
*
*   ���ͻ��˷������󲢽��յ������ķ������Ӧͷʱ���ͻ���ûص�������
*   �ڻص������У����˿���ʹ��response���������Ӧͷ�����⣬���ܰ�response������һ��ֻ����������������Ӧ�����ݡ�
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
*   httpsģ����httpģ�鼫Ϊ���ƣ���������httpsģ����Ҫ���⴦��SSL֤�顣
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