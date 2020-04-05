# Von
> a personal blog for ACG lover
>>一个基于Vue开发的博客，献给所有热爱ACG，热爱生活的人；也算是给几月来坚持不懈的我的奖赏吧

**该项目为重构优化之后的SSR版本，并且以后也只维护该项目，如对旧项目有需要请转[此处](https://github.com/Bersder/nameless-blog)**
## Introduction
整个博客（下称Von）前端完全基于 Vue+Nuxt 开发，后端接口层 php 实现

Von 有如下特点
- 技术上
  - 自适应宽度，**双端适配**（PC+移动）
  - 采用**服务端渲染**（SSR），更好的SEO，容易被收录
  - ...
- 内容上
  - 针对 otaku 的**追番页面**（bangumi同步）
  - 专门的**动态页面**，发送带图动态，分享你的生活
  - ...
  
版本更新记录 [CHANGE_LOG](./CHANGE_LOG.md)

更详细的功能介绍转[博客文章](https://oshinonya.com/archive/code/1)
## Getting Started（待完善
该博客安装分为前端和后端两部分进行
### Back-end
后端需要 LNPM 环境，网上的一键安装应该也可以吧（没试过），如果你也喜欢折腾，可以参考[这篇文章](https://oshinonya.com/archive/code/2)

LNPM 部署并配置好后
- 执行脚本初始化数据库
- 在网站根目录（默认html）中解压该压缩包以初始化文件资源
- 下载对应版本的后端代码放在网站根目录，重命名为`apis`，并按照要求进行配置

接下来安装 nodejs，很简单这里就跳过了，下面给出之后要安装的模块
```bash
npm install vue-cli -g
npm install pm2 -g
```
pm2 是用来托管进程的，能保证你和server的远程连接断开后 nuxt 还在运行。安装完pm2后把执行文件链到 bin 里以在命令行中使用：`ln -s nodejs目录/bin/pm2 /usr/local/bin/pm2` 
___
最后是配置 Nginx 进行反向代理，把对页面的请求交给 nuxt 服务端，对静态资源和接口的请求进行拦截。向 http 块下添加以下配置，部分配置按实际情况添加 or 修改
```nginx
upstream nuxtserver{
    server 127.0.0.1:8080;
    keepalive 64;
}
server {
    listen       80;
    # 网站域名
    server_name  www.xxx.com, xxx.com;
    index  index.html index.htm;
    # 禁止文件(夹)
    location ^~ /node_modules {
        return 404;
    }
    # 静态资源
    location ~ ^/(downloads|music|site|static|tmp|uploads)/ {
        # 网站根目录，下同
        root html_nuxt;
        # 部分文件设置跨域
        expires 7d;
        if ( $uri ~* \.(lrc|json|eot|otf|ttf|woff|woff2|svg)$ ) {
            add_header Access-Control-Allow-Credentials true;
            add_header Access-Control-Allow-Origin http://xxx.com;
            add_header Access-Control-Allow-Headers X-Requested-With;
            add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
        }
    }
    # PHP CGI
    location ~ \.php$ {
        root           html_nuxt;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }

    # 最后交由代理
    location / {
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 1m;
        proxy_connect_timeout 1m;
        proxy_pass http://nuxtserver;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html_nuxt;
    }
}
```
___
另：如果你有 https 的需要可以参考申请免费证书的[教程](https://oshinonya.com/archive/code/3)
### Front-end
前端代码打包前进行自定义修改，都是些个人信息相关的东西（目前这部分信息的修改方式还未独立出来，只能改一次打包一次，未来版本会更新）
- 按需修改 `config/user.conf.js`
- 修改 `pages/about/index.vue` 的模板（关于页面）
- 修改 `pages/links/index.vue` 的模板（友链页面）

然后在项目根目录运行 `npm run build` 打包生成 `.nuxt` 文件夹。将 **.nuxt, nuxt.config.js, package.json, static/static** 上传至服务器网站根目录
### Run

## Support
Nothing Yet
## Author
**Von** © [Bersder](https://github.com/Bersder), Released under the **MIT** License
>[Blog](https://oshinonya.com) · GitHub [@Bersder](https://github.com/Bersder) · Twitter [@nya_oshino](https://twitter.com/nya_oshino) · QQ 1747322151
