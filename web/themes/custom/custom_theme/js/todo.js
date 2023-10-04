/**
 * @file
 * Todo List behaviours.
 */

(function ($, Drupal) {
  Drupal.behaviors.toDoBehavior = {
    attach: function (context, settings) {
      once("save-item", ".todo-container", context).forEach(function (element) {
        getLocalItems();

        // Add task in the list on clicking the add button.
        $(".save-todo", context).on("click", function(e) {
          e.preventDefault();

          const todoDiv = document.createElement("div");
          todoDiv.classList.add("todo-content");

          const completeButton = document.createElement("button");
          completeButton.classList.add("complete-btn");
          completeButton.innerHTML = "Done";

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("trash-btn");
          deleteButton.innerHTML = "Delete";

          const inputValue = $('#todo-input').val();
          const listValue = document.createElement("li");
          listValue.innerHTML = inputValue;

          // Add item to local storage.
          saveListItem(inputValue);

          todoDiv.append(listValue, completeButton, deleteButton);
          $(".todo__list").append(todoDiv);
          $('#todo-input').val("");
        });

        // Identifies the button that is clicked and performs its operations.
        $(".todo__list", context).on("click", function(e){
          const item = e.target;

          if (item.classList.contains("trash-btn")) {
            const todoDiv = item.parentElement;
            todoDiv.classList.add("slide");

            removeLocalItems(todoDiv.children[0].innerText);
            todoDiv.addEventListener("transitionend", function() {
              todoDiv.remove();
            });
          }

          if (item.classList.contains("complete-btn")) {
            const todoDiv = item.parentElement;
            todoDiv.classList.toggle("completed");
          }
        });

        // On changing the select the tasks are displayed.
        $(".filter-todo", context).on("change", function(e) {
          const todos = document.querySelector(".todo__list").childNodes;
          todos.forEach(function(todo) {
            switch (e.target.value) {
              case "all": 
                todo.style.display = "flex";
                break;
              case "completed": 
                if (todo.classList.contains("completed")) {
                  todo.style.display = "flex";
                } else {
                  todo.style.display = "none";
                }
                break;
              case "incomplete":
                if (!todo.classList.contains("completed")) {
                  todo.style.display = "flex";
                } else {
                  todo.style.display = "none";
                }
                break;
            }
          });
        });
      });

      /**
       * Saves the items in the local storage.
       *
       * @param {string} task
       *   The todo task provided by the user. 
       */
      function saveListItem(task) {
        let todos;
        if (localStorage.getItem("todos") === null) {
          todos = [];
        } else {
          todos = JSON.parse(localStorage.getItem("todos"));
        }
        todos.push(task);
        localStorage.setItem("todos", JSON.stringify(todos));
      };

      /**
       * Gets the values present in the local storage.
       */
      function getLocalItems() {
        let todos;
        if (localStorage.getItem("todos") === null) {
          todos = [];
        }
        else {
          todos = JSON.parse(localStorage.getItem("todos"));
        }

        todos.forEach(function(todo) {
          const todoDiv = document.createElement("div");
          todoDiv.classList.add("todo-content");

          const completeButton = document.createElement("button");
          completeButton.classList.add("complete-btn");
          completeButton.innerHTML = "Done";

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("trash-btn");
          deleteButton.innerHTML = "Delete";

          const listValue = document.createElement("li");
          listValue.innerHTML = todo;

          todoDiv.append(listValue, completeButton, deleteButton);
          $(".todo__list").append(todoDiv);
        });
      };

      /**
       * Removes the todo from local storage and rearranges the index of item.
       *
       * @param {string} value
       *   The task text which needs to be removed.
       */
      function removeLocalItems(value) {
        let todos;
        if (localStorage.getItem("todos") === null) {
          todos = [];
        }
        else {
          todos = JSON.parse(localStorage.getItem("todos"));
        }

        todos.splice(todos.indexOf(value), 1);
        localStorage.setItem("todos", JSON.stringify(todos));
      };
    },
  };
})(jQuery, Drupal);
