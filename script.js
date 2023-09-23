const newItemInput = document.querySelector(".container input");
const shoppingListElement = document.querySelector(".shopping-list");
const addItemButton = document.querySelector(".add-item-btn");
const errorMessageContainer = document.querySelector(".error-message-container");
const errorMessage = document.querySelector(".error-message");

let items = [];

const saveItemsToLocalStorage = items => {
    localStorage.setItem("SHOPPING_LIST", JSON.stringify(items));
};

const addItemToList = newItemValue => {
    const newItemListElement = document.createElement("li");
    const newItemListElementText = document.createElement("p");
    newItemListElementText.textContent = newItemValue;

    newItemListElement.appendChild(newItemListElementText);

    const listButtonsContainer = document.createElement("div"); // container for both 'edit' and 'delete' buttons
    listButtonsContainer.classList.add("list-buttons-container");

    const editItemListButton = document.createElement("button"); // EDIT item button
    editItemListButton.classList.add("edit-button");
    editItemListButton.textContent = "Edit";

    editItemListButton.addEventListener("click", () => {
        const listItemTextContainer = newItemListElement.querySelector("p");

        const editField = document.createElement("input");
        editField.type = "text";
        editField.value = newItemValue;

        editField.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                newItemValue = editField.value;
                listItemTextContainer.textContent = newItemValue;
                items[items.indexOf(newItemValue)] = newItemValue;
                saveItemsToLocalStorage(items);
                editField.parentElement.removeChild(editField);
            }
        });

        listItemTextContainer.textContent = "";
        listItemTextContainer.appendChild(editField);
        editField.focus();
    });

    listButtonsContainer.appendChild(editItemListButton);

    const deleteItemListButton = document.createElement("button"); // DELETE item button
    deleteItemListButton.classList.add("delete-button");
    deleteItemListButton.textContent = "Delete";

    deleteItemListButton.addEventListener("click", () => {
        const itemIndex = items.indexOf(newItemValue);

        if (itemIndex !== -1) {
            items.splice(itemIndex, 1);
            saveItemsToLocalStorage(items);
        }
        console.log(newItemListElementText);
        console.log(newItemListElement);
        newItemListElementText.classList.add("list-item-text-line-through");
        newItemListElement.classList.add("list-item-twist");

        // Delaying the DOM element removal, so classes/animations can play first
        setTimeout(() => {
            shoppingListElement.removeChild(newItemListElement);
        }, 1000);
    });

    listButtonsContainer.appendChild(deleteItemListButton);

    newItemListElement.appendChild(listButtonsContainer);

    shoppingListElement.appendChild(newItemListElement);

    saveItemsToLocalStorage(items);
};

const fetchLocalStorageData = () => {
    const localStorageData = localStorage.getItem("SHOPPING_LIST");
    if (localStorageData !== null) {
        items = JSON.parse(localStorageData);

        // cycling through items array and adding each item to the shopping list
        items.forEach(item => {
            addItemToList(item);
        });
    }
};

const displayErrorMessage = message => {
    errorMessageContainer.style.display = "flex";
    errorMessage.textContent = message;

    errorMessage.classList.add("fade-in");
};

window.onload = () => {
    fetchLocalStorageData();

    addItemButton.addEventListener("click", () => {
        const newItemValue = newItemInput.value.trim().toLowerCase();
        const containsLetters = /[a-zA-Z]/.test(newItemValue);
        const containsNumbers = /\d/.test(newItemValue);

        if (newItemValue === "") {
            displayErrorMessage("Field must not be empty");
            newItemInput.value = "";
            return;
        } else if (containsLetters && containsNumbers) {
            displayErrorMessage("Field must not contain both letters and numbers");
            newItemInput.value = "";
            return;
        } else if (containsNumbers) {
            displayErrorMessage("Field must not contain numbers");
            newItemInput.value = "";
            return;
        }

        addItemToList(newItemValue);

        items.push(newItemValue);

        saveItemsToLocalStorage(items);

        newItemInput.value = "";
    });

    newItemInput.addEventListener("input", () => {
        const newItemValue = newItemInput.value.toLowerCase();
        const containsLetters = /[a-zA-Z]/.test(newItemValue);
        const containsNumbers = /\d/.test(newItemValue);

        if (!containsNumbers || (containsLetters && containsNumbers)) {
            errorMessageContainer.style.display = "none";
        }
    });

    newItemInput.addEventListener("keyup", event => {
        if (event.key === "Enter") {
            // Preventing the default behaviour, browser form submission 
            event.preventDefault();

            const newItemValue = newItemInput.value.trim().toLowerCase();

            if (newItemValue !== "") {
                addItemToList(newItemValue);

                items.push(newItemValue);
                saveItemsToLocalStorage(items);

                newItemInput.value = "";
            }
        }
    });
};
