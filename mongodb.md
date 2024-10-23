# MongoDB 的基本架構

MongoDB 是一個 NoSQL 資料庫，與傳統的關聯式資料庫（如 MySQL）不同，它基於文檔模型來存儲和處理數據。
以下是 MongoDB 的基本架構介紹：

## 文檔（Document）
- MongoDB 的數據存儲單位是文檔（類似 JSON 的 BSON 格式）。
- 每個文檔都是一個鍵值對集合，這意味著數據由一組鍵值（Key-Value）組成。
- 文檔具有靈活的結構，相同集合中的不同文檔不必遵循相同的字段或結構。
- **範例**：
  ```json
  {
    "name": "freda",
    "age": 66,
    "address": {
      "street": "Qingshui District",
      "city": "Taichung"
    }
  }
## 集合（Collection）
- 文檔被組織成集合（相當於 MySQL 的表）。集合中的文檔可以結構不同，並且沒有固定的模式（Schema-less），這意味著不需要像 MySQL 那樣提前定義數據表的結構。

## 資料庫（Database）
- MongoDB 中的資料庫是存儲集合的容器。一個 MongoDB 伺服器可以包含多個資料庫。

## 索引（Indexes）
- MongoDB 支持索引來提高查詢性能。索引可以在文檔的某些字段上創建，以便更快地查詢這些字段。

## 副本集（Replica Set）
- MongoDB 支持副本集，以實現高可用性。副本集是一組 MongoDB 節點，主節點處理寫操作，從節點用來備份並作為高可用性節點。
  
## 分片（Sharding）
- MongoDB 支持分片技術，可以將數據水平分割到多個節點上，以提高處理大數據的性能。這種方式可以讓數據庫具備高擴展性。

## 聚合框架（Aggregation Framework）
- MongoDB 提供了一個功能強大的聚合框架，用來執行數據聚合操作（類似 SQL 的 GROUP BY）。它可以處理多步驟的數據計算、篩選和轉換。
