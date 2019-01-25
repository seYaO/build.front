# git

## git初始化
```bash
# 1. 创建git配置:  
$ git init
# 2. 把当前所有文件加入到本地git库:  
$ git add .
# 3. 确认加入文件到本地git库:  
$ git commit -m '写一些注释'
# 4. 把本地项目与远程git库关联:  
$ git remote add origin git@github.com:seYaO/XXX.git
# 5. 提交本地库中的文件到远程git库中:  
$ git push -u origin master
```

## git命令

```bash
# 克隆
$ git clone git@github.com:seYaO/XXX.git

# 拉取
$ git pull

# 合并
git merge 其他分支 （到当前分支）

# 克隆指定分支
$ git clone -b v2.8.1 git@github.com:seYaO/XXX.git

# 创建本地分支
$ git checkout -b <branchName>

# 删除本地分支 （需要切换到其他分支进行操作）
$ git branch -d <branchName>

# 删除远程分支
$ git push origin --delete <branchName>

# 查看远程分支
$ git branch -r

# 拉取远程分支并创建本地分支
$ git checkout -b 本地分支名 origin/远程分支名
# 或
$ git fetch origin 远程分支名:本地分支名

# git中本地与远程库的关联与取消
$ git remote add origin git@github.com:seYaO/XXX.git (在本地目录下关联远程repository)
$ git remote remove origin (取消本地目录下关联的远程库)
```

## git tag命令
```bash
# 查看所有的tag
$ git tag

# 创建带注释的标签
$ git tag -a <branchName> -m '注释内容'

# 上传tag
$ git push origin <branchName>

# 上传所有tag
$ git push origin --tags

# 删除本地tag
$ git tag -d <branchName>

# 删除远程tag
$ git push origin --delete tag <branchName>
```

## git base常用命令
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

## 建立项目
登录GitHub后，找到`New Repository`，填入`项目名称、说明、网址`，创建后，记下`git@github.com:xxx/xxx.git`的地址。
- 注：需要自行安装Git

## 配置Git
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

## 创建项目的过程
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

## .gitignore
- 配置语法
    - 以斜杠“/”开头表示目录；
    - 以星号“*”通配多个字符；
    - 以问号“?”通配单个字符；
    - 以方括号“[]”包含单个字符的匹配列表；
    - 以叹号“!”表示不忽略(跟踪)匹配到的文件或目录；
    
 此外，git 对于 .ignore 配置文件是按行从上到下进行规则匹配的，意味着如果前面的规则匹配的范围更大，则后面的规则将不会生效；
- 示例
    1. 规则：
    ```bash
    fd1/*
    # 说明：忽略目录 fd1 下的全部内容；注意，不管是根目录下的 /fd1/ 目录，还是某个子目录 /child/fd1/ 目录，都会被忽略；
    ```
    2. 规则：
    ```bash
    /fd1/*
    # 说明：忽略根目录下的 /fd1/ 目录的全部内容；
    ```
    3. 规则：
    ```bash
    /*
    !.gitignore
    !/fw/bin/
    !/fw/sf/
    # 说明：忽略全部内容，但是不忽略 .gitignore 文件、根目录下的 /fw/bin/ 和 /fw/sf/ 目录；
    ```

## 问题和解决方案
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
## timed out
GitHub是一个通过Git进行版本控制的软件源代码托管服务，有私人仓库和公共仓库，私人仓库是收费的，当然了，我会用公共的。但是当我们用git生成完秘钥，复制到github中，进行本地与github测试是否成功连接的时候，有时会报错：ssh: connect to host github.com port 22: Connection timed out

[![cover](img/d1a20cf431adcbef5bc27666a5af2edda2cc9fdf.jpg)](img/d1a20cf431adcbef5bc27666a5af2edda2cc9fdf.jpg)

#### 在解决超时的问题时，我先说下生成秘钥；长方形框填写，椭圆形不用填回车就行（ssh-keygen -t rsa -C "youremail@example.com"生成秘钥命令）
[![cover](img/caef76094b36acaf0504e19c75d98d1000e99ced.jpg)](img/caef76094b36acaf0504e19c75d98d1000e99ced.jpg)

#### 在我们测试git是否成功连接github时，使用：ssh -T git@github.com，如果出现：You've successfully authenticated，那么恭喜你，连接成功可以使用了。如果出现：ssh: connect to host github.com port 22: Connection timed out，很遗憾连接超时
[![cover](img/f7246b600c338744118a5d1c580fd9f9d72aa007.jpg)](img/f7246b600c338744118a5d1c580fd9f9d72aa007.jpg)

#### 连接超时，首先找到git的安装目录，找到/etc/ssh/ssh_config文件
[![cover](img/0b46f21fbe096b630339233005338744ebf8acaa.jpg)](img/0b46f21fbe096b630339233005338744ebf8acaa.jpg)

#### 用notepad++打开这个文件，如下图：
[![cover](img/b812c8fcc3cec3fd8666da15df88d43f87942771.jpg)](img/b812c8fcc3cec3fd8666da15df88d43f87942771.jpg)

#### 把如下内容复制到ssh_config文件的末尾处：并记得保存
```
Host github.com
User git
Hostname ssh.github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
Port 443
```
如图：
[![cover](img/d000baa1cd11728b332af042c1fcc3cec3fd2c4e.jpg)](img/d000baa1cd11728b332af042c1fcc3cec3fd2c4e.jpg)

#### 在使用：ssh -T git@github.com来测试git是否成功连接github,看成功了，完事。（第一次写，有什么不足之处，请指出，谢谢）
[![cover](img/0e2442a7d933c89546d5e71bd81373f082020022.jpg)](img/0e2442a7d933c89546d5e71bd81373f082020022.jpg)

## 参考链接
- [本地项目上传到github](http://blog.csdn.net/henryrao1221/article/details/41554371)
- [Git Community Book 中文版](http://gitbook.liuhui998.com/index.html)
- [github 导入 gitbook](http://www.jianshu.com/p/fa38ef97431d)





