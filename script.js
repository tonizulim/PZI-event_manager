let conuter = 0
let events = []
let filterEvents = []

document.addEventListener('DOMContentLoaded', async function () {
    
    events = localStorage.getItem('events');
	
	//localStorage.setItem('events', JSON.stringify([]));
	
	if (events) {
		const parsedEvents = JSON.parse(events);
	
		parsedEvents.map(element => {
			handleAddEvent(element.title, element.imgURL, element.description, element.location, element.startDate, element.endDate, element.id);
			conuter = element.id
		});
        
        events = parsedEvents
	} else {
		console.log("No events found in localStorage");
	}

	fetch('https://raw.githubusercontent.com/samayo/country-json/refs/heads/master/src/country-by-capital-city.json')
    .then(response => response.json())
    .then(data => {
        const locationSelect = document.getElementById('location');

        data.forEach(entry => {
		    const location = entry.city ? entry.city + ", " + entry.country : entry.country
            const option = document.createElement('option');
	
            option.value = location;
            option.textContent = location;

            locationSelect.appendChild(option);
        });
    })
    .catch(error => {
      console.error('Error fetching capitals:', error);
      alert('Došlo je do pogreške prilikom učitavanja lokacija.');
    });

    const XIcons = document.querySelectorAll('.x-icon');
	for (let i = 0; i < XIcons.length; i++) {
		const XIcon = XIcons[i];
		XIcon.addEventListener('click', handleXIconClick);
	}

	const form = document.getElementById('event-form');
	form.addEventListener('submit', function(event){
		event.preventDefault()
		handleSubmitButtonClick(event)
        form.reset();
        resetDatePicker();
	});

    document.getElementById("filter-location").addEventListener("change", handleFilterElements);
    addFilterOptions();

    displayDates();
	console.log("aaa");
});

function handleSubmitButtonClick(event) {

	event.preventDefault();

	const title = document.getElementById('title').value; 
	const imgURL =  document.getElementById('image').value;
	const description =  document.getElementById('description').value;
	const location =  document.getElementById('location').value;
	const startDate =  document.getElementById('start-date').value;
	let endDate =  document.getElementById('end-date').value;

    if(endDate === ""){
        endDate = startDate;
    }

	conuter += 1
    
	handleAddEvent(title, imgURL, description, location, startDate, endDate, conuter);

	const id = conuter
	const newEvent = {title, imgURL, description, location,startDate,endDate, id}

	events.push(newEvent);
	localStorage.setItem('events', JSON.stringify(events));
    addFilterOptions();
}

function handleAddEvent(title, imgURL, description, location, startDate, endDate, id) {
	const eventTemplate = document.getElementById('event-template');
	const eventNode = document.importNode(eventTemplate.content, true);
	const eventElement = eventNode.querySelector('.event');

	eventElement.setAttribute('event-id', id);

	eventElement.querySelector('.event-title-label').textContent = "Title: " + title;

	const eventImg = document.createElement('img');
    eventImg.src = imgURL;
    eventImg.alt = imgURL; 
	eventElement.querySelector('.paragraph-container').appendChild(eventImg);

    const eventDescription = document.createElement('p');
	eventDescription.innerText = "Desscription: " + description;
	eventElement.querySelector('.paragraph-container').appendChild(eventDescription);

    const eventLocation = document.createElement('p');
	eventLocation.innerText = "Location: " + location;
	eventElement.querySelector('.paragraph-container').appendChild(eventLocation);

    const eventStart = document.createElement('p');
	eventStart.innerText = "Start date: " + startDate;
	eventElement.querySelector('.paragraph-container').appendChild(eventStart);

    const eventEnd = document.createElement('p');
	eventEnd.innerText = "End date: " + endDate;
	eventElement.querySelector('.paragraph-container').appendChild(eventEnd);

	eventElement.querySelector('.x-icon').addEventListener('click', handleXIconClick);

	const eventContainer = document.getElementById('show-event-container');
	eventContainer.appendChild(eventElement);
}

const handleXIconClick = async (event) => {
	const clickedPlusIcon = event.currentTarget;

	const parentElement = clickedPlusIcon.parentElement.parentElement;

	const isConfirmed = confirm(
		`Do you wish to delete the '${parentElement.querySelector('.event-title-label').textContent}' event?`
	);

	if (isConfirmed) {

        const id = parentElement.getAttribute('event-id')
        events = events.filter(element => element.id !== Number(id));

        localStorage.setItem('events', JSON.stringify(events));

		parentElement.remove();

        addFilterOptions();
	}
};

const addFilterOptions = () => {
    let allLocations = []
    let locations = []
	if(events == null){
		retrun false;
	}
    events.forEach(element => {
        allLocations.push(element.location);
    })

    allLocations.forEach(element => {
        if (!locations.includes(element)) { 
            locations.push(element);
        }
    });

    const locationSelect = document.getElementById('filter-location');
    locationSelect.innerHTML = "";

    const allEvents = document.createElement('option');

    allEvents.value = "";
    allEvents.textContent = "All events";

    locationSelect.appendChild(allEvents);

    locations.forEach(element => {
        const option = document.createElement('option');

        option.value = element;
        option.textContent = element;

        locationSelect.appendChild(option);
    });

    handleFilterElements();
}

function handleFilterElements(){
    let selectedLocation = document.getElementById("filter-location").value

    selectedLocation === "" ? filterEvents = events : filterEvents = events.filter(element => element.location == selectedLocation);

    const eventContainer = document.getElementById("show-event-container");

    eventContainer.innerHTML = "";

    filterEvents.map(element => {
        handleAddEvent(element.title, element.imgURL, element.description, element.location, element.startDate, element.endDate, element.id, 1);
    });
    
};



const datepicker = document.getElementById("datepicker");
const nextBtn = document.getElementById("next-month");
const prevBtn = document.getElementById("prev-month");
const monthInput = document.getElementById("month-input");
const yearInput = document.getElementById("year-input");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const dates = document.getElementById("dates");

let startDate = new Date();
let endDate = new Date();
let selectedDatesCounter = 0;

let year =startDate.getFullYear();
let month =startDate.getMonth();

const resetDatePicker = () => {
    startDate = new Date();
    endDate = new Date();
    selectedDatesCounter = 0;
    
    year =startDate.getFullYear();
    month =startDate.getMonth();

    const selected = dates.querySelectorAll(".selected");
    const between = dates.querySelectorAll(".between");

    selected.forEach(element => {
        element && element.classList.remove("selected");
    });

    between.forEach(element => {
        element && element.classList.remove("between");
    });
}

nextBtn.addEventListener("click", () => {
    month++;
    if (month === 12){
        year++;
        month = 0;
    }
    displayDates();
});

prevBtn.addEventListener("click", () => {
    month--;
    if (month === -1){
        year--;
        month = 11;
    } 
    displayDates();
});

monthInput.addEventListener("change", () => {
    month = parseInt(monthInput.value);
    displayDates();
  });

  
yearInput.addEventListener("change", () => {
    year = yearInput.value;
    displayDates();
});


const displayDates = () => {
    monthInput.value = month;
    yearInput.value = year;
  
    dates.innerHTML = "";

    const lastDayOfPrevMonth = new Date(year, month, 0);
    
    for (let i = 1; i <= lastDayOfPrevMonth.getDay(); i++) {
        const day = lastDayOfPrevMonth.getDate()-lastDayOfPrevMonth.getDay()+i;
        const button = createButton(day, true, -1);
        dates.appendChild(button);
    }
    
    const lastDayOfCurrentMonth = new Date(year, month + 1, 0);
  
    for (let i = 1; i <= lastDayOfCurrentMonth.getDate(); i++) {
        const button = createButton(i, false, 0);
        button.addEventListener("click", handleDateButtonClick);
        dates.appendChild(button);
    }

    for (let i = lastDayOfCurrentMonth.getDay(); i <= 6; i++) {
        const button = createButton(i-lastDayOfCurrentMonth.getDay()+1, true, 1);
        dates.appendChild(button);
    }
};

const createButton = (text, isDisabled, prevNextMonth) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.disabled = isDisabled;
    button.setAttribute("type", "button")

    const currentDate = new Date();

    let comparisonDate = new Date(year, month, text);

    if(prevNextMonth < 0){
        button.classList.add("prev");
        comparisonDate = new Date (year, month - 1, text)
    }else if(prevNextMonth > 0){
        button.classList.add("next");
        comparisonDate = new Date (year, month + 1, text)
    }
  
    if(currentDate.getDate() === text && currentDate.getFullYear() === year && currentDate.getMonth() === month){
        button.classList.add("today");   
    }

    if(comparisonDate < currentDate){
        button.disabled = true;
        return button;
    }
  
    if(startDate.getTime() === comparisonDate.getTime() || endDate.getTime() === comparisonDate.getTime()){
        button.classList.add("selected");
    }

    if(startDate < comparisonDate && endDate > comparisonDate){
        button.classList.add("between");
    }
  
    return button;
};

const handleDateButtonClick = (event) => {
    const button = event.target;

    const selected = dates.querySelectorAll(".selected");
    let buttons = dates.querySelectorAll("*")

    let selectedDate = new Date(year, month, parseInt(button.textContent));

    if(selectedDatesCounter == 0 || selectedDatesCounter == 2 || selectedDate < startDate){
        selected.forEach(element => {
            element && element.classList.remove("selected");
        });
    
        buttons.forEach(element => {
            element.classList.remove("between");
        }); 

        startDate = selectedDate;
        startDateInput.value = startDate.toDateString();
        endDateInput.value = "";
        endDate = startDate;
        selectedDatesCounter = 1;
    }
    else{
        endDate = selectedDate;
        endDateInput.value = endDate.toDateString();
        selectedDatesCounter = 2;

        if(startDate.getMonth() != endDate.getMonth()){
            const prevs = dates.querySelectorAll(".prev");

            prevs.forEach(element => {
                if(parseInt(element.textContent) > startDate.getDate()){
                    element.classList.add("between");
                }
            }); 

            buttons.forEach(element => {
                if(!element.classList.contains("prev") && !element.classList.contains("next") && endDate.getFullYear() >= year && endDate.getMonth() >= month && endDate.getDate() > parseInt(element.textContent)){
                    element.classList.add("between");
                }
            })
        }

    }

    button.classList.add("selected")

    buttons.forEach(element => {
        if(!element.disabled && startDate.getFullYear() <= year && startDate.getMonth() <= month && startDate.getDate() < parseInt(element.textContent) && endDate.getFullYear() >= year && endDate.getMonth() >= month && endDate.getDate() > parseInt(element.textContent)){
            element.classList.add("between");
        }
    })
}




