// records.js
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
            recordsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Fetch records error:', error);
        alert('查詢打卡記錄失敗：無法連接到伺服器');
    }
}
