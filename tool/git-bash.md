### git base常用命令
|  Windows命令   |  Linux命令  |          意义         |
|----------------|-----------  |-----------------------|
|cd e:\xxx       |cd /e/xxx    |切换到xxx目录          |
|cd              |pwd          |显示当前目录路径       |
|dir             |Is           |列出当前目录内容       |
|copy nul xxx.txt|touch xxx.txt|生成名为xxx.txt的空文件|
|del xxx.txt     |rm xxx.txt   |删除xxx.txt文件        |
|md xxx          |mkdir xxx    |建立xxx目录            |
|rd /s xxx       |rm -r xxx    |删除xxx目录            |

---

###### 建立项目
登录GitHub后，找到`New Repository`，填入`项目名称、说明、网址`，创建后，记下`git@github.com:xxx/xxx.git`的地址。
- 注：需要自行安装Git

###### 配置Git
1. 本地创建ssh key
```
$ ssh-keygen -t rsa -C "email"
```
- 目录下生成.ssh文件夹，打开id_rsa.pub，复制key，github中设置SSH Keys
2. 验证是否成功
```
$ ssh -T git@github.com
```
3. 设置username 和 email
```
$ git config --global user.name "your name"
$ git config --global user.email "your email"
```

###### 创建项目的过程
```
$ makdir ~/demo    //创建一个项目demo
$ cd ~/demo    //打开这个项目
$ git init    //初始化
$ touch README
$ git add README    //更新README文件 （分享文件夹里所有代码，add 后面加 "."）
$ git commit -m "Test"    //提交更新，并注释信息"Test"
$ git remote add origin git@github.com:xxx/xxx.git    //连接远程github项目
$ git push -u origin master    //将本地项目更新到github项目上去
$ git pull origin master    //把远程服务器github上面的文件拉下来
```

##### 问题和解决方案
```
输入 $ git remote add origin git@github.com:xxx/xxx.git
提示 fatal: remote origin already exists
// 解决方案：
先输入 $ git remote rm origin
再输入 $ git remote add origin git@github.com:xxx/xxx.git
就不报错了
---
如果输入 $ git remote rm origin 还是报错
提示 error: Could not remove config section 'remote.origin'
我们需要修改gitconfig文件的内容
找到你的github的安装路径，C:\Users\ASUS\AppData\Local\GitHub\PortableGit_ca477551eeb4aea0e4ae9fcd3358bd96720bb5c8\etc
找到你的github的安装路径，打开它把里面的[remote "origin"]那一行删掉就好
```
```
输入 $ ssh -T git@github.com
提示 Permission denied (publickey)
因为新生成的key不能加入 ssh 就会导致连接不上 github
// 解决方案
先输入 $ ssh-agent，再输入 $ ssh-add ~/.ssh/id_key，这样就可以了
---
如果输入 ssh-add ~/.ssh/id_key 还是报错
提示 error: Could not open a connection to your authentication agent.
// 解决方案
key 用 Git GUI 的 ssh 工具生成，这样生成的时候 key 就直接保存在 ssh 中了，不需要再 ssh-add 命令加入了，其它的 user，token 等配置都用命令行来做
---
最好检查一下在你复制 id_rsa.pub 文件的内容时有没有产生多余的空格或空行，有些编辑器会帮你添加这些的 
```
```
输入 $ git push origin master
提示 error: failed to push som refs to ......
// 解决方案
先输入 $ git pull origin master   //先把远程服务器github上面的文件拉下来
再输入 $ git push origin master
如果出现报错 fatal: Couldn't find remote ref master 或者 fatal: 'origin' does not appear to be a git repository 以及 fatal: Could not read from remote repository
则需要重新输入 $ git remote add origin git@github.com:xxx/xxx.git
```
 
