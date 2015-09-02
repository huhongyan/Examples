/*
*   模块路径解析规则
*
*   1、内置模块
*   如果传递给require函数的是NodeJS内置模块名称，不做路径解析，直接返回内部模块的导出对象，例如require('fs')。
*
*   2、node_modules目录
*   NodeJS定义了一个特殊的node_modules目录用于存放模块。
*   例如某个模块的绝对路径是/home/user/hello.js，在该模块中使用require('foo/bar')方式加载模块时，
*   则NodeJS依次尝试使用以下路径。
*    /home/user/node_modules/foo/bar
*    /home/node_modules/foo/bar
*    /node_modules/foo/bar
*
*    3、NODE_PATH环境变量
*    与PATH环境变量类似，NodeJS允许通过NODE_PATH环境变量来指定额外的模块搜索路径。
*    NODE_PATH环境变量中包含一到多个目录路径，路径之间在unix下使用:分隔，在Windows下使用;分隔。
*    例如定义了以下NODE_PATH环境变量：   NODE_PATH=/home/user/lib:/home/lib
*    当使用require('foo/bar')的方式加载模块时，则NodeJS依次尝试以下路径。
*    /home/user/lib/foo/bar
*     /home/lib/foo/bar
*
*   --------------------------------------------------------------------------------------------------------------------
*
*     包（package）
*
*     我们已经知道了JS模块的基本单位是单个JS文件，但复杂些的模块往往由多个子模块组成。
*     为了便于管理和使用，我们可以把由多个子模块组成的大模块称做包，并把所有子模块放在同一个目录里。
*     在组成一个包的所有子模块中，需要有一个入口模块，入口模块的导出对象被作为包的导出对象。
*     在其它模块里使用包的时候，需要加载包的入口模块。
*
*     1、index.js
*     当模块的文件名是index.js，加载模块时可以使用模块所在目录的路径代替模块文件路径,
*     就只需要把包目录路径传递给require函数，感觉上整个目录被当作单个模块使用，更有整体感。
*
*     2、package.json
*     如果想自定义入口模块的文件名和存放位置，就需要在包目录下包含一个package.json文件，并在其中指定入口模块的路径。
*     其内容可以例如:
*       {
*           "name": "cat",
*           "main": "./lib/main.js"
*       }
*     如此一来，就同样可以使用require('/home/user/lib/cat')的方式加载模块。
*     NodeJS会根据包目录下的package.json找到入口模块所在位置。
*
*     命令行程序
*
*     使用NodeJS编写的东西，要么是一个包，要么是一个命令行程序，而前者最终也会用于开发后者。
*     因此我们在部署代码时需要一些技巧，让用户觉得自己是在使用一个命令行程序。
*     Windows下:
*     假设node-echo.js存放在C:\Users\user\bin目录，并且该目录已经添加到PATH环境变量里了。
*     接下来需要在该目录下新建一个名为 node-echo.cmd 的文件，文件内容如下：
*     @node "C:\User\user\bin\node-echo.js" %*
*     这样处理后，我们就可以在任何目录下使用node-echo命令了。
*
*     工程目录
*
*     以编写一个命令行程序为例，一般我们会同时提供命令行模式和API模式两种使用方式，并且我们会借助三方包来编写代码。
*     除了代码外，一个完整的程序也应该有自己的文档和测试用例。因此，一个标准的工程目录都看起来像下边这样。
*     - /home/user/workspace/node-echo/   # 工程目录
*        - bin/                          # 存放命令行相关代码
*           node-echo
*        + doc/                          # 存放文档
*        - lib/                          # 存放API相关代码
*            echo.js
*        - node_modules/                 # 存放三方包
*            + argv/
*        + tests/                        # 存放测试用例
*        package.json                    # 元数据文件
*        README.md                       # 说明文件
*
*        NPM
*
*        NPM是随同NodeJS一起安装的包管理工具，能解决NodeJS代码部署上的很多问题，常见的使用场景有以下几种：
*           允许用户从NPM服务器下载别人编写的三方包到本地使用。
*           允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用。
*           允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。
*        可以看到，NPM建立了一个NodeJS生态圈，NodeJS开发者和用户可以在里边互通有无。
*
*       1、下载三方包
*       例如 $ npm install argv  下载好之后，argv包就放在了工程目录下的node_modules目录中，
*       因此在代码中只需要通过require('argv')的方式就好，无需指定三方包路径。
*       以上命令默认下载最新版三方包，如果想要下载指定版本的话，可以在包名后边加上@<version>
*       NPM对package.json的字段做了扩展，允许在其中申明三方包依赖
*
*       2、安装命令行程序
*       从NPM服务上下载安装一个命令行程序的方法与三方包类似。
*       例如node-echo提供了命令行使用方式，只要node-echo自己配置好了相关的package.json字段，
*       对于用户而言，只需要使用以下命令安装程序。
*       $ npm install node-echo -g
*       参数中的-g表示全局安装，并且NPM会自动创建好*nix系统下需要的软链文件或Windows系统下需要的.cmd文件。
*
*       3、发布代码
*       第一次使用NPM发布代码前需要注册一个账号。
*       终端下运行npm adduser，之后按照提示做即可。
*       账号搞定后，接着我们需要编辑package.json文件，加入NPM必需的字段。
*       接着上边node-echo的例子，package.json里必要的字段如下。
*       {
            "name": "node-echo",           # 包名，在NPM服务器上须要保持唯一
            "version": "1.0.0",            # 当前版本号
            "dependencies": {              # 三方包依赖，需要指定包名和版本号
                "argv": "0.0.2"
             },
             "main": "./lib/echo.js",       # 入口模块位置
             "bin" : {
                "node-echo": "./bin/node-echo"      # 命令行程序名和主模块位置
             }
        }
*       之后，我们就可以在package.json所在目录下运行npm publish发布代码了。
*
*       4、版本号
*       使用NPM下载和发布代码时都会接触到版本号。NPM使用语义版本号来管理代码。
*       语义版本号分为X.Y.Z三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按以下原则更新。
*           I、  如果只是修复bug，需要更新Z位。
*           II、 如果是新增了功能，但是向下兼容，需要更新Y位。
*           III、如果有大变动，向下不兼容，需要更新X位。
*       版本号有了这个保证后，在申明三方包依赖时，除了可依赖于一个固定版本号外，还可依赖于某个范围的版本号。
*       例如"argv": "0.0.x"表示依赖于0.0.x系列的最新版argv。
*
*       5、一些NPM常用命令
*           使用npm help可查看所有命令。
*           使用npm help <command>可查看某条命令的详细帮助，例如npm help install。
*           在package.json所在目录下使用npm install . -g可先在本地安装当前命令行程序，可用于发布前的本地测试。
*           使用npm update <package>可以把当前目录下node_modules子目录里边的对应模块更新至最新版本。
*           使用npm update <package> -g可以把全局安装的对应命令行程序更新至最新版。
*           使用npm cache clear可以清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。
*           使用npm unpublish <package>@<version>可以撤销发布自己发布过的某个版本代码。
*/