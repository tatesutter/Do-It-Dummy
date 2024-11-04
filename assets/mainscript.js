const ARRAY_KEY = "schedule";

function generateInsult() {
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
    return insults[Math.floor(Math.random() * insults.length)];
}

function scheduleReminder() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let week = document.getElementById("week-select").value;

    
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
        startReminderTimer(title, description, scheduledTime, timeDifference);
    } else {
        alert("The scheduled time is in the past!");
    }
}

function addReminder(title, description, scheduledTime, week) {
    let dayOfWeek = scheduledTime.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    let dayListId = week === 'week1' ? `${dayOfWeek}-list-week1` : `${dayOfWeek}-list-week2`;
    let dayList = document.getElementById(dayListId);

    
    let listItem = document.createElement('li');
    listItem.dataset.title = title; 
    listItem.dataset.week = week; 

    
    let titleElement = document.createElement('span');
    titleElement.textContent = title;
    titleElement.style.cursor = 'pointer'; 
    titleElement.onclick = function () {
        descriptionElement.classList.toggle('d-none'); 
    };

    
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("week-select").value = "week1";

    
    let descriptionElement = document.createElement('div');
    descriptionElement.textContent = `${description} at ${scheduledTime.toLocaleString()}`;
    descriptionElement.classList.add('d-none'); 

    
    listItem.appendChild(titleElement);
    listItem.appendChild(descriptionElement);
    dayList.appendChild(listItem);

    
    let tableBody = document.getElementById("reminderTableBody");
    let row = tableBody.insertRow();
    row.dataset.title = title; 
    row.dataset.week = week; 
    row.insertCell(0).innerHTML = title;
    row.insertCell(1).innerHTML = description;
    row.insertCell(2).innerHTML = scheduledTime.toLocaleString();
    row.insertCell(3).innerHTML = "<button onclick='deleteReminder(this)'>Complete Task</button>";
}

function startReminderTimer(title, description, finalDateTime, timeDifference) {
    const insultInterval = 1 * 30 * 1000; 
    const oneHourBeforeEnd = new Date(finalDateTime - 60 * 60 * 1000); 

    const interval = setInterval(() => {
        const currentTime = new Date();
        const remainingTime = finalDateTime - currentTime;

        if (remainingTime <= 0) {
            clearInterval(interval);
            document.getElementById("notificationSound").play();
            new Notification(title, {
                body: "Time's up! You should've done this already!",
                requireInteraction: true
            });
        } else if (currentTime >= oneHourBeforeEnd && remainingTime % insultInterval < 5000) {
            const insult = generateInsult();
            alert(insult);
        }
    }, 5000);
}

function deleteReminder(button) {
    let congratsModal = new bootstrap.Modal(document.getElementById('congratsModal'));
    congratsModal.show();

    document.getElementById('congratsModal').addEventListener('hidden.bs.modal', function () {
        let row = button.parentElement.parentElement;
        let title = row.dataset.title;
        let week = row.dataset.week;
        
        row.remove();

        const jsonSchedule = localStorage.getItem(ARRAY_KEY);
        let array = (jsonSchedule) ? JSON.parse(jsonSchedule) : [];
        array = array.filter(task => !(task.title === title && task.week === week));
        localStorage.setItem(ARRAY_KEY, JSON.stringify(array));

        let dayOfWeek = new Date(row.cells[2].textContent).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        let dayListId = week === 'week1' ? `${dayOfWeek}-list-week1` : `${dayOfWeek}-list-week2`;
        let dayList = document.getElementById(dayListId);
        let listItems = dayList.getElementsByTagName('li');

        for (let item of listItems) {
            if (item.dataset.title === title && item.dataset.week === week) {
                item.remove();
                break;
            }
        }
    });
}

function pageLoad() {
    const jsonSchedule = localStorage.getItem(ARRAY_KEY);
    const array = (jsonSchedule) ? JSON.parse(jsonSchedule) : [];
    for (let object of array) {
        const {title, description, date, time, week} = object;
        addReminder(title, description, new Date(date + " " + time), week);
    }
}

pageLoad();
