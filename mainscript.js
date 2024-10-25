const insults = [
    `You’re not just mediocre; you’re a shining example of how low the bar can go!`,
    `If laziness were an Olympic sport, you’d win gold without breaking a sweat!`,
    `You could be a genius, but it seems you’re too busy proving the opposite!`,
    `Your potential is like a hidden treasure—buried deep and totally inaccessible!`,
    `If you were any more unmotivated, you’d qualify as a speed bump on the road to success!`,
    `You’ve mastered the art of setting the bar so low, even a snake couldn’t crawl under it!`,
    `You’re like a cloud—full of potential but mostly just blocking the sun!`,
    `At this rate, your biggest achievement will be breaking the record for most time wasted!`,
    `You’re a procrastinator’s poster child; even deadlines are scared of you!`,
    `If ignorance is bliss, you must be the happiest person on the planet!`
];

function generateInsult() {
    const randomIndex = Math.floor(Math.random() * insults.length);
    console.log(insults[randomIndex]);
    return insults[randomIndex];
}




function insultMe() {
    const insult = generateInsult();
    textContent = insult;
}

function timer() {
    
}

function notification() {
    if ("Notification" in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                console.log("Notifications are allowed");
            } else {
                alert("Please allow notifications");
                location.reload();
            }
        });
    } else {
        alert("This browser does not support notifications.");
    }
}

    let timeoutIds = [];

 function scheduleReminder() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    let dateTimeString = date + " " + time;
    let scheduledTime = new Date(dateTimeString);
    let currentTime = new Date();
    let timeDifference = scheduledTime - currentTime;

    if (timeDifference > 0) {
        addReminder(title, description, scheduledTime);

        let timeoutId = setTimeout(function () {
            document.getElementById("notificationSound").play();

            let notification = new Notification(title, {
                body: description,
                requireInteraction: true
            });
    }, timeDifference);

    timeoutIds.push(timeoutId);
    } else {
        alert("The scheduled time is in the past!");
    }
}

function addReminder(title, description, scheduledTime) {

    localStorage.setItem(title, description, scheduledTime);
    localStorage.getItem(title, description, scheduledTime);
    console.log(localStorage);

    let tableBody = document.getElementById("reminderTableBody");
    let dayOfWeek = scheduledTime.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    let dayList = document.getElementById(`${dayOfWeek}-list`);
    let listItem = document.createElement('li');
    listItem.textContent = `${title}: ${description} at ${scheduledTime.toLocaleString()}`;
    dayList.appendChild(listItem);

    // Optionally, also add to the table for reference
    let row = tableBody.insertRow();
    //row.insertCell(0).innerHTML = title;
    //row.insertCell(1).innerHTML = description;
    //row.insertCell(2).innerHTML = scheduledTime.toLocaleString();
    row.insertCell(0).innerHTML = "<button onclick='deleteReminder()'>Delete</button>";
}

function deleteReminder(button) {
    let row = button.closest("tr");
    let index = row.rowIndex;

    clearTimeout(timeoutIds[index - 1]);
    timeoutIds.splice(index - 1, 1);

    row.remove();
}


//function dateInput() {
//    let dateInput = document.getElementById("date");
//}

function main() {
    notification();
}

document.getElementById("reminderButton").addEventListener("click", scheduleReminder);

main();
