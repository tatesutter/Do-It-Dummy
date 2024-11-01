const ARRAY_KEY = "schedule";
let timeoutId

const insults = [
    "You're as useful as a screen door on a submarine!",
    "I'd explain it to you, but I left my English-to-Dingbat dictionary at home.",
    "You're like a software update. Whenever I see you, I think, 'Not now.'",
    "If ignorance is bliss, you must be the happiest person on the planet.",
    "I'd agree with you, but then we'd both be wrong."
];

function scheduleReminder() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let week = document.getElementById("week-select").value;

        // set local storage

    const jsonSchedule = localStorage.getItem(ARRAY_KEY);
    const array = (jsonSchedule) ? JSON.parse(jsonSchedule) : [];

    const object = {title, description, date, time, week};
    array.push(object);

    localStorage.setItem(ARRAY_KEY, JSON.stringify(array));
    

    let dateTimeString = date + " " + time;
    let scheduledTime = new Date(dateTimeString);
    let currentTime = new Date();
    let timeDifference = scheduledTime - currentTime;

    if (timeDifference > 0) {
        addReminder(title, description, scheduledTime, week);

        let timeoutId = setTimeout(function () {
            document.getElementById("notificationSound").play();

            let notification = new Notification(title, {
                body: description,
                requireInteraction: true
            });
        }, timeDifference);

    } else {
        alert("The scheduled time is in the past!");
    }
};

function addReminder(title, description, scheduledTime, week) {
    let dayOfWeek = scheduledTime.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    let dayListId = week === 'week1' ? `${dayOfWeek}-list-week1` : `${dayOfWeek}-list-week2`;
    let dayList = document.getElementById(dayListId);

    console.log(dayListId);
    console.log(dayList);

    // create list item
    
    let listItem = document.createElement('li');
    listItem.dataset.title = title; 
    listItem.dataset.week = week; 

    // create title element

    let titleElement = document.createElement('span');
    titleElement.textContent = title;
    titleElement.style.cursor = 'pointer'; 
    titleElement.onclick = function () {
        descriptionElement.classList.toggle('d-none'); 
    };

    // empties the input fields
    
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("week-select").value = "week1";

    // create description element

    let descriptionElement = document.createElement('div');
    descriptionElement.textContent = `${description} at ${scheduledTime.toLocaleString()}`;
    descriptionElement.classList.add('d-none'); 

    // append elements to list item

    listItem.appendChild(titleElement);
    listItem.appendChild(descriptionElement);
    dayList.appendChild(listItem);

    // add to table

    let tableBody = document.getElementById("reminderTableBody");
    let row = tableBody.insertRow();
    row.dataset.title = title; 
    row.dataset.week = week; 
    row.insertCell(0).innerHTML = title;
    row.insertCell(1).innerHTML = description;
    row.insertCell(2).innerHTML = scheduledTime.toLocaleString();
    row.insertCell(3).innerHTML = "<button onclick='deleteReminder(this)'>Complete Task</button>";
};

function setTimerForTask(title = "Times Up!",) {
    const insults = [
        "You're as useful as a screen door on a submarine!",
        "I'd explain it to you, but I left my English-to-Dingbat dictionary at home.",
        "You're like a software update. Whenever I see you, I think, 'Not now.'",
        "If ignorance is bliss, you must be the happiest person on the planet.",
        "I'd agree with you, but then we'd both be wrong."
    ];
    //const reminderIntervals = [300000, 240000, 180000, 120000, 60000]; // 5min, 4min, 3min, 2min, 1min
    //console.log(reminderIntervals);

    // Check notification permissions
    //if (Notification.permission !== "granted") {
    //    Notification.requestPermission();
    //}
    //console.log(Notification.permission)

    // reminderIntervals.forEach((interval, index) => {
    //     if (timeDifference > interval) { // Only set reminders if there's enough time
    //         setTimeout(() => {
    //             alert(insults[index]);
    //         }, timeDifference - interval);
    //    }
    //});
    //console.log(timeDifference);
    const timeRemaining = 5000


    console.log("Starting timer");
    
    timeoutId = setTimeout(() => {
        console.log("times up playing sound")
        document.getElementById("notificationSound").play();
        if (Notification.permission === "granted") {
            new Notification(title, {
                body: "Time's up! You should've done this already!",
                requireInteraction: true
            });
        }

        alert(insults[Math.floor(Math.random() * insults.length)])
    }, timeRemaining);
    //console.log("Nevermind, cancelling timer");
    //clearTimeout(timeoutId);
    
    
};


function deleteReminder(button) {
    let congratsModal = new bootstrap.Modal(document.getElementById('congratsModal'));
    congratsModal.show();

    document.getElementById('congratsModal').addEventListener('hidden.bs.modal', function () {
        // Find the row and retrieve task details
        let row = button.parentElement.parentElement;
        let title = row.dataset.title;
        let week = row.dataset.week;
        
        // Remove the row from the table
        row.remove();

        // Get the schedule array from local storage
        const jsonSchedule = localStorage.getItem(ARRAY_KEY);
        let array = (jsonSchedule) ? JSON.parse(jsonSchedule) : [];

        // Filter out the completed task based on title and week
        array = array.filter(task => !(task.title === title && task.week === week));
        
        // Save the updated array back to local storage
        localStorage.setItem(ARRAY_KEY, JSON.stringify(array));

        // Remove the item from the day list as well
        let dayOfWeek = new Date(row.cells[2].textContent).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        let dayListId = week === 'week1' ? `${dayOfWeek}-list-week1` : `${dayOfWeek}-list-week2`;
        let dayList = document.getElementById(dayListId);
        let listItems = dayList.getElementsByTagName('li');

        // Find and remove the list item from the day list
        for (let item of listItems) {
            if (item.dataset.title === title && item.dataset.week === week) {
                item.remove();
                break;
            }
        }
    });
};

function pageLoad() {

    // get local storage
    const jsonSchedule = localStorage.getItem(ARRAY_KEY);
    const array = (jsonSchedule) ? JSON.parse(jsonSchedule) : [];

    for (let object of array) {
        const {title, description, date, time, week} = object;
        addReminder(title, description, new Date(date + " " + time), week);
    }
}

//function alerts() {
//    const currentTime = new Date();
//    const timeDifference = finalDateTime - currentTime;
//    while (timeDifference > 0) {
//        setTimeout(5000);
//    }
//    const insult = generateInsult();
//    alert(insult);
//}

pageLoad();

setTimerForTask();
