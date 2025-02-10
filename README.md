# ChatWall 雀窩- Backend API<br>


### 專案描述
ChatWall是一個社交媒體平台，提供用戶一般註冊/一般登入/google第三方登入，發佈動態、圖片、留言評論、貼文點讚、追蹤用戶以及線上聊天即時等功能


此為後端repository，提供swagger文件供前端串接使用<br>
[swagger文件](<https://chatwall-backend.onrender.com/api-doc/>) ⬅

---

### 前後端流程MVVM/MVC 架構圖
<img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2FMVC_v6.drawio.png?alt=media&token=9f5e6148-0122-47fa-a108-b5cb8887201d" width="700">

---

### Features
- ✅ 用戶註冊與登入與登出(JWT 權限驗證、Google第三方登入)
- ✅ 修改用戶暱稱大頭貼密碼功能
- ✅ 發佈貼文
- ✅ 留言功能
- ✅ 貼文篩選(最新貼文/最舊貼文/熱門貼文/搜索貼文)
- ✅ 刪除貼文
- ✅ 點讚功能
- ✅ 追蹤用戶
- ✅ 顯示用戶貼文列表
- ✅ 顯示個人貼文列表
- ✅ 顯示按讚列表
- ✅ 顯示已追蹤用戶功能
- ✅ 圖片上傳，用於更換用戶大頭貼/貼文夾帶圖片(Firebase第三方API串接)
- ✅ 聊天室功能(socket.IO)
---


## Installation

#### 1. Clone the repository && Move to the ChatWall-Backend directory
```
git clone https://github.com/GustavoFringgg/ChatWall-Backend.git
cd ChatWall-Backend
```
#### 2. Install the dependencies
```
npm install
```
#### 3. Launch the application
```
//開發者模式
npm run start:dev

//正式環境模式
npm run start:production

```

---
## Screenshots

