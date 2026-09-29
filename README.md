````markdown
# AI Incident Memory Agent

An AI-powered production incident response assistant that uses **Hindsight** as persistent memory.

The agent remembers previous production incidents, root causes, resolutions, investigation steps, and outcomes. When a new incident occurs, it recalls relevant historical memory and uses that context to provide evidence-based troubleshooting guidance.

---

## Problem

Production teams often face similar incidents repeatedly.

Engineers may spend time searching through:

- Previous incident reports
- Postmortems
- Troubleshooting notes
- Runbooks
- Previous resolutions

Traditional AI assistants may provide a useful answer for the current conversation, but they do not automatically maintain a long-term memory of how previous incidents were solved.

This project addresses that problem by giving the incident response agent persistent memory using **Hindsight**.

---

## Solution

The AI Incident Memory Agent creates a continuous learning loop:

```text
Production Incident
        |
        v
   Hindsight Recall
        |
        v
Historical Incident Memory
        |
        v
   AI Analysis
        |
        v
Root Cause + Evidence + Investigation Steps
        |
        v
Engineer Resolves Incident
        |
        v
Resolution Stored in Hindsight
        |
        +--------------------+
                             |
                             v
                    Future Incidents
````

The next time a similar problem occurs, the agent can recall what happened previously and use that information during analysis.

---

## Key Features

### 1. Incident Analysis

An engineer enters a production incident such as:

```text
Payment API is experiencing database timeout errors.
Requests are failing intermittently during peak traffic.
```

The agent analyzes the incident using historical memory.

---

### 2. Historical Memory Recall

The agent retrieves relevant facts from Hindsight.

For example:

```text
Previous incident:
Payment API database timeout

Root cause:
Connection pool exhaustion

Previous resolution:
Increased database connection pool from 20 to 50.
```

These historical facts are shown in the dashboard.

---

### 3. AI Reasoning with Memory

The agent uses Hindsight's reasoning capability to analyze the new incident together with historical knowledge.

The response includes:

1. Likely root cause
2. Relevant historical evidence
3. Previous resolution that worked
4. Recommended investigation steps
5. Important caution or uncertainty

The agent is instructed not to invent historical evidence when the memory does not contain enough information.

---

### 4. Remember New Resolutions

After an incident is resolved, the engineer can record the resolution.

Example:

```text
Restarted the email worker and cleared the message queue.
```

The resolution is stored in Hindsight for future incidents.

---

### 5. Cross-System Persistent Memory

The memory is stored in the Hindsight Cloud memory bank:

```text
incident-agent
```

Because the memory is stored externally in Hindsight, another running instance of the application can recall previously stored incident knowledge.

This demonstrates that the learning is not limited to a single browser session or process.

---

## Example Incident

### Previous Incident

```text
Incident:
Payment API database timeout

Root Cause:
Database connection pool exhaustion

Resolution:
Increased connection pool from 20 to 50.

Result:
Database timeout failures stopped.
```

### New Incident

```text
Payment API is again reporting database timeout errors.
```

### Agent Behavior

The agent recalls the previous incident and can identify the historical connection-pool issue as relevant evidence.

Instead of starting from zero, the engineer receives context from the previous incident.

---

## Another Learning Example

The system can also learn from incidents involving services that were not part of the initial seed data.

For example:

```text
Notification Service
```

A resolution can be recorded:

```text
Restarted the email worker and cleared the message queue.
```

Later, another system instance can recall this historical resolution through the same Hindsight memory bank.

This demonstrates persistent organizational incident memory.

---

# Architecture

```text
+-----------------------------+
|       Web Dashboard         |
|   HTML + CSS + Bootstrap    |
|        JavaScript           |
+--------------+--------------+
               |
               | HTTP
               v
+-----------------------------+
|          FastAPI            |
|                             |
|  /analyze-incident          |
|  /remember-resolution       |
+--------------+--------------+
               |
               v
+-----------------------------+
|      Incident Agent         |
|                             |
|  Incident Analysis          |
|  Memory Retrieval           |
|  AI Reasoning               |
+--------------+--------------+
               |
               v
+-----------------------------+
|          Hindsight          |
|                             |
|  Retain                     |
|  Recall                     |
|  Reflect                    |
|  Persistent Memory          |
+-----------------------------+
```

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* Bootstrap
* JavaScript

### Backend

* Python
* FastAPI
* Pydantic

### AI Memory

* Hindsight
* Hindsight Python SDK
* Hindsight Retain
* Hindsight Recall
* Hindsight Reflect

### Development

* Git
* GitHub
* Python virtual environment

---

# Hindsight Integration

Hindsight is the core memory layer of this application.

The application uses three important memory operations.

## Retain

When an incident or resolution is recorded, the application sends the information to Hindsight.

Example:

```python
client.retain(
    bank_id=BANK_ID,
    content=memory_content
)
```

Hindsight processes the information and stores useful memory units that can be recalled later.

---

## Recall

When a new incident is submitted, the application searches historical memory.

Example:

```python
result = client.recall(
    bank_id=BANK_ID,
    query=query
)
```

The returned memory facts are displayed in the dashboard and also used during analysis.

---

## Reflect

The application uses Hindsight Reflect to reason over the stored historical knowledge.

Example:

```python
response = client.reflect(
    bank_id=BANK_ID,
    query=query,
    budget="mid",
    include_facts=True
)
```

The agent is instructed to use historical incident knowledge and clearly identify when the stored memory is insufficient.

---

# Memory Learning Loop

The central workflow is:

```text
1. Incident occurs
        |
        v
2. Agent recalls historical memory
        |
        v
3. Historical evidence is used for analysis
        |
        v
4. Engineer investigates and resolves incident
        |
        v
5. Resolution is recorded
        |
        v
6. Resolution is retained in Hindsight
        |
        v
7. Future incidents can recall the new knowledge
```

This allows the system to improve its usefulness over time as more incident resolutions are recorded.

---

# Project Structure

```text
incident-memory-agent/
│
├── backend/
│   ├── agent.py
│   ├── main.py
│   └── memory.py
│
├── frontend/
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── app.js
│
├── .env.example
├── .gitignore
└── requirements.txt
```

---

# Backend Responsibilities

## `backend/main.py`

FastAPI application entry point.

Provides:

```text
GET  /
POST /analyze-incident
POST /remember-resolution
```

---

## `backend/agent.py`

Coordinates incident analysis.

The agent:

1. Receives the incident
2. Searches Hindsight memory
3. Runs memory-based AI analysis
4. Returns historical memory and analysis

---

## `backend/memory.py`

Contains the Hindsight integration.

Responsibilities include:

* Creating/accessing the Hindsight bank
* Retaining incidents
* Recalling historical incidents
* Running Reflect
* Recording incident resolutions

---

# Frontend

The dashboard provides:

### Incident Input

Engineers can describe a production incident.

### Analyze Incident

The incident is sent to the FastAPI backend.

### AI Analysis

The dashboard displays:

* Likely root cause
* Historical evidence
* Recommended investigation steps
* Cautions and uncertainty

### Hindsight Memory

The dashboard displays historical memory facts retrieved from Hindsight.

### Record Incident Resolution

Engineers can store the final resolution for future incidents.

---

# Setup

## 1. Clone the repository

```bash
git clone https://github.com/mukeshyellabilli/incident-memory-agent.git
cd incident-memory-agent
```

---

## 2. Create a Python virtual environment

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Hindsight

Create a `.env` file in the project root.

Use `.env.example` as the template.

```env
HINDSIGHT_API_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key
```

Do not commit the `.env` file.

The real API key must remain private.

---

# Run the Application

From the project root:

```bash
uvicorn backend.main:app --reload
```

The application will start locally.

Open:

```text
http://127.0.0.1:8000
```

---

# Demo Workflow

A simple demonstration can follow this sequence.

## Step 1 — Analyze a known incident

Enter:

```text
Payment API is experiencing database timeout errors during peak traffic.
```

The agent recalls previous Payment API incidents.

---

## Step 2 — Show historical memory

The dashboard displays relevant Hindsight memory facts.

For example:

```text
Connection pool exhaustion
Pool was increased from 20 to 50
Timeout failures stopped
```

---

## Step 3 — Record a new resolution

Enter the resolution after solving the incident.

```text
Increased database connection pool from 20 to 50 and restarted the service.
```

Click:

```text
Remember Resolution
```

---

## Step 4 — Demonstrate the learning loop

Submit a related future incident.

The agent can now use the newly recorded resolution as historical memory.

This demonstrates:

```text
Remember → Recall → Analyze
```

---

# Handling Unknown Incidents

The agent is designed not to pretend that historical evidence exists when it does not.

For example, if the system receives an incident involving an unfamiliar service, it can state that more investigation is required when the historical memory does not provide enough evidence.

This helps distinguish:

```text
Historical evidence
```

from:

```text
AI-generated investigation guidance
```

---

# API Endpoints

## Analyze Incident

```http
POST /analyze-incident
```

Request:

```json
{
  "incident_description": "Payment API is experiencing database timeout errors."
}
```

---

## Remember Resolution

```http
POST /remember-resolution
```

Request:

```json
{
  "incident_description": "Payment API database timeout during peak traffic.",
  "resolution": "Increased database connection pool from 20 to 50."
}
```

---

# Why Persistent Memory Matters

Without persistent memory:

```text
Incident A
    ↓
AI response
    ↓
Conversation ends
    ↓
Knowledge is lost
```

With Hindsight:

```text
Incident A
    ↓
Resolution
    ↓
Hindsight Memory
    ↓
Future Incident
    ↓
Recall historical knowledge
    ↓
Better contextual analysis
```

The value of this application comes from making previous incident knowledge available to future incident investigations.

---

# Future Improvements

Possible future improvements include:

* Incident severity classification
* Automatic incident timeline generation
* Service dependency mapping
* Runbook recommendations
* Incident similarity visualization
* Integration with Slack
* Integration with monitoring systems
* Integration with ticketing systems
* Automatic postmortem generation
* Incident analytics dashboard
* Authentication and role-based access

---

# Security Notes

The Hindsight API key is stored in `.env`.

The repository contains only `.env.example` with a placeholder value.

Never commit:

```text
.env
```

or any file containing a real API key.

---

# License

This project is provided for demonstration and educational purposes.

````

### One small correction before you commit

In your current GitHub repository, the structure we verified is:

```text
incident-memory-agent/
├── backend/
│   ├── agent.py
│   ├── main.py
│   └── memory.py
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── .env.example
├── .gitignore
└── requirements.txt
````

So the README's **Project Structure** section matches your actual repository. ✅

Use commit message:

```text
Add project documentation
```

Then click **Commit changes**.
