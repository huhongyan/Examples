# Examples
#### 前端学习的练习项目
======================

## 1. 开发环境配置

需要先安装以下工具

### 1.1 Node.js

去[Node.js官网](http://nodejs.org)下载适合自己操作系统的安装包进行安装。

### 1.2 确保Git在命令行可访问

如果之前安装Git时，没有选中适当选项，需要设置PATH环境变量(例如，在Windows下，需将Git安装目录下的bin目录加入PATH环境变量)，使得git命令在命令行可以访问。

### 1.3 安装前端开发工具

在前面的设置已完成的前提下，打开一个命令窗口，执行以下命令：

	npm install -g grunt-cli
	npm install -g handlebars
	npm install -g bower
	
这一组命令将安装命令行工具:

- grunt：自动任务构建工具，本工程模板用于实现自动监视Handlebars模板的任务

- handlebars：Handlebars模板的预编译工具

- bower：前端资源包管理工具

## 2. 建立页面目录

克隆项目到本地，在开发每一个页面模块时，请在pages目录下建立一个页面模块的目录，并且每个页面模块目录下要有一个templates目录，用于专门放置本页面模块中视图层用到的Handlebars模板源文件和编译后的模板JS。

## 3. RequireJS全局配置

## 4. 模板的编译与使用

在工程根目录下，执行命令

	start grunt watch
	
自己开发的页面模块下的templates目录用于放置当前模块的视图模板，如果不使用上述监视工具或最初刚建立模板源文件时，可以进行手工编译，可采用Git Bash命令窗口执行如下：

	cd <tomcat安装目录>/webapps/Sync10-ui/pages/<页面模块>/templates
	handlebars *.handlebars -a -f templates.amd.js
	
在编写依赖自定义的模块的JS代码中，**注意：依赖中要声明Handlebars依赖，且在templates依赖之前**。例如如下所示：

	//在声明templates依赖之前，必须声明handlebars依赖，即使本模块没有直接使用Handlebars！
	define(['config','jquery','handlebars','templates',],
	function(config, $, Handlebars, templates) {
			……
	});



## 5. 前端包管理工具的使用


本工程模板中已经预制了本项目常用的依赖包，包含：jquery,jqueryui,backbone,requirejs,handlebars等。如果需要引入其他依赖包，可以采用bower包管理工具来安装，例如，加入需引入[jsTree插件](http://www.jstree.com)：

	bower install jstree

以下命令会安装jstree默认版本（通常是指最新稳定版本）。

如果不是要安装默认版本，而是需安装某指定版本的，请先查看可用版本的版本标识，再在install命令行指定版本标识，例如handlebars目前稳定版本为1.3.0，但我们要使用2.0的版本，那么查找handlebars最新版本并安装的命令如下：

	C:\tomcat-7.0.47\Examples>bower info handlebars
	……
	Available versions:
		- 2.0.0
  	……
  	C:\tomcat-7.0.47\Examples>bower install handlebars
  	

	