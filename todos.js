let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let spans = document.getElementsByTagName("span");

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

// Function to add a todo item
function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount++;
    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

// Event listener for adding a todo item
addTodoButton.onclick = function() {
    for (let span of spans) {
        span.classList.add("anim");
    }

    setTimeout(function() {
        for (let span of spans) {
            span.classList.remove("anim");
        }
        onAddTodo();
    }, 500);
};

// Function to handle changes in todo item status
function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        return eachTodoId === todoId;
    });

    let todoObject = todoList[todoObjectIndex];

    if (todoObject.isChecked === true) {
        todoObject.isChecked = false;
    } else {
        todoObject.isChecked = true;
        createConfetti();

        responsiveVoice.init();
        const popup = document.getElementById('popup');
        const popupImage = document.getElementById('popup-image');

        // Show popup image and speak when checkbox is checked
        popupImage.src = "https://res.cloudinary.com/dxuow9y0u/image/upload/v1713978820/o9hsbsfbrt9oogixyb8v.jpg";
        popup.style.display = 'block';
        responsiveVoice.speak("Hooray! You have completed a task successfully", "UK English Female", {
            pitch: 1.2
        });

        setTimeout(function() {
            popup.style.display = 'none';
            popupImage.src = "";
        }, 3000);
    }
}

// Function to delete a todo item
function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteElementIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        return eachTodoId === todoId;
    });

    todoList.splice(deleteElementIndex, 1);
}

// Function to create and append todo item
function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;

    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };

    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };

    deleteIconContainer.appendChild(deleteIcon);
}

// Loop to create and append existing todo items
for (let todo of todoList) {
    createAndAppendTodo(todo);
}

// Function to handle logout
function logout() {
    // Perform logout operations
    Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "index.html";
    });
}

// Function to create confetti animation
function createConfetti() {
    let confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti");

    for (let i = 0; i < 13; i++) {
        let confettiPiece = document.createElement("div");
        confettiPiece.classList.add("confetti-piece");
        confettiContainer.appendChild(confettiPiece);
    }

    todoItemsContainer.appendChild(confettiContainer);

    setTimeout(() => {
        todoItemsContainer.removeChild(confettiContainer);
    }, 3000);
}

// Event listener for saving todos
saveTodoButton.onclick = function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));

    Swal.fire({
        title: "Todos Saved!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
    });
};
