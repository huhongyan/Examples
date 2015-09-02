/*
 *  �ļ�����
 */

var fs = require("fs");
function copy(src, dst){
    // С�ļ�����
    // fs.writeFileSync(dst, fs.readFileSync(src));

    // ���ļ�����
    // ʹ��fs.createReadStream������һ��Դ�ļ���ֻ����������
    // ��ʹ��fs.createWriteStream������һ��Ŀ���ļ���ֻд������
    // ������pipe����������������������������
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main(argv){
    copy(argv[0], argv[1])
}

// process��һ��ȫ�ֱ�������ͨ��process.argv��������в�����
// ����argv[0]�̶�����NodeJSִ�г���ľ���·����argv[1]�̶�������ģ��ľ���·������˵�һ�������в�����argv[2]���λ�ÿ�ʼ��
main(process.argv.slice(2));
