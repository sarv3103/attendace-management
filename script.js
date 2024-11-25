let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];

// Login Logic
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (username === 'admin' && password === '1234') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        renderTable();
        updateStats();
    } else {
        alert('Invalid login');
    }
});

// Logout
function logout() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

// Add Attendance
document.getElementById('attendance-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('student-name').value;
    const date = document.getElementById('attendance-date').value;
    const status = document.getElementById('attendance-status').value;

    attendanceData.push({ name, date, status });
    saveData();
    renderTable();
    updateStats();
});

// Save to Local Storage
function saveData() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
}

// Render Table
function renderTable(filteredData = attendanceData) {
    const tbody = document.getElementById('attendance-body');
    tbody.innerHTML = '';

    filteredData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.date}</td>
            <td class="${record.status.toLowerCase().replace(/\s/g, '')}">${record.status}</td>
            <td><button onclick="removeRecord(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Remove Record
function removeRecord(index) {
    attendanceData.splice(index, 1);
    saveData();
    renderTable();
    updateStats();
}

// Update Stats
function updateStats() {
    const total = attendanceData.length;
    const presentCount = attendanceData.filter(a => a.status === 'Present').length;
    const absentCount = attendanceData.filter(a => a.status === 'Absent').length;
    const cwCount = attendanceData.filter(a => a.status === 'College Work').length;

    document.getElementById('total-count').textContent = total;
    document.getElementById('present-count').textContent = presentCount;
    document.getElementById('absent-count').textContent = absentCount;
    document.getElementById('cw-count').textContent = cwCount;
}

// Filter Table
function filterTable() {
    const status = document.getElementById('filter-status').value;
    const filteredData = status === 'all' ? attendanceData : attendanceData.filter(record => record.status === status);
    renderTable(filteredData);
}

// Download Excel File
function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ["Student Name", "Date", "Status"],  
        ...attendanceData.map(record => [record.name, record.date, record.status]) 
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, 'attendance.xlsx');
}
