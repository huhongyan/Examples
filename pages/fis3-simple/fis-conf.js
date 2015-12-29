// �� md5
fis.match('*.{js,css,png}', {
    release: '/static$0',
    url: '/output/static$0',
    useHash: true
});

//����ָ��
fis.match('lib/*', {
    useHash: false
});

// ���� fis-spriter-csssprites ���
fis.match('::package', {
    spriter: fis.plugin('csssprites')
})

// �� CSS ����ͼƬ�ϲ�
fis.match('*.css', {
    // ��ƥ�䵽���ļ��������� `useSprite`
    useSprite: true
});

//fis.match('*.js', {
//    // fis-optimizer-uglify-js �������ѹ����������
//    optimizer: fis.plugin('uglify-js')
//});
//
//fis.match('*.css', {
//    // fis-optimizer-clean-css �������ѹ����������
//    optimizer: fis.plugin('clean-css')
//});
//
//fis.match('*.png', {
//    // fis-optimizer-png-compressor �������ѹ����������
//    optimizer: fis.plugin('png-compressor')
//});

// ��������
fis.media('debug').match('*.{js,css,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
})