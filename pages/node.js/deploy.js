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
*     index.js
*     当模块的文件名是index.js，加载模块时可以使用模块所在目录的路径代替模块文件路径,
*     就只需要把包目录路径传递给require函数，感觉上整个目录被当作单个模块使用，更有整体感。
*
*     package.json
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
*     使用NodeJS编写的东西，要么是一个包，要么是一个命令行程序，而前者最终也会用于开发后者。
*     因此我们在部署代码时需要一些技巧，让用户觉得自己是在使用一个命令行程序。
*     Windows下:
*     假设node-echo.js存放在C:\Users\user\bin目录，并且该目录已经添加到PATH环境变量里了。
*     接下来需要在该目录下新建一个名为 node-echo.cmd 的文件，文件内容如下：
*     @node "C:\User\user\bin\node-echo.js" %*
*     这样处理后，我们就可以在任何目录下使用node-echo命令了。
*/