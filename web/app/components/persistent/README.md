# 持久化功能

本功能用于处理文档数据并将处理后的数据持久化存储到数据库和知识库中。

## 已完成工作

1. 创建了持久化标签页和文件上传界面
   - 实现了文件选择和上传UI
   - 添加了数据库选择功能（MongoDB/MySQL）
   - 实现了数据库连接配置UI
   - 添加了测试数据库连接功能
   - 实现了文件处理状态和进度显示

2. 设计了后端API
   - `/api/persistent` 端点用于处理文件上传、解析和存储
   - `/api/persistent/test-connection` 端点用于测试数据库连接
   - 设计了与外部文件解析服务的集成
   - 支持多种数据库存储选项

3. 集成了文件处理流程
   - 文件上传
   - 调用文件解析服务
   - 根据用户选择将内容存储到不同数据库
   - 可选保存到知识库

## 待完成工作

1. 依赖项安装
   - 需要在项目中添加 `mongodb`, `mysql2` 和 `@supabase/supabase-js` 依赖
   - 安装命令: `npm install mongodb mysql2 @supabase/supabase-js --save`
   - 由于项目依赖冲突，可能需要手动在 package.json 中添加依赖并解决冲突

2. 后端API实现完善
   - 处理文件大小限制
   - 添加错误处理和日志记录
   - 实现知识库集成逻辑

3. 数据模型定义
   - 定义MongoDB集合结构
   - 定义MySQL表结构
   - 定义知识库数据结构

4. 安全性增强
   - 添加身份验证和授权
   - 输入验证和净化
   - 数据库连接安全性

5. 用户界面优化
   - 添加文件类型过滤
   - 优化进度显示
   - 添加历史记录查看

6. 测试
   - 单元测试
   - 集成测试
   - 性能测试

## 使用说明

1. 点击"持久化"标签页
2. 选择要使用的数据库类型（MongoDB 或 MySQL）
3. 配置所选数据库的连接信息
4. 点击"测试连接"按钮确认数据库连接正常
5. 上传文件
6. 选择是否同时保存到现有知识库
7. 点击"开始处理"按钮

## API参考

### 文件解析服务

```bash
curl -X 'POST' \
  'http://192.168.2.221:8765/file_parse?parse_method=auto&is_json_md_dump=true&output_dir=output&return_layout=false&return_info=false&return_content_list=false&return_images=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@your_file.pdf;type=application/pdf'
```

### 持久化API

```
POST /api/persistent
Content-Type: multipart/form-data

file: [文件]
dbType: ["mongo"|"mysql"]

# MongoDB连接信息（当dbType为mongo时）
mongoUri: [MongoDB连接URI]
mongoDatabase: [MongoDB数据库名]

# MySQL连接信息（当dbType为mysql时）
mysqlHost: [MySQL主机]
mysqlPort: [MySQL端口]
mysqlUsername: [MySQL用户名]
mysqlPassword: [MySQL密码]
mysqlDatabase: [MySQL数据库名]

saveToKnowledgeBase: [true/false]
```

响应示例 (MongoDB):
```json
{
  "success": true,
  "message": "文件处理成功",
  "documentId": "文档ID",
  "dbType": "mongodb"
}
```

响应示例 (MySQL):
```json
{
  "success": true,
  "message": "文件处理成功",
  "documentId": 123,
  "dbType": "mysql"
}
```

### 测试数据库连接API

```
POST /api/persistent/test-connection
Content-Type: multipart/form-data

dbType: ["mongo"|"mysql"]

# MongoDB连接信息（当dbType为mongo时）
mongoUri: [MongoDB连接URI]
mongoDatabase: [MongoDB数据库名]

# MySQL连接信息（当dbType为mysql时）
mysqlHost: [MySQL主机]
mysqlPort: [MySQL端口]
mysqlUsername: [MySQL用户名]
mysqlPassword: [MySQL密码]
mysqlDatabase: [MySQL数据库名]
```

响应示例 (成功):
```json
{
  "success": true,
  "message": "数据库连接成功",
  "database": "数据库名称"
}
```

响应示例 (失败):
```json
{
  "error": "连接数据库失败",
  "details": "错误详情"
}
``` 