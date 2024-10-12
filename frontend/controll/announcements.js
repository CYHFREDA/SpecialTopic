// 發佈公告的函數
async function postAnnouncement() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const response = await fetch('/control/api/announcements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    });

    if (response.ok) {
        alert('公告已成功發佈！');
        fetchAnnouncements(); // 重新載入公告列表
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
    } else {
        const { error } = await response.json();
        alert(`發佈公告時發生錯誤: ${error}`);
    }
}

// 取得公告的函數
async function fetchAnnouncements() {
    const response = await fetch('/control/api/announcements');
    const announcements = await response.json();
    const announcementsList = document.getElementById('announcements-list');
    announcementsList.innerHTML = ''; // 清空現有公告

    announcements.forEach(announcement => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center'; // 使用 Bootstrap 列表樣式
        listItem.innerHTML = `<strong>${announcement.title}</strong>: ${announcement.content}`;
        
        // 創建刪除按鈕
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '刪除';
        deleteButton.className = 'btn btn-danger btn-sm'; // 使用 Bootstrap 樣式
        deleteButton.onclick = () => deleteAnnouncement(announcement._id);
        
        listItem.appendChild(deleteButton); // 添加按鈕到列表項目
        announcementsList.appendChild(listItem); // 添加列表項目到公告列表
    });
}

// 刪除公告的函數
async function deleteAnnouncement(id) {
    const response = await fetch(`/control/api/announcements/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('公告已成功刪除！');
        fetchAnnouncements(); // 刪除後重新載入公告列表
    } else {
        const { error } = await response.json();
        alert(`刪除公告時發生錯誤: ${error}`);
    }
}
