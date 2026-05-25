// ==========================================
// AI Integration Logic
// ==========================================

// Function to manually open the chat bubble
function openAISupport() {
    if (window.chatbase) {
        window.chatbase("open");
    }
}

// 1. Listen for the native Chatbase close event
function setupChatbaseCloseListener() {
    const checkChatbase = setInterval(() => {
        if (window.chatbase && typeof window.chatbase === 'function') {
            window.chatbase("listen", {
                onClose: () => {
                    console.log("Chatbox closed - running reset code.");
                    // Reset the chat using your provided code
                    if (typeof window.chatbase.resetChat === 'function') {
                        window.chatbase.resetChat();
                    } else {
                        // Fallback just in case the API structure requires the string method
                        window.chatbase("reset"); 
                    }
                },
            });
            clearInterval(checkChatbase); // Stop polling once attached
        }
    }, 500); // Poll every 500ms until Chatbase is fully loaded
}

// 2. Fallback Listener: Detects the background message from the iframe when minimized
window.addEventListener('message', function(event) {
    if (typeof event.data === 'string' && event.data.toLowerCase().includes('close')) {
        console.log("Chatbox minimized - running reset code.");
        if (window.chatbase && typeof window.chatbase.resetChat === 'function') {
            window.chatbase.resetChat();
        } else if (window.chatbase) {
            window.chatbase("reset");
        }
    }
});

// ==========================================
// 1. Sidebar Logic 
// ==========================================
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");
const dropdownParent = document.querySelector(".dropdown");
const dropdownBtn = document.querySelector(".dropdown-btn");

// Toggle Sidebar
if (toggle) {
    toggle.onclick = function () {
      navigation.classList.toggle("active");
      if(main) main.classList.toggle("active");

      // Force dropdown close if sidebar collapses
      if (navigation.classList.contains("active") && dropdownParent) {
        dropdownParent.classList.remove("active");
      }
    };
}

// Toggle Ward Dropdown
if (dropdownBtn) {
    dropdownBtn.addEventListener("click", function(event) {
        event.preventDefault(); 
        dropdownParent.classList.toggle("active");
    });
}

// Auto-Expand & Navigation Links
let navLinks = document.querySelectorAll(".navigation ul li a");
navLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        let href = this.getAttribute("href");
        if (href && href !== "#" && !this.hasAttribute("onclick")) {
            event.preventDefault();
        }
        if (navigation && navigation.classList.contains("active")) {
            event.preventDefault(); 
            navigation.classList.remove("active");
            if(main) main.classList.remove("active");
        }
    });

    link.addEventListener("dblclick", function(event) {
        let href = this.getAttribute("href");
        let target = this.getAttribute("target");

        if (href && href !== "#" && !this.hasAttribute("onclick")) {
            if (target === "_blank") {
                window.open(href, '_blank'); 
            } else {
                window.location.href = href; 
            }
        }
    });
});

function resetDatabase() {
    if (confirm("Are you sure you want to reset all accounts?")) {
        // Clear all ward keys
        localStorage.removeItem('ward_data_General');
        localStorage.removeItem('ward_data_ICU');
        localStorage.removeItem('ward_data_Maternity');
        localStorage.removeItem('ward_data_Paediatrics');
        alert("Database cleared! Refreshing page.");
        window.location.reload();
    }
}

// ==========================================
// 2. Dynamic Ward Detection
// ==========================================
let currentWard = "General"; // Default to General
const path = window.location.pathname.toLowerCase();

if (path.includes("icu")) {
    currentWard = "ICU";
} else if (path.includes("maternity")) {
    currentWard = "Maternity";
} else if (path.includes("paediatrics")) {
    currentWard = "Paediatrics";
}

// ==========================================
// 3. Shared Ward Slots & Isolated Storage
// ==========================================
const storageKey = `ward_data_${currentWard}`;

let wardSlots = JSON.parse(localStorage.getItem(storageKey));

if (!wardSlots) {
    wardSlots = [
        { id: 1, ward: currentWard, patient: { name: "John Doe", age: 45, condition: "Type 2 Diabetes, Hypertension management. Requires regular blood sugar monitoring.", status: "stable" } },
        { id: 2, ward: currentWard, patient: { name: "Jane Smith", age: 29, condition: "Post-op recovery from appendectomy. Vitals are stable, checking surgical site for infection.", status: "recovering" } },
        { id: 3, ward: currentWard, patient: { name: "Robert Wilson", age: 72, condition: "Acute respiratory distress syndrome. Needs constant oxygen monitoring and ventilator support.", status: "critical" } },
        { id: 4, ward: currentWard, patient: null } 
    ];
}

function saveToStorage() {
    localStorage.setItem(storageKey, JSON.stringify(wardSlots));
}

const patientList = document.getElementById('patient-list');
const patientCountText = document.getElementById('patient-count');
const modalOverlay = document.getElementById('modal-overlay');
const patientForm = document.getElementById('patient-form');
const closeBtn = document.getElementById('close-modal-btn');
const modalTitle = document.getElementById('modal-title');

function init() {
    renderPatients();
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function renderPatients() {
    if (!patientList) return; 

    let activePatients = wardSlots.filter(slot => slot.patient !== null).length;
    if (patientCountText) {
        patientCountText.innerText = `${activePatients} patient${activePatients !== 1 ? "s" : ""} in the ${currentWard} ward`;
    }

    patientList.innerHTML = wardSlots.map((slot, index) => {
        if (slot.patient !== null) {
            let p = slot.patient;
            return `
                <div class="patient-card group bg-white hover:shadow-lg transition-all duration-300 border border-slate-200 rounded-xl overflow-hidden" 
                     style="animation-delay: ${index * 0.08}s">
                    <div class="p-6">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex items-start gap-4 min-w-0 flex-1">
                                <div class="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                    <span class="text-[#2a2185] font-bold">#${slot.id}</span>
                                </div>
                                <div class="min-w-0 flex-1 space-y-3">
                                    <div class="flex items-center justify-between gap-2">
                                        <h3 class="text-lg font-semibold text-slate-900 truncate">${p.name}</h3>
                                        <span class="status-${p.status} border px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shrink-0">
                                            ${p.status}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1.5 text-slate-500 text-sm">
                                        <i data-lucide="calendar" class="h-3.5 w-3.5"></i>
                                        <span>${p.age} years old</span>
                                    </div>
                                    <div class="flex items-start gap-1.5 text-base text-slate-600">
                                        <i data-lucide="stethoscope" class="h-4 w-4 shrink-0 mt-1"></i>
                                        <div class="flex flex-col gap-1 w-full">
                                            <span class="font-medium text-slate-800" style="word-break: break-word; white-space: normal;">
                                                ${p.condition}
                                            </span>
                                            <button onclick="openAISupport()" class="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2 w-max">
                                                <i data-lucide="bot" class="h-3 w-3"></i> Consult AI
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onclick="openModal(${slot.id})" class="p-2 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600" title="Edit Patient">
                                    <i data-lucide="pencil" class="h-4 w-4"></i>
                                </button>
                                <button onclick="removePatient(${slot.id})" class="p-2 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600" title="Remove Patient">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="patient-card group border-2 border-dashed border-slate-300 hover:border-[#2a2185] bg-slate-50 hover:bg-white transition-all duration-300 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center py-10" 
                     onclick="openModal(${slot.id})" style="animation-delay: ${index * 0.08}s">
                    <div class="text-center text-slate-400 group-hover:text-[#2a2185] transition-colors">
                        <i data-lucide="plus-circle" class="h-10 w-10 mx-auto mb-2"></i>
                        <p class="text-sm font-medium">Add Patient to Slot ${slot.id}</p>
                    </div>
                </div>
            `;
        }
    }).join('');
    
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function openModal(slotId) {
    const slot = wardSlots.find(s => s.id === slotId);
    if (!slot) return;

    document.getElementById('form-id').value = slot.id;

    if (slot.patient) {
        modalTitle.innerText = "Edit Patient";
        document.getElementById('form-name').value = slot.patient.name;
        document.getElementById('form-age').value = slot.patient.age;
        document.getElementById('form-condition').value = slot.patient.condition;
        document.getElementById('form-status').value = slot.patient.status;
    } else {
        modalTitle.innerText = `Add Patient to ${currentWard}`;
        patientForm.reset();
        document.getElementById('form-status').value = "stable"; 
    }

    modalOverlay.classList.remove('hidden');
}

function removePatient(slotId) {
    const slotIndex = wardSlots.findIndex(s => s.id === slotId);
    if (slotIndex !== -1) {
        wardSlots[slotIndex].patient = null;
        saveToStorage(); 
        renderPatients();
    }
}

function closeModal() {
    if(modalOverlay) modalOverlay.classList.add('hidden');
}

if(closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// ==========================================
// 4. Form Submission
// ==========================================
if (patientForm) {
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const slotId = parseInt(document.getElementById('form-id').value);
        const submitBtn = document.getElementById('submit-btn');
        
        submitBtn.disabled = true;
        submitBtn.innerText = "Saving...";

        setTimeout(() => {
            const slotIndex = wardSlots.findIndex(s => s.id === slotId);
            if (slotIndex !== -1) {
                wardSlots[slotIndex].ward = currentWard; 
                wardSlots[slotIndex].patient = {
                    name: document.getElementById('form-name').value,
                    age: parseInt(document.getElementById('form-age').value),
                    condition: document.getElementById('form-condition').value,
                    status: document.getElementById('form-status').value
                };
            }

            saveToStorage(); 
            renderPatients();
            closeModal();
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i data-lucide="save" class="h-4 w-4"></i> Save Changes`;
            if(typeof lucide !== 'undefined') lucide.createIcons();
        }, 400);
    });
}

// ==========================================
// 5. Initialize Application
// ==========================================
// Run Init and Setup AI listener
window.onload = function() {
    init();
    setupChatbaseCloseListener();
};
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