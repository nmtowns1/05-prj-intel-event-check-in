const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamInput = document.getElementById("teamSelect");

//Track attendence
let count = 0;
const maxCount = 5;
let attendees = [];

//Load saved counts from localStorage
function loadCounts() {
  const savedCount = localStorage.getItem("totalCount");
  const savedWaterCount = localStorage.getItem("waterCount");
  const savedZeroCount = localStorage.getItem("zeroCount");
  const savedPowerCount = localStorage.getItem("powerCount");
  const savedAttendees = localStorage.getItem("attendees");

  if (savedCount !== null) {
    count = parseInt(savedCount);
    document.getElementById("attendeeCount").textContent = count;

    const percentage = Math.round((count / maxCount) * 100);
    document.getElementById("progressBar").style.width = percentage + "%";
  }

  if (savedWaterCount !== null) {
    document.getElementById("waterCount").textContent = savedWaterCount;
  }

  if (savedZeroCount !== null) {
    document.getElementById("zeroCount").textContent = savedZeroCount;
  }

  if (savedPowerCount !== null) {
    document.getElementById("powerCount").textContent = savedPowerCount;
  }

  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
    displayAttendees();
  }
}

//Save counts to localStorage
function saveCounts() {
  localStorage.setItem("totalCount", count);
  localStorage.setItem(
    "waterCount",
    document.getElementById("waterCount").textContent,
  );
  localStorage.setItem(
    "zeroCount",
    document.getElementById("zeroCount").textContent,
  );
  localStorage.setItem(
    "powerCount",
    document.getElementById("powerCount").textContent,
  );
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

//Display attendees list
function displayAttendees() {
  const attendeeListElement = document.getElementById("attendeeList");
  attendeeListElement.innerHTML = "";

  if (attendees.length === 0) {
    attendeeListElement.innerHTML =
      '<p style="color: #94a3b8; text-align: center; padding: 20px;">No attendees yet</p>';
    return;
  }

  attendees.forEach(function (attendee) {
    const attendeeItem = document.createElement("div");
    attendeeItem.className = `attendee-item ${attendee.team}`;

    const attendeeName = document.createElement("span");
    attendeeName.className = "attendee-name";
    attendeeName.textContent = attendee.name;

    const attendeeTeam = document.createElement("span");
    attendeeTeam.className = "attendee-team";
    attendeeTeam.textContent = attendee.teamName;

    attendeeItem.appendChild(attendeeName);
    attendeeItem.appendChild(attendeeTeam);
    attendeeListElement.appendChild(attendeeItem);
  });
}

//Load counts when page loads
loadCounts();

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  //get form values
  const name = nameInput.value.trim();
  const team = teamInput.value;
  const teamName = teamInput.selectedOptions[0].text; // Get the selected team name

  //Increment count
  if (count < maxCount) {
    count++;

    //Update team counter
    const teamCounter = document.getElementById(`${team}Count`);
    teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

    //Add attendee to list
    attendees.push({
      name: name,
      team: team,
      teamName: teamName,
    });

    //Display updated attendee list
    displayAttendees();
  }

  //Update attendee count display
  const attendeeCountDisplay = document.getElementById("attendeeCount");
  attendeeCountDisplay.textContent = count;

  //Update progress bar
  const percentage = Math.round((count / maxCount) * 100);
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage + "%";

  //Save counts to localStorage
  saveCounts();

  //Show welcome message
  let welcomeMessage = `Welcome ${name} to the ${teamName} team!`;

  if (count == maxCount) {
    // Get the count for each team
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent,
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent,
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent,
    );

    // Find which team has the most
    let leadingTeam = "";
    let maxTeamCount = 0;

    if (waterCount > maxTeamCount) {
      maxTeamCount = waterCount;
      leadingTeam = "Water Wise";
    }

    if (zeroCount > maxTeamCount) {
      maxTeamCount = zeroCount;
      leadingTeam = "Net Zero";
    }

    if (powerCount > maxTeamCount) {
      maxTeamCount = powerCount;
      leadingTeam = "Renewables";
    }

    welcomeMessage = `🎉 Congratulations! We've reached our goal of ${maxCount} attendees! 🎉 The winning team is ${leadingTeam}!`;
  }

  const greetingElement = document.getElementById("greeting");
  greetingElement.textContent = welcomeMessage;
  greetingElement.className = "success-message";
  greetingElement.style.display = "block";

  form.reset(); // Reset form fields
});
