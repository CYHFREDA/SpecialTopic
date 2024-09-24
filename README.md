# SpecialTopic

## 架構

- **README.md**
- **docker-compose.yml**
- **backend/**
  - `models`
    - `Book.js`
    - `User.js`
  - `routes`
    - `bookRoutes.js`
    - `userRoutes.js`
  - `Dockerfile`
  - `package.json`
  - `server.js`
  - `yarn.lock`
- **frontend/**
  - `assets`
    - `index-C-g398Md.js`
    - `index-Dk7e8YZp.css`
  - `vite.svg`
  - `index.html`
- **nginx/**
  - **conf.d/**
    - `api.conf`
  - `fastcgi_params`
  - `mime.types`
  - `modules` -> `/usr/lib/nginx/modules`
  - `nginx.conf`
  - `scgi_params`
  - `uwsgi_params`
---
- 公開倉庫：使用 GitHub Actions 是免費的，沒有分鐘數限制。
- 私有倉庫：每個帳戶每月 2,000 分鐘免費，超過後需要支付額外費用。
