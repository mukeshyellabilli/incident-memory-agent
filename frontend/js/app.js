// ========================================
// AI INCIDENT MEMORY AGENT
// Frontend JavaScript
// ========================================


// ========================================
// FASTAPI BACKEND URL
// ========================================

const API_BASE_URL = "http://127.0.0.1:8000";

const ANALYZE_API_URL =
    `${API_BASE_URL}/analyze-incident`;

const REMEMBER_API_URL =
    `${API_BASE_URL}/remember-resolution`;


// ========================================
// GET HTML ELEMENTS
// ========================================

const incidentDescription =
    document.getElementById("incidentDescription");

const analyzeButton =
    document.getElementById("analyzeButton");

const loadingSection =
    document.getElementById("loadingSection");

const resultsSection =
    document.getElementById("resultsSection");

const memoryResults =
    document.getElementById("memoryResults");

const memoryCount =
    document.getElementById("memoryCount");

const aiAnalysis =
    document.getElementById("aiAnalysis");

const errorSection =
    document.getElementById("errorSection");

const errorMessage =
    document.getElementById("errorMessage");


// ========================================
// REMEMBER RESOLUTION ELEMENTS
// ========================================

const resolutionDescription =
    document.getElementById("resolutionDescription");

const rememberButton =
    document.getElementById("rememberButton");

const rememberStatus =
    document.getElementById("rememberStatus");


// ========================================
// BUTTON EVENTS
// ========================================

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        analyzeIncident
    );

}


if (rememberButton) {

    rememberButton.addEventListener(
        "click",
        rememberResolution
    );

}


// ========================================
// ANALYZE INCIDENT
// ========================================

async function analyzeIncident() {

    const incident =
        incidentDescription.value.trim();


    // ========================================
    // VALIDATE INCIDENT
    // ========================================

    if (!incident) {

        showError(
            "Please describe the incident before analyzing."
        );

        incidentDescription.focus();

        return;
    }


    // ========================================
    // CLEAR PREVIOUS ERRORS
    // ========================================

    hideError();


    // ========================================
    // RESET RESULTS
    // ========================================

    resultsSection.classList.add("d-none");

    memoryResults.innerHTML = "";

    aiAnalysis.innerHTML = "";

    memoryCount.textContent =
        "0 Memory Facts";


    // ========================================
    // SHOW LOADING
    // ========================================

    loadingSection.classList.remove(
        "d-none"
    );

    analyzeButton.disabled = true;

    analyzeButton.innerHTML = `
        <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
        ></span>
        Analyzing...
    `;


    try {

        // ========================================
        // CALL FASTAPI
        // ========================================

        const response =
            await fetch(
                ANALYZE_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        incident_description: incident
                    })
                }
            );


        // ========================================
        // HANDLE HTTP ERRORS
        // ========================================

        if (!response.ok) {

            let errorText =
                `Server returned ${response.status}.`;

            try {

                const errorData =
                    await response.json();

                if (errorData.detail) {

                    errorText =
                        errorData.detail;

                }

            } catch (jsonError) {

                console.warn(
                    "Could not read server error response."
                );

            }

            throw new Error(
                errorText
            );

        }


        // ========================================
        // READ RESPONSE
        // ========================================

        const data =
            await response.json();


        // ========================================
        // DISPLAY RESULTS
        // ========================================

        displayResults(data);


    } catch (error) {

        console.error(
            "Analysis error:",
            error
        );


        // ========================================
        // CONNECTION ERROR
        // ========================================

        if (
            error instanceof TypeError
        ) {

            showError(
                "Unable to connect to the Incident Agent. " +
                "Please make sure the FastAPI server is running."
            );

        } else {

            showError(
                error.message ||
                "Unable to analyze the incident."
            );

        }

    } finally {

        // ========================================
        // HIDE LOADING
        // ========================================

        loadingSection.classList.add(
            "d-none"
        );


        // ========================================
        // RESTORE BUTTON
        // ========================================

        analyzeButton.disabled = false;

        analyzeButton.innerHTML = `
            <i class="bi bi-search me-2"></i>
            Analyze Incident
        `;

    }

}


// ========================================
// DISPLAY RESULTS
// ========================================

function displayResults(data) {

    const memories =
        data.historical_memories || [];

    const analysis =
        data.ai_analysis || "";


    // ========================================
    // MEMORY COUNT
    // ========================================

    const count =
        memories.length;

    memoryCount.textContent =
        `${count} Memory ${count === 1 ? "Fact" : "Facts"}`;


    // ========================================
    // AI ANALYSIS
    // ========================================

    if (analysis) {

        aiAnalysis.innerHTML =
            formatAnalysis(analysis);

    } else {

        aiAnalysis.innerHTML = `

            <div class="text-center py-4">

                <i
                    class="bi bi-info-circle fs-1 text-secondary"
                ></i>

                <h5 class="mt-3">
                    No AI Analysis Available
                </h5>

                <p class="text-secondary mb-0">
                    Hindsight did not generate an analysis
                    for this incident.
                </p>

            </div>

        `;

    }


    // ========================================
    // NO MEMORIES
    // ========================================

    if (count === 0) {

        memoryResults.innerHTML = `

            <div class="text-center py-4">

                <i
                    class="bi bi-search fs-1 text-secondary"
                ></i>

                <h5 class="mt-3">
                    No Similar Incidents Found
                </h5>

                <p class="text-secondary mb-0">
                    Hindsight did not find any relevant
                    historical incidents.
                </p>

            </div>

        `;

    }


    // ========================================
    // DISPLAY MEMORIES
    // ========================================

    else {

        memories.forEach(
            (memory, index) => {

                const memoryCard =
                    document.createElement("div");

                memoryCard.className =
                    "memory-card";


                memoryCard.innerHTML = `

                    <div class="d-flex align-items-start">

                        <div class="memory-number me-3">
                            ${index + 1}
                        </div>

                        <div class="memory-text flex-grow-1">
                            ${escapeHtml(memory)}
                        </div>

                    </div>

                `;


                memoryResults.appendChild(
                    memoryCard
                );

            }
        );

    }


    // ========================================
    // SHOW RESULTS
    // ========================================

    resultsSection.classList.remove(
        "d-none"
    );


    // ========================================
    // SCROLL TO RESULTS
    // ========================================

    resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ========================================
// FORMAT AI ANALYSIS
// ========================================

function formatAnalysis(text) {

    let formatted =
        escapeHtml(text);


    // Markdown headings

    formatted =
        formatted.replace(
            /^### (.*)$/gm,
            '<h5 class="analysis-heading">$1</h5>'
        );


    // Bold text

    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    // Bullet points

    formatted =
        formatted.replace(
            /^\* (.*)$/gm,
            "<li>$1</li>"
        );


    // Numbered lists

    formatted =
        formatted.replace(
            /^\d+\.\s+(.*)$/gm,
            "<li>$1</li>"
        );


    // Wrap list items

    formatted =
        formatted.replace(
            /(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gs,
            '<ul class="analysis-list">$1</ul>'
        );


    // Paragraph spacing

    formatted =
        formatted.replace(
            /\n{2,}/g,
            '<div class="analysis-space"></div>'
        );


    // Line breaks

    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;

}


// ========================================
// REMEMBER INCIDENT RESOLUTION
// ========================================

async function rememberResolution() {

    const incident =
        incidentDescription.value.trim();

    const resolution =
        resolutionDescription.value.trim();


    // ========================================
    // VALIDATE INCIDENT
    // ========================================

    if (!incident) {

        showRememberStatus(
            "Please describe the incident before saving the resolution.",
            "danger"
        );

        incidentDescription.focus();

        return;
    }


    // ========================================
    // VALIDATE RESOLUTION
    // ========================================

    if (!resolution) {

        showRememberStatus(
            "Please describe the resolution before saving it.",
            "danger"
        );

        resolutionDescription.focus();

        return;
    }


    // ========================================
    // CLEAR PREVIOUS STATUS
    // ========================================

    hideRememberStatus();


    // ========================================
    // DISABLE BUTTON
    // ========================================

    rememberButton.disabled = true;

    rememberButton.innerHTML = `
        <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
        ></span>
        Remembering...
    `;


    try {

        // ========================================
        // CALL FASTAPI
        // ========================================

        const response =
            await fetch(
                REMEMBER_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        incident_description:
                            incident,

                        resolution:
                            resolution

                    })
                }
            );


        // ========================================
        // HANDLE HTTP ERRORS
        // ========================================

        if (!response.ok) {

            let errorText =
                `Server returned ${response.status}.`;

            try {

                const errorData =
                    await response.json();

                if (errorData.detail) {

                    errorText =
                        errorData.detail;

                }

            } catch (jsonError) {

                console.warn(
                    "Could not read server error response."
                );

            }

            throw new Error(
                errorText
            );

        }


        // ========================================
        // READ RESPONSE
        // ========================================

        const data =
            await response.json();


        // ========================================
        // SUCCESS
        // ========================================

        showRememberStatus(
            data.message ||
            "Incident resolution stored successfully in Hindsight.",
            "success"
        );


        // ========================================
        // CLEAR RESOLUTION
        // ========================================

        resolutionDescription.value = "";


    } catch (error) {

        console.error(
            "Remember resolution error:",
            error
        );


        // ========================================
        // CONNECTION ERROR
        // ========================================

        if (
            error instanceof TypeError
        ) {

            showRememberStatus(
                "Unable to connect to the Incident Agent. " +
                "Please make sure the FastAPI server is running.",
                "danger"
            );

        } else {

            showRememberStatus(
                error.message ||
                "Unable to store the incident resolution.",
                "danger"
            );

        }

    } finally {

        // ========================================
        // RESTORE BUTTON
        // ========================================

        rememberButton.disabled = false;

        rememberButton.innerHTML = `
            <i class="bi bi-bookmark-plus me-2"></i>
            Remember Resolution
        `;

    }

}


// ========================================
// SHOW REMEMBER STATUS
// ========================================

function showRememberStatus(
    message,
    type
) {

    rememberStatus.className =
        `alert alert-${type} mb-3`;

    rememberStatus.innerHTML = `

        <i class="bi ${
            type === "success"
                ? "bi-check-circle"
                : "bi-exclamation-circle"
        } me-2"></i>

        ${escapeHtml(message)}

    `;

}


// ========================================
// HIDE REMEMBER STATUS
// ========================================

function hideRememberStatus() {

    rememberStatus.className =
        "alert d-none mb-3";

    rememberStatus.innerHTML = "";

}


// ========================================
// GENERAL ERROR
// ========================================

function showError(message) {

    errorMessage.textContent =
        message;

    errorSection.classList.remove(
        "d-none"
    );


    // Scroll to error

    errorSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function hideError() {

    errorSection.classList.add(
        "d-none"
    );

    errorMessage.textContent =
        "";

}


// ========================================
// HTML ESCAPE
// ========================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}
