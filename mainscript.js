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

function addReminder(title, description, scheduledTime, week) {
    let dayOfWeek = scheduledTime.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    let dayListId = week === 'week1' ? `${dayOfWeek}-list-week1` : `${dayOfWeek}-list-week2`;
    let dayList = document.getElementById(dayListId);

    // Create a list item for the reminder
    let listItem = document.createElement('li');

    // Create a span for the title
    let titleElement = document.createElement('span');
    titleElement.textContent = title;
    titleElement.style.cursor = 'pointer'; // Indicate that it's clickable
    titleElement.onclick = function() {
        descriptionElement.classList.toggle('d-none'); // Toggle visibility of description
    };

    // Create a div for the description
    let descriptionElement = document.createElement('div');
    descriptionElement.textContent = `${description} at ${scheduledTime.toLocaleString()}`;
    descriptionElement.classList.add('d-none'); // Hide description by default

    // Append title and description to the list item
    listItem.appendChild(titleElement);
    listItem.appendChild(descriptionElement);
    dayList.appendChild(listItem);

    // Add to the reminder table
    let tableBody = document.getElementById("reminderTableBody");
    let row = tableBody.insertRow();
    row.insertCell(0).innerHTML = title;
    row.insertCell(1).innerHTML = description;
    row.insertCell(2).innerHTML = scheduledTime.toLocaleString();
    row.insertCell(3).innerHTML = "<button onclick='deleteReminder(this)'>Delete</button>";
}
