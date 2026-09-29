from backend.memory import (
    find_similar_incidents,
    analyze_with_memory
)


def analyze_incident(incident_description):
    # Retrieve relevant historical incidents
    memories = find_similar_incidents(incident_description)

    # Ask Hindsight Reflect to reason over historical memory
    ai_analysis = analyze_with_memory(incident_description)

    return {
        "incident": incident_description,
        "similar_incidents_found": len(memories),
        "historical_memories": memories,
        "ai_analysis": ai_analysis["analysis"]
    }