let currentRole = null;
let lineChartInstance = null;
let pieChartInstance = null;

function chooseRole(role) {
  currentRole = role;
  document.getElementById("roleSelect").classList.add("hidden");
  if (role === "teacher") {
    document.getElementById("teacherSection").classList.remove("hidden");
  } else {
    document.getElementById("studentSection").classList.remove("hidden");
  }
}

function saveMarks() {
  const id = document.getElementById("studentId").value.trim();
  const maths = parseInt(document.getElementById("maths").value);
  const physics = parseInt(document.getElementById("physics").value);
  const chemistry = parseInt(document.getElementById("chemistry").value);

  if (!id || isNaN(maths) || isNaN(physics) || isNaN(chemistry)) {
    alert("Please enter valid marks for all subjects!");
    return;
  }

  if (maths < 0 || maths > 100 || physics < 0 || physics > 100 || chemistry < 0 || chemistry > 100) {
    alert("Marks must be between 0 and 100.");
    return;
  }

  const subjects = ["Maths", "Physics", "Chemistry"];
  const marks = [maths, physics, chemistry];

  localStorage.setItem("student_" + id, JSON.stringify({ subjects, marks }));
  alert("Marks saved for Student ID: " + id);

  document.getElementById("studentId").value = "";
  document.getElementById("maths").value = "";
  document.getElementById("physics").value = "";
  document.getElementById("chemistry").value = "";
}

function showAnalysis() {
  const id = document.getElementById("studentLoginId").value.trim();
  const data = localStorage.getItem("student_" + id);

  if (!data) {
    alert("No data found for this Student ID!");
    return;
  }

  const { subjects, marks } = JSON.parse(data);

  if (lineChartInstance) lineChartInstance.destroy();
  if (pieChartInstance) pieChartInstance.destroy();

  const lineCtx = document.getElementById("lineChart").getContext("2d");
  const pieCtx = document.getElementById("pieChart").getContext("2d");

  lineChartInstance = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: subjects,
      datasets: [{
        label: "Marks",
        data: marks,
        fill: false,
        borderColor: "#3498db",
        backgroundColor: "#3498db",
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            display: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });

  pieChartInstance = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: subjects,
      datasets: [{
        data: marks,
        backgroundColor: ["#3498db", "#e67e22", "#2ecc71"]
      }]
    }
  });

  let gradesText = "";
  marks.forEach((m, i) => {
    let grade = "";
    if (m > 95) grade = "Excellent";
    else if (m > 85) grade = "Very Good";
    else if (m > 70) grade = "Good";
    else if (m > 50) grade = "Average";
    else grade = "Needs Improvement";
    gradesText += `${subjects[i]}: ${m} → ${grade}<br>`;
  });

  document.getElementById("gradeAnalysis").innerHTML = gradesText;
}

function logout() {
  currentRole = null;
  document.getElementById("teacherSection").classList.add("hidden");
  document.getElementById("studentSection").classList.add("hidden");
  document.getElementById("roleSelect").classList.remove("hidden");
  document.getElementById("gradeAnalysis").innerHTML = "";
}
