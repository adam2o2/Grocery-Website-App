document.addEventListener('DOMContentLoaded', function() {
    let group = JSON.parse(localStorage.getItem('currentGroup'));
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    
    function updateGroupsInLocalStorage() {
        const groupIndex = groups.findIndex(g => g.groupName === group.groupName);
        if (groupIndex !== -1) {
            groups[groupIndex] = group;
            localStorage.setItem('groups', JSON.stringify(groups));
        }
    }

    function displayGroupInfo() {
        const groupInfoElement = document.getElementById('groupInfo');
        groupInfoElement.innerHTML = `
            <h2>${group.groupName}</h2>
            <ul id="friendsList">${group.friends.map((friend, index) => `
                <li>
                    ${friend}
                    <span class="delete-button" data-index="${index}">Delete</span>
                </li>`).join('')}
            </ul>
            <div>
                <input type="text" id="friendInput" placeholder="Enter friend's name">
                <button id="addFriendButton">Add Friend</button>
            </div>
        `;
    }

    if (group) {
        displayGroupInfo();
    }

    const friendsList = document.getElementById('groupInfo');
    friendsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const index = event.target.getAttribute('data-index');
            group.friends.splice(index, 1);
            localStorage.setItem('currentGroup', JSON.stringify(group));
            event.target.parentElement.remove();
            updateGroupsInLocalStorage();
        }
    });

    document.getElementById('addFriendButton').addEventListener('click', function() {
        const friendInput = document.getElementById('friendInput');
        const friendName = friendInput.value.trim();
        if (friendName) {
            group.friends.push(friendName);
            localStorage.setItem('currentGroup', JSON.stringify(group));
            updateGroupsInLocalStorage();
            displayGroupInfo();
            friendInput.value = ''; // Clear the input field
        } else {
            alert('Please enter a friend\'s name.');
        }
    });

    const itemList = document.getElementById('itemList');
    const storageKey = `groceryItems_${group.groupName}`;

    function loadItems() {
        const items = JSON.parse(localStorage.getItem(storageKey)) || [];
        items.forEach(item => {
            addItemToDOM(item.name, item.image, item.checked);
        });
    }

    function saveItems() {
        const items = [];
        itemList.querySelectorAll('li').forEach(itemElement => {
            const name = itemElement.querySelector('span').textContent;
            const image = itemElement.querySelector('img') ? itemElement.querySelector('img').src : null;
            const checked = itemElement.querySelector('input[type="checkbox"]').checked;
            items.push({ name, image, checked });
        });
        localStorage.setItem(storageKey, JSON.stringify(items));
    }

    function addItemToDOM(name, imageSrc, checked = false) {
        const itemElement = document.createElement('li');
        const itemContent = document.createElement('span');
        itemContent.textContent = name;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.addEventListener('change', function() {
            itemContent.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            saveItems();
        });

        const deleteButton = document.createElement('span');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', function() {
            itemList.removeChild(itemElement);
            saveItems();
        });

        itemElement.appendChild(checkbox);
        if (imageSrc) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = name;
            img.width = 50;
            itemElement.appendChild(img);
        }
        itemElement.appendChild(itemContent);
        itemElement.appendChild(deleteButton);
        itemList.appendChild(itemElement);
    }

    document.getElementById('addItemButton').addEventListener('click', function() {
        const itemInput = document.getElementById('itemInput');
        const itemImageInput = document.getElementById('itemImageInput');
        const itemName = itemInput.value.trim();
        const itemImage = itemImageInput.files[0];

        if (itemName) {
            let imageSrc = null;
            if (itemImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageSrc = e.target.result;
                    addItemToDOM(itemName, imageSrc);
                    saveItems();
                };
                reader.readAsDataURL(itemImage);
            } else {
                addItemToDOM(itemName, imageSrc);
                saveItems();
            }

            itemInput.value = ''; // Clear the input field
            itemImageInput.value = ''; // Clear the file input
        } else {
            alert('Please enter an item name.');
        }
    });

    loadItems();
});