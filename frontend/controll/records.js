        async function fetchRecords() {
            try {
                const response = await fetch('/api/records');
                const records = await response.json();
                const recordsList = document.getElementById('records-list');
                recordsList.innerHTML = ''; // 清空現有記錄
                records.forEach(record => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = `${record.user} ${record.type} at ${new Date(record.time).toLocaleString()}`;

                    // 創建刪除按鈕
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '刪除';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => deleteRecord(record._id);
                    listItem.appendChild(deleteButton);
                    
                    recordsList.appendChild(listItem);
                });
            } catch (error) {
                console.error('Fetch records error:', error);
                alert('查詢打卡記錄失敗：無法連接到伺服器');
            }
        }

        async function deleteRecord(id) {
            const response = await fetch(`/api/records/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('打卡記錄已成功刪除！');
                fetchRecords(); // 刪除後重新載入打卡紀錄列表
            } else {
                const { error } = await response.json();
                alert(`刪除打卡記錄時發生錯誤: ${error}`);
            }
        }
