let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");
const dropdownParent = document.querySelector(".dropdown");
const dropdownBtn = document.querySelector(".dropdown-btn");


toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
  if (navigation.classList.contains("active") && dropdownParent) {
    dropdownParent.classList.remove("active");
  }
};
if (dropdownBtn) {
    dropdownBtn.addEventListener("click", function(event) {
        event.preventDefault();
        dropdownParent.classList.toggle("active");
    });
}

// ==========================================
// 3. Auto-Expand Sidebar & Double-Click Navigation
// ==========================================
let navLinks = document.querySelectorAll(".navigation ul li a");

navLinks.forEach(link => {
    // SINGLE CLICK: Handles Sidebar Expansion
    link.addEventListener("click", function(event) {
        let href = this.getAttribute("href");
        
        // Prevent immediate navigation on single click for real links
        if (href && href !== "#" && !this.hasAttribute("onclick")) {
            event.preventDefault();
        }

        // If sidebar is currently collapsed (has 'active' class), expand it
        if (navigation.classList.contains("active")) {
            event.preventDefault(); 
            navigation.classList.remove("active");
            main.classList.remove("active");
        }
    });

    // DOUBLE CLICK: Handles actual navigation
    link.addEventListener("dblclick", function(event) {
        let href = this.getAttribute("href");
        let target = this.getAttribute("target");

        // Only navigate if it's a real link (not the Brand or Reset button)
        if (href && href !== "#" && !this.hasAttribute("onclick")) {
            if (target === "_blank") {
                window.open(href, '_blank'); // Opens Ward links in new tab
            } else {
                window.location.href = href; // Opens in same tab
            }
        }
    });
});

// ==========================================
// 4. Shared Data & Medical Table Rendering
// ==========================================
const recordForm = document.getElementById("recordForm");
const recordTableBody = document.getElementById("recordTableBody");

// Default Ward Data (Used if nothing is in local storage yet)


// Aggregate data from all specific ward storage keys
function getAllWardData() {
    const wardKeys = ['ward_data_General', 'ward_data_ICU', 'ward_data_Maternity', 'ward_data_Paediatrics'];
    let allSlots = [];

    wardKeys.forEach(key => {
        const wardData = JSON.parse(localStorage.getItem(key));
        if (wardData) {
            // We now take the entire array (including null patients)
            allSlots = allSlots.concat(wardData);
        }
    });

    // Return all slots found in the database
    return allSlots;
}

function renderTable() {
    const recordTableBody = document.getElementById("recordTableBody");
    const totalReportsText = document.getElementById("total-reports");
    const totalSlotsText = document.getElementById("total-slots");
    
    if (!recordTableBody) return;
    
    recordTableBody.innerHTML = ""; 
    
    const statusPriority = {
        "critical": 1,
        "recovering": 2,
        "stable": 3,
        "discharged": 4
    };

    let allSlots = getAllWardData();

    const activePatients = allSlots.filter(slot => slot.patient !== null);
    const emptySlotsCount = allSlots.filter(slot => slot.patient === null).length;


    if (totalReportsText) {
        totalReportsText.innerText = activePatients.length;
    }
    if (totalSlotsText) {
        totalSlotsText.innerText = emptySlotsCount;
    }

    activePatients.sort((a, b) => {
        const statusA = a.patient.status.toLowerCase();
        const statusB = b.patient.status.toLowerCase();
        return (statusPriority[statusA] || 99) - (statusPriority[statusB] || 99);
    });

    activePatients.forEach(slot => {
        const p = slot.patient;
        const newRow = document.createElement("tr");
        
        newRow.innerHTML = `
            <td style="text-align: center; font-weight: 500;">${slot.ward}</td>
            <td style="text-align: left;">${p.name}</td>
            <td style="text-align: center;">${p.age}</td>
            <td style="text-align: center;"><span class="status ${p.status}">${p.status}</span></td>
        `;
        recordTableBody.appendChild(newRow);
    });
}

function resetDatabase() {
    localStorage.removeItem('medical_users');
    localStorage.removeItem('ward_data_General');
    localStorage.removeItem('ward_data_ICU');
    localStorage.removeItem('ward_data_Maternity');
    localStorage.removeItem('ward_data_Paediatrics');

    alert("Database cleared! Redirecting to login...");
    window.location.href = "/index.html";
}
// Initial render when homepage loads
renderTable();
function hardResetWards() {
    const nav = document.querySelector(".navigation");
    
    // If the sidebar is still collapsed (active class is present), 
    // don't reset yet—let the sidebar expand first.
    if (nav.classList.contains("active")) {
        return; 
    }

    const wardNames = ['General', 'ICU', 'Maternity', 'Paediatrics'];
    wardNames.forEach(ward => {
        const emptyData = [
            { id: 1, ward: ward, patient: null },
            { id: 2, ward: ward, patient: null },
            { id: 3, ward: ward, patient: null },
            { id: 4, ward: ward, patient: null }
        ];
        localStorage.setItem(`ward_data_${ward}`, JSON.stringify(emptyData));
    });

    window.location.href = "/KaiXin.html";
}