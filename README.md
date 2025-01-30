 ChatWall 雀窩- Backend api<br>
===

### 後端流程MVC 架構圖
<img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2FMVC_v5.drawio.png?alt=media&token=db640053-81cf-4d96-bb34-8b0a73329c11" width="700">

--- 

### 專案描述
ChatWall是一個社交媒體平台，提供用戶發佈動態、評論和點讚以及線上聊天等功能



### 功能清單
- ✅ 用戶註冊與登入(JWT 權限驗證、Google第三方登入)
- ✅ 修改用戶暱稱大頭貼密碼功能
- ✅ 發佈貼文
- ✅ 留言功能
- ✅ 點讚功能
- ✅ 追蹤用戶
- ✅ 追蹤按讚功能
- ✅ 圖片上傳(Firebase第三方API串接)
- ✅ 聊天室功能(socket.IO)
---

## 安裝指南

### 1. Clone 專案
```
git clone https://github.com/GustavoFringgg/ChatWall-Backend.git
cd ChatWall-Backend
```
### 2. 安裝dependencies
```
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
### 3. 啟動專案
```
//開發者模式
npm run start:dev

//正式環境模式
npm run start:production

```
