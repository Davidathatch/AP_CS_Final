//Takes in inputted task as parameter, and creates an HTML element
//To be inserted into the task list visible to user
function createTask(taskInput, appendPlacement, taskStatus, classIndex) {
    //Creates task div
    var taskDiv = document.createElement("div")
    taskDiv.classList.add("task")
    if(classIndex > -1){
        taskDiv.classList.add(classIndex.toString())
    }else {
        taskDiv.classList.add((currentLibrary.length).toString())
    }
    if (taskStatus == "completed") {
        taskDiv.classList.add("completedTask")
    }
    taskDiv.addEventListener("click", deleteTask)

    //Creates checkbox div (appened to taskDiv)
    var checkBoxDiv = document.createElement("button")
    checkBoxDiv.classList.add("checkBox")
    taskDiv.appendChild(checkBoxDiv)

    if (taskStatus == "completed") {
        checkBoxDiv.classList.add("checkedBox")
    }

    //Creates h2 with task data inside (appened to taskDiv)
    var taskDataDiv = document.createElement("div")
    taskDataDiv.classList.add("taskData")
    var taskData = document.createElement("h2")
    taskDataText = document.createTextNode(taskInput)
    taskData.appendChild(taskDataText)
    taskDataDiv.appendChild(taskData)
    taskDiv.appendChild(taskDataDiv)

    //taskList HTML Element
    var taskList = document.querySelector(".taskList")

    //top HTML element, used to place new taks on top
    var topItem = document.querySelector(".task")

    if (appendPlacement === "top") {
        taskList.insertBefore(taskDiv, topItem)
        document.querySelector(".checkBox").addEventListener("click", removeTask, false)
    } else {
        taskList.appendChild(taskDiv)
    }

    if(currentLibrary.length > 0){
        document.querySelector(".messageDisplay").style.display = "none"
    }

}

//Different from removetask, as deleteTask removes the task from the screen
function deleteTask(e){

    //will take place if trashbutton or delete shortcut button is clicked
    if(e.currentTarget === document.querySelector(".fa-trash") || e.currentTarget === document.querySelector(".shortcutTwo")){
        if(deleteOn === false){
            deleteOn = true
            console.log(deleteButton)
            deleteButton.classList.add("buttonSelected")
        }else {
            deleteOn = false
            deleteButton.classList.remove("buttonSelected")
        }
        
    }

    //will take place if task is clicked and deleteOn is true
    if(e.currentTarget.classList.contains("task") && deleteOn === true){
        e.currentTarget.remove()

        for(let x=0; x<currentLibrary.length; x++){
            if(currentLibrary[x]["taskName"] === e.currentTarget.innerText){
                 console.log("removed " + currentLibrary[x]["taskName"])
                currentLibrary.splice(x, 1)
                console.log(currentLibrary)
            }
        }
        clearList()
    updatePage(currentLibrary)
    console.log(currentLibrary)
    }
}

//Takes catalog of all tasks and adds all to site using createTask()
function updateTasks(currentLibrary) {
    for (let i = 0; i < currentLibrary.length; i++) {
        createTask(currentLibrary[i], i)
    }
    if(currentLibrary.length > 0){
        document.querySelector(".messageDisplay").style.display = "none"
    }
}

//Adds completed styles and moves task to the bottom of the list
//Also changes status to complete, for loading content in the future
function removeTask(e) {
    var currentTask = e.currentTarget.parentElement.childNodes
    var currentTaskDiv = e.currentTarget.parentNode
    var currentTaskBackground = e.currentTarget.parentElement
    currentTask[0].classList.add("checkedBox")
    currentTaskBackground.classList.add("completedTask")
    createTask(currentTask[1].innerText, "bottom", "completed", -1)

    currentLibrary[currentTaskDiv.classList[1]]["taskStatus"] = "completed"
    currentTaskBackground.remove()
    
    clearList()
    updatePage(currentLibrary)
    console.log(currentLibrary)
}

//Saves function in dictionary inside of the currentLibrary list
//Contains the entered task details, and whether or not it is complete
function saveTask(taskName, taskStatus){
    taskName = {
        "taskName": taskName,
        "taskStatus": taskStatus
 }
    currentLibrary[currentLibrary.length] = taskName
}


//Updates page with tasks from chosen catalog, with completed tasks styled accordingly
function updatePage(chosenCatalog){
    var allCheckbox = document.getElementsByClassName("checkBox")
    for(let x=0; x<chosenCatalog.length; x++){
        var taskPlacement = ""
        if(chosenCatalog[x]["taskStatus"] === "completed"){
            taskPlacement = "bottom"
        }else{
            taskPlacement = "top"
        }
        createTask(chosenCatalog[x]["taskName"], taskPlacement, chosenCatalog[x]["taskStatus"], x)
    }
    if(currentLibrary.length > 0){
        document.querySelector(".messageDisplay").style.display = "none"
    }else {
        document.querySelector(".messageDisplay").style.display = "block"
    }
}

//Clears page of tasks
function clearList() {
    var taskList = document.getElementsByClassName("task")
    var libraryLength = currentLibrary.length
    for(let x=libraryLength-1; x>=0; x--){
        taskList[x].remove()
    }
}

//Saves all new data to array, then changes to new catalog
function changeLibrary(chosenLibrary){
    clearList()
    if(currentLibrarySave === "taskCatalog"){
        taskCatalog = currentLibrary
        workButton.classList.remove("buttonSelected")
    }else if(currentLibrarySave === "homeCatalog"){
        homeCatalog = currentLibrary
        homeButton.classList.remove("buttonSelected")
    }else if(currentLibrarySave === "schoolCatalog"){
        schoolCatalog = currentLibrary
        schoolButton.classList.remove("buttonSelected")
    }

    currentLibrary = chosenLibrary
    
    if(chosenLibrary === taskCatalog){
        currentLibrarySave = "taskCatalog"
        workButton.classList.add("buttonSelected")
    }else if(chosenLibrary === homeCatalog){
        currentLibrarySave = "homeCatalog"
        homeButton.classList.add("buttonSelected")
    }else if(chosenLibrary === schoolCatalog){
        currentLibrarySave = "schoolCatalog"
        schoolButton.classList.add("buttonSelected")
    }
    updatePage(currentLibrary)
}


//Lines 124-129 were found on Stack Overflow, used to allow localStorage
//of objects rather than strings
//https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage#:~:text=Use%20localStorage.,array%20or%20object%20and%20localStorage.&text=The%20same%20methods%20work%20with,is%20returned%20by%20the%20getter.
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

//Input field for new tasks
var inputBar = document.querySelector("#taskInput")
var addButton = document.querySelector(".addButton")
var deleteButton = document.querySelector(".fa-trash")
var taskContainer = document.querySelectorAll(".task")
//deleteOn used to delete task
deleteOn = false

//When focused on inputBar, if you press the enter key it will
//Add tasks to list, and clear field
inputBar.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        createTask(inputBar.value, "top", "incomplete", -1)
        saveTask(inputBar.value, "incomplete")
        inputBar.value = ""
    }
    if(currentLibrary.length > 0){
        document.querySelector(".messageDisplay").style.display = "none"
    }
})

//Adds task when addButton is clicked if inputBar has a value
addButton.addEventListener("click", function () {
    if (inputBar.value != "") {
        createTask(inputBar.value, "top", "incomplete", -1)
        saveTask(inputBar.value, "incomplete")
        inputBar.value = ""
    }
    if(currentLibrary.length > 0){
        document.querySelector(".messageDisplay").style.display = "none"
    }
})

deleteButton.addEventListener("click", deleteTask)

var taskCatalog = []
var homeCatalog = []
var schoolCatalog = []

testCatalog = [
    taskName = {
        "taskName": "Task",
        "taskStatus": "completed"
    },
    taskName = {
        "taskName": "Another Task",
        "taskStatus": "incomplete"
    },
    taskName = {
        "taskName": "Last task",
        "taskStatus": "incomplete"
    },
]

// localStorage.setObj("tesetCatalog", testCatalog)
// var testLocalStorage = localStorage.getObj("tesetCatalog")
// console.log(testLocalStorage[1]["taskName"])

//Dictates library of tasks is being used
var currentLibrary = taskCatalog

//Used to refrence original list being used for saving data
currentLibrarySave = "taskCatalog"

//Adds event listener to all checkboxes if there are already tasks in catalog
if (currentLibrary.length >= 0) {
    for (let i = 0; i < taskCatalog.length; i++) {
        document.querySelector("checkBox").addEventListener("click", removeTask)
    }
}

var workButton = document.querySelector(".workButton")
var homeButton = document.querySelector(".homeButton")
var schoolButton = document.querySelector(".schoolButton")

workButton.addEventListener("click", function() {
    changeLibrary(taskCatalog)
})
homeButton.addEventListener("click", function() {
    changeLibrary(homeCatalog)
})
schoolButton.addEventListener("click", function(){
    changeLibrary(schoolCatalog)
})

document.querySelector(".shortcutOne").addEventListener("click", function() {
    inputBar.focus()
})
document.querySelector(".shortcutTwo").addEventListener("click", deleteTask)


changeLibrary(taskCatalog)