# 配置文件部署方式实验性特性
- [x] config.json配置文件(数组列表为单独某小时运行,数字为当前小时整除则运行)
- [x] 顺序(同步)执行
- [x] 每个脚本单独timeout
- [ ] config_diy,json配置文件(自动merge进config.json,覆盖已经存在的参数)
- [ ] 单独触发器(某些特殊脚本)

**实验性特性仅限高级用户!欢迎PR或入群私聊探讨!**

将diy.sh放入cofnig分支下(确认部署脚本为最新),会自动使用新特性(自动同步此仓库中的新特性),与其他功能不冲突.

所以diy.sh需要手动更新
