# Business China YLP Immersion Programme - Shenzhen

这是一个独立的深圳项目报名页面，适合单独部署到新的 GitHub 仓库和新的 Vercel 项目。

## 推荐上线方案

- 代码托管：GitHub
- 页面部署：Vercel
- 报名数据与付款截图：Supabase

这个方案适合你的原因：

- 学员可直接公开访问页面报名
- 付款截图可以上传保存
- 你可以在 Supabase 后台查看所有报名记录
- 你可以按 `Full Name` 和 PayNow 付款备注手动比对收款

## 当前表单收集内容

- Full Name
- Email Address
- Contact Number
- Company Name & Designation
- Do you require an invoice?
- Company / Individual Name for Invoice
- Payment Proof

## 当前项目信息

- Programme: `Business China YLP Immersion Programme - Shenzhen`
- Amount: `SGD 2,650.00`
- Payee: `Sing-China`
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

## 学员提交后，数据会去哪里

- 报名表数据：Supabase 表 `registrations`
- 付款截图：Supabase Storage `payment-proofs`

前端提交逻辑在：

- [script.js](file:///Users/zihangzhu/Documents/trae_projects/BUSINESS%20CHINA/public/script.js)

## 你如何核对 PayNow 收款和报名表

建议学员一定按页面提示，把自己的全名写进付款备注。

你后续核对时：

1. 打开 Supabase Table Editor
2. 查看 `registrations` 表
3. 按 `full_name` 查找报名记录
4. 对照 PayNow 收款记录里的付款备注姓名
5. 打开对应提交时间和付款截图进行确认
6. 核对成功后，把该记录视为已付款

你主要会用到这些字段：

- `full_name`
- `email`
- `created_at`
- `payment_proof_path`
- `status`

## 当前按钮和页面说明

- 页面已经提醒用户：`Please enter your full name in the payment reference.`
- 提交按钮文案为 `Register`
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
