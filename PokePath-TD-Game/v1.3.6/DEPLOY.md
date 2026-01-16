# Vercel 部署指南

## 📋 部署步骤

### 1. 准备工作

确保你已经：
- ✅ 安装了 Node.js 和 npm
- ✅ 有 Vercel 账号（如果没有，去 [vercel.com](https://vercel.com) 注册）
- ✅ 安装了 Vercel CLI（可选）：`npm i -g vercel`

### 2. 部署到 Vercel

#### 方法一：通过 Vercel 网站部署（推荐）

1. 将项目上传到 GitHub/GitLab/Bitbucket
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "New Project"
4. 导入你的仓库
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `un`（如果项目在 un 文件夹中）
   - **Build Command**: 留空（静态网站）
   - **Output Directory**: `.`（当前目录）
6. 点击 "Deploy"

#### 方法二：通过 Vercel CLI 部署

```bash
# 进入项目目录
cd un

# 登录 Vercel
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### 3. 配置说明

项目已包含 `vercel.json` 配置文件，包含：
- ✅ 静态文件服务配置
- ✅ 资源缓存策略（静态资源缓存 1 年）
- ✅ iframe 嵌入支持（X-Frame-Options: ALLOWALL）

### 4. 通过 iframe 嵌入

部署完成后，你可以通过以下方式嵌入游戏：

```html
<!-- 基础嵌入 -->
<iframe 
    src="https://your-project.vercel.app/index.html" 
    width="1238" 
    height="674" 
    frameborder="0"
    allow="fullscreen"
    title="PokePath TD Game"
></iframe>
```

#### 响应式嵌入（推荐）

```html
<div style="position: relative; width: 100%; padding-bottom: 54.5%;">
    <iframe 
        src="https://your-project.vercel.app/index.html"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        allow="fullscreen"
        title="PokePath TD Game"
    ></iframe>
</div>
```

### 5. 注意事项

⚠️ **重要提示**：

1. **LocalStorage 限制**：
   - 游戏数据保存在浏览器的 LocalStorage 中
   - 不同域名下的 iframe 有独立的 LocalStorage
   - 清除浏览器数据会删除游戏存档

2. **跨域问题**：
   - 如果遇到跨域问题，确保 Vercel 项目设置了正确的 CORS 头
   - `vercel.json` 已配置允许 iframe 嵌入

3. **性能优化**：
   - 静态资源（图片、音频）已配置长期缓存
   - 首次加载可能需要一些时间下载资源

4. **浏览器兼容性**：
   - 推荐使用现代浏览器（Chrome、Firefox、Edge、Safari）
   - 需要支持 ES6+ 模块和 Canvas API

### 6. 自定义域名

在 Vercel 项目设置中可以添加自定义域名：
1. 进入项目设置
2. 点击 "Domains"
3. 添加你的域名
4. 按照提示配置 DNS

### 7. 环境变量（如需要）

如果将来需要添加环境变量：
1. 在 Vercel 项目设置中找到 "Environment Variables"
2. 添加所需的变量
3. 重新部署项目

## 🐛 故障排除

### 问题：游戏无法加载
- 检查浏览器控制台是否有错误
- 确认所有资源路径正确
- 检查 Vercel 部署日志

### 问题：iframe 无法显示
- 确认 `vercel.json` 中的 `X-Frame-Options` 设置为 `ALLOWALL`
- 检查父页面是否有 CSP（Content Security Policy）限制

### 问题：游戏数据丢失
- LocalStorage 是浏览器本地存储
- 清除浏览器数据会删除存档
- 建议提醒用户不要清除浏览器数据

## 📞 支持

如有问题，请检查：
- Vercel 部署日志
- 浏览器开发者工具控制台
- 网络请求状态

---

**祝部署顺利！🎮**

