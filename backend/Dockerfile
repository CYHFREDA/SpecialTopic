# 使用 Node.js 官方映像
FROM node:16

# 更新包管理器並安裝 telnet 和 mysql-client
RUN apt-get update && apt-get install -y telnet default-mysql-client && rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製其他源碼文件
COPY . .

# 暴露後端服務的埠
EXPOSE 5001

# 啟動應用
CMD ["npm", "start"]
