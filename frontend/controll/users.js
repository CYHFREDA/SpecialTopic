        // 添加使用者的函數
        async function postUser() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value; // 新增密碼欄位
            
            const response = await fetch('/control/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('使用者已成功添加！');
                fetchUsers(); // 添加後重新載入使用者列表
                document.getElementById('username').value = ''; // 清空使用者欄位
                document.getElementById('password').value = ''; // 清空密碼欄位
            } else {
                const { error } = await response.json();
                alert(`添加使用者時發生錯誤: ${error}`);
            }
        }
        // 抓取使用者的函數
        async function fetchUsers() {
            const response = await fetch('/control/api/users');
            const users = await response.json();
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = ''; // 清空現有使用者
        
            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${user.username}</strong>`;
                
                // 創建修改密碼的按鈕和輸入框
                const passwordInput = document.createElement('input');
                passwordInput.type = 'password';
                passwordInput.placeholder = '新密碼';
                
                const changePasswordButton = document.createElement('button');
                changePasswordButton.textContent = '修改密碼';
                changePasswordButton.onclick = () => {
                    const newPassword = passwordInput.value; // 確保從輸入框獲取最新的密碼
                    changePassword(user._id, newPassword); // 傳遞最新的密碼
                };
        
                listItem.appendChild(passwordInput);
                listItem.appendChild(changePasswordButton);
                
                // 創建刪除按鈕
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = () => deleteUser(user._id);
                listItem.appendChild(deleteButton);
                
                usersList.appendChild(listItem);
            });
        }
        // 更改密碼函數
        async function changePassword(id, newPassword) {
            const response = await fetch(`/control/api/users/${id}/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword }) // 傳送新的密碼
            });

            if (response.ok) {
                alert('密碼已成功修改！');
                fetchUsers(); // 更新使用者列表
            } else {
                const { error } = await response.json();
                alert(`修改密碼時發生錯誤: ${error}`);
            }
        }
        // 刪除使用者的函數
        async function deleteUser(id) {
            const response = await fetch(`/control/api/users/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('使用者已成功刪除！');
                fetchUsers(); // 刪除後重新載入使用者列表
            } else {
                const { error } = await response.json();
                alert(`刪除使用者時發生錯誤: ${error}`);
            }
        }
