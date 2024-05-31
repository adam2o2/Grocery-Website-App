const friendList = [];
        let groups = JSON.parse(localStorage.getItem('groups')) || [];

        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('addFriendButton').addEventListener('click', function() {
                const friendName = document.getElementById('friendName').value.trim();
                if (friendName) {
                    addFriend(friendName);
                    document.getElementById('friendName').value = ''; // Clear the input field
                } else {
                    alert('Please enter a friend\'s name.');
                }
            });

            document.getElementById('createGroupButton').addEventListener('click', function() {
                const groupName = document.getElementById('groupName').value.trim();
                if (groupName && friendList.length > 0) {
                    createGroupBox(groupName, friendList);
                    document.getElementById('groupName').value = ''; // Clear the input field
                    friendList.length = 0; // Clear the friend list
                    document.getElementById('friendList').innerHTML = ''; // Clear the displayed friend list
                } else {
                    alert('Please enter a group name and add at least one friend.');
                }
            });

            renderGroups();
        });

        function addFriend(friendName) {
            friendList.push(friendName);
            const friendListElement = document.getElementById('friendList');
            const listItem = document.createElement('li');
            listItem.textContent = friendName;
            friendListElement.appendChild(listItem);
        }

        function createGroupBox(groupName, friends) {
            const groupContainer = document.getElementById('groupContainer');
            const newBox = document.createElement('div');
            newBox.className = 'box';
            const friendListHTML = friends.map(friend => `<li>${friend}</li>`).join('');
            newBox.innerHTML = `
                <h2>${groupName}</h2>
                <ul>${friendListHTML}</ul>
                <button class="enterGroupButton">Enter Group</button>
                <button class="deleteGroupButton">Delete</button>
            `;
            newBox.querySelector('.deleteGroupButton').addEventListener('click', function() {
                deleteGroup(groupName);
                groupContainer.removeChild(newBox);
            });
            newBox.querySelector('.enterGroupButton').addEventListener('click', function() {
                localStorage.setItem('currentGroup', JSON.stringify({ groupName, friends }));
                window.location.href = 'group.html';
            });
            groupContainer.appendChild(newBox);

            groups.push({ groupName, friends });
            localStorage.setItem('groups', JSON.stringify(groups));
        }

        function deleteGroup(groupName) {
            groups = groups.filter(group => group.groupName !== groupName);
            localStorage.setItem('groups', JSON.stringify(groups));
        }

        function renderGroups() {
            const groupContainer = document.getElementById('groupContainer');
            groupContainer.innerHTML = '';
            groups.forEach(group => {
                const newBox = document.createElement('div');
                newBox.className = 'box';
                const friendListHTML = group.friends.map(friend => `<li>${friend}</li>`).join('');
                newBox.innerHTML = `
                    <h2>${group.groupName}</h2>
                    <ul>${friendListHTML}</ul>
                    <button class="enterGroupButton">Enter Group</button>
                    <button class="deleteGroupButton">Delete</button>
                `;
                newBox.querySelector('.deleteGroupButton').addEventListener('click', function() {
                    deleteGroup(group.groupName);
                    groupContainer.removeChild(newBox);
                });
                newBox.querySelector('.enterGroupButton').addEventListener('click', function() {
                    localStorage.setItem('currentGroup', JSON.stringify(group));
                    window.location.href = 'group.html';
                });
                groupContainer.appendChild(newBox);
            });
        }