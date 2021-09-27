# 配置文件部署方式实验性特性
- [x] config.json配置文件(数组列表为单独某小时运行,数字为当前小时整除则运行)
- [x] 顺序(同步)执行
- [x] 每个脚本单独config(目前只有timeout)
- [x] 传统Event Msg参数触发
- [x] 配置文件每小时触发
- [x] 单独脚本超时timeout参数
- [x] config_diy.json配置文件(自动merge进config.json,覆盖已经存在的参数)
- [x] 原始require异步触发(params:global:exec参数='async')
- [ ] 单独触发器(某些特殊脚本)

## EXAMPLES:
examples文件夹内有部分diy例子,感兴趣可以看看.
## 注意事项:
jd_cfd_loop已经移除,需要请自己添加至config_diy.json,参考cron:

"jd_cfd_loop": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],

## 实验性特性仅限高级用户!欢迎PR或入群私聊探讨!
## 使用方式:
配置文件部署增加Secrets:EXPERIMENT,值为任意,存在则使用最新的实验性特性.

(如果之前是自己添加的本仓库diy.sh,注意移除之前的diy.sh再使用Secret)

超时建议设置3600(此仓库默认就是)
