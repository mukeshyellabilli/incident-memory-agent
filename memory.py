import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

# Load environment variables
load_dotenv()

HINDSIGHT_API_URL = os.getenv("HINDSIGHT_API_URL")
HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY")

BANK_ID = "incident-agent"


def get_hindsight_client():
    """Create a Hindsight client."""

    return Hindsight(
        base_url=HINDSIGHT_API_URL,
        api_key=HINDSIGHT_API_KEY
    )


def create_memory_bank():
    """Create the incident memory bank."""

    with get_hindsight_client() as client:

        client.create_bank(
            bank_id=BANK_ID,
            name="AI Incident Memory Agent"
        )

    return "Memory bank created successfully"


def remember_incident(incident):
    """Store an incident in Hindsight."""

    with get_hindsight_client() as client:

        client.retain(
            bank_id=BANK_ID,
            content=incident
        )

    return "Incident stored successfully"


def find_similar_incidents(query):
    """Find similar historical incidents."""

    with get_hindsight_client() as client:

        result = client.recall(
            bank_id=BANK_ID,
            query=query
        )

        memories = []

        for memory in result.results:
            memories.append(memory.text)

        return memories


def analyze_with_memory(incident_description):
    """
    Use Hindsight Reflect to reason over historical
    incident memories and generate an AI analysis.
    """

    query = f"""
You are an AI production incident response assistant.

Analyze the following new production incident:

{incident_description}

Use the historical incident knowledge stored in your memory.

Provide:

1. Likely root cause
2. Relevant historical evidence
3. Previous resolution that worked
4. Recommended investigation steps
5. Important caution or uncertainty

Only rely on information supported by the stored incident
history. If the historical memory does not provide enough
evidence, clearly say that more investigation is required.
"""

    with get_hindsight_client() as client:

        response = client.reflect(
            bank_id=BANK_ID,
            query=query,
            budget="mid",
            include_facts=True
        )

        return {
            "analysis": response.text,
            "based_on": response.based_on
        }
def remember_resolution(incident_description, resolution):

    memory_content = f"""
Production Incident:

{incident_description}

Resolution:

{resolution}

This resolution was recorded by the AI Incident Memory Agent
for future incident analysis and troubleshooting.
"""

    with get_hindsight_client() as client:

        client.retain(
            bank_id=BANK_ID,
            content=memory_content
        )

    return "Incident resolution stored successfully"