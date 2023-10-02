# EasyFill  
这是一个能让你和 GPT 的对话变得无比流畅的小工具。  

![logo](imgs/logo.jpg)

将 [Easy Fill 油猴脚本](./easyfill_tampermonkey_script.js) 添加到 Tampermonkey 插件后，在 chat.openai.com 页面开启并使用。
（目前只测试过电脑上 Chrome 浏览器的油猴插件，别的环境还没有测试过。后续考虑改造成浏览器插件。）  

鼠标选中文字，或者双击左键，鼠标位置会出现菜单栏。
点击菜单栏中功能项，就会把你选中的内容填入对应模版的 {\_\_PLACE_HOLDER\_\_} 位置并发送。
如果想要编辑后再发送，可以点击右侧的铅笔图标。  

![按钮](imgs/menu.jpg)

点击按钮后所选文字就会被自动填充进预置 prompt 并发送。  

![结果](imgs/result.jpg)

最后一个“设置”可用于修改菜单项。  
目前预置了英语学习功能组。    
欢迎大家补充新的功能组到 tool_templates 下。  
如果你想添加新的功能，只需要把功能组模版粘贴到设置页面里。    

![设置页面](imgs/edit_settings.jpg)

这个工具的便捷之处，在于你可以方便地选取前面讨论的部分内容，并添加详细指导的 prompt，省去了很多来回 copy&paste 的工作。  
可以参考这个[使用示范](https://chat.openai.com/share/56c0665b-7265-47ac-b40a-774bf3fc557e) 理解工具的用途。请注意那些看着就很麻烦的 prompt 都是自动填充模版生成的。

## 功能组文件格式说明：

* 第一行是功能组名称，紧跟着它可以是一些使用说明
* 用 🪄🪄🪄🪄🪄🪄🪄🪄 分隔各个功能组按钮（之所以选择这么奇葩的方式，是为了在一个文件里能够方便写多个 prompt。prompt 啥格式都有，用常规的 json yaml 之类的，写转义字符会写到怀疑人生）
* 🪄🪄🪄🪄🪄🪄🪄🪄 分隔符之后的第一行是按钮名称，然后跟着的就是 prompt 具体内容。
* prompt 中的 {\_\_PLACE_HOLDER\_\_} 会被鼠标选中的页面文字替代掉。


## 联系作者

特别欢迎使用插件的伙伴们和我分享你是怎么用的。工具只是便捷操作的一小步，你组合了 prompt 设计好的工作流，才是发挥 AI 功力的最重要因素。
我有个公众号：南瓜博士，欢迎关注。可以直接在公众号留言，我都会看并回复的。
![南瓜博士](imgs/qrcode.jpeg)  


## 致谢

本插件特别感谢豆爸开发的 [关联学习工具](https://waytoagi.feishu.cn/wiki/XMgawFyCVimUSTkeJvHckF9inLc) 给到的启发。  
我最初做的版本，是把按钮放在页面下方一长排，改成菜单交互的代码是由豆爸贡献的。菜单和对话框的样式也是豆爸做的。



