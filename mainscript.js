function scheduleReminder() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let week = document.getElementById("week-select").value;
    

    let dateTimeString = date + " " + time;
    let scheduledTime = new Date(dateTimeString);
    let currentTime = new Date();
    let timeDifference = scheduledTime - currentTime;

    if (timeDifference > 0) {
        addReminder(title, description, scheduledTime, week);

        let timeoutId = setTimeout(function () {
            document.getElementById("notificationSound").play();

            let Notification = new Notification(title, {
                body: description,
                requireInteraction: true
            });
        }, timeDifference);

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

function deleteReminder(button) {
    let congratsModal = new bootstrap.Modal(document.getElementById('congratsModal'));
    congratsModal.show();

   
    document.getElementById('congratsModal').addEventListener('hidden.bs.modal', function () {
       
        let row = button.parentElement.parentElement;
        let title = row.dataset.title;
        let week = row.dataset.week;
        row.remove();

      
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