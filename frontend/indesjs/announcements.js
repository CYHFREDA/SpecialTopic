// announcements.js
async function fetchAnnouncements() {
    try {
        const response = await fetch('/control/api/announcements');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const announcements = await response.json();
        const announcementsDiv = document.getElementById('announcements');
        announcementsDiv.innerHTML = ''; // 清空現有公告
        
        if (announcements.length === 0) {
            const noAnnouncement = document.createElement('li');
            noAnnouncement.textContent = '目前沒有公告。';
            announcementsDiv.appendChild(noAnnouncement);
        } else {
            announcements.forEach(announcement => {
                const listItem = document.createElement('li');
                listItem.textContent = `${announcement.title}: ${announcement.content}`;
                announcementsDiv.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Fetch announcements error:', error);
        alert('獲取公告失敗：無法連接到伺服器');
    }
}

// 在頁面加載時獲取公告
window.onload = fetchAnnouncements;
