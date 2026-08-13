# Business China YLP Immersion Programme - Shenzhen

这是一个独立的深圳项目申请页面，适合单独部署到新的 GitHub 仓库和新的 Vercel 项目。

## 推荐上线方案

- 代码托管：GitHub
- 页面部署：Vercel
- 申请数据：Supabase

这个方案适合你的原因：

- 学员可直接公开访问页面提交申请
- 你可以在 Supabase 后台查看所有申请记录
- 你可以先筛选合适的申请者，再邀请他们进入付款流程

## 当前表单收集内容

- Full Name
- Email Address
- Contact Number
- Company Name & Designation
- PDPA consent

## 当前项目信息

- Programme: `Business China YLP Immersion Programme - Shenzhen`
- Current stage: `Application collection only`
- Main page: [index.html](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/index.html)
- Success page: [success.html](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/success.html)

## 上线前你要做的事

### 1. 创建 Supabase 项目

登录 [Supabase](https://supabase.com/)，新建一个项目。

### 2. 执行数据库和存储配置 SQL

在 Supabase 的 SQL Editor 中运行：

- [supabase-setup.sql](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/supabase-setup.sql)

这个 SQL 会创建：

- `registrations` 表
- `payment-proofs` 存储桶
- 匿名提交和匿名上传策略

当前页面处于申请收集阶段，不要求上传付款凭证；保留这些字段和存储配置是为了后续恢复付款流程更方便。

### 3. 填写 Supabase 前端配置

打开：

- [config.js](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/config.js)

把下面两个值填进去：

- `supabaseUrl`
- `supabaseAnonKey`

可在 Supabase Project Settings -> API 中找到。

示例：

```js
window.APP_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
  supabaseBucket: "payment-proofs"
};
```

### 4. 推送到 GitHub

把项目代码推到你的 GitHub 仓库。

### 5. 用 Vercel 部署

登录 [Vercel](https://vercel.com/)，选择：

- Add New Project
- 导入你的 GitHub 仓库
- 直接部署

这是纯静态页面，不需要额外构建配置。

### 6. 配置钉钉通知

如果你要在报名成功后把通知发到钉钉群，请在 Vercel 项目的 Environment Variables 中新增：

- `DINGTALK_WEBHOOK_URL`

值就是你的钉钉机器人 webhook URL。

当前项目已经内置通知接口：

- `api/dingtalk-notify.js`

它会在 Supabase 写入成功后，向钉钉发送一条包含 `signup` 关键词的申请提醒消息。

## 学员提交后，数据会去哪里

- 申请表数据：Supabase 表 `registrations`
- 当前阶段不上传付款截图

前端提交逻辑在：

- [script.js](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/script.js)

## 当前筛选阶段如何查看申请

你当前主要会用到这些字段：

- `full_name`
- `email`
- `created_at`
- `company_designation`
- `status`

## 当前按钮和页面说明

- 页面当前不显示付款信息
- 提交按钮文案为 `Submit Application`
- 提交成功后会跳转到独立成功页 `success.html`

## 当前项目结构

这个独立项目只保留深圳这一套页面和素材：

- 主页面： [index.html](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/index.html)
- 成功页： [success.html](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/success.html)
- 样式： [styles.css](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/styles.css)
- 提交逻辑： [script.js](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/script.js)
- 素材目录： `public/clients/business-china-ylp-shenzhen/`

## 本地预览

如果你只想看页面：

- 直接打开 [index.html](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/index.html)

如果你要测试真实提交：

- 先完成 Supabase 配置
- 再把页面部署出去，或本地用服务器方式打开

## 目前我已经帮你准备好的文件

- 页面： [index.html](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/index.html)
- 成功页： [success.html](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/success.html)
- 样式： [styles.css](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/styles.css)
- 提交逻辑： [script.js](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/script.js)
- Supabase 配置： [config.js](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/config.js)
- Supabase 建表 SQL： [supabase-setup.sql](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/supabase-setup.sql)

## 你现在离上线只差这几步

1. 注册并登录 Supabase
2. 运行 SQL
3. 把 Supabase URL 和 anon key 填进 `public/config.js`
4. 推到 GitHub
5. 在 Vercel 导入仓库并部署

如果你把 Supabase 项目建好，我下一步可以继续直接带你逐步完成：

- SQL 要粘贴到哪里
- `config.js` 要填什么
- Vercel 要点哪里
