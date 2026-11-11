import {
  MultimodalAnalyzer,
  MultimodalAnalysisResult,
  RequestPriority,
} from "./types"

const delay = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds))

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term))
}

export const prototypeMultimodalAnalyzer: MultimodalAnalyzer = {
  async analyze({ draft }) {
    await delay(1450)

    const source =
      `${draft.category} ${draft.typedDescription} ${draft.transcript}`.toLowerCase()
    const demo = draft.usedDemoEvidence
    let suggestedType = draft.category || "Other"
    let summary = "Consumer reports a water service concern for staff review."
    let observations: string[] = []
    let priority: RequestPriority = "Normal"
    let rationale =
      "No immediate safety signal was found. PPCWD staff should review the submitted details."

    if (demo || includesAny(source, ["leak", "tagas"])) {
      suggestedType = "Leak"
      summary =
        "Suspected continuous water leak beside the meter box at the linked San Manuel service address."
      observations = [
        "visible water flow",
        "near meter box",
        "ongoing since this morning",
      ]
      priority = "High"
      rationale =
        "Ongoing water loss near service equipment may need prompt inspection. Staff must confirm."
    } else if (includesAny(source, ["no water", "walang tubig", "no-water"])) {
      suggestedType = "No water"
      summary = "Consumer reports no water service at the submitted location."
      observations = ["service unavailable", "consumer-reported outage"]
      priority = "Urgent"
      rationale =
        "A reported loss of service may affect essential needs. Staff must confirm the extent and urgency."
    } else if (includesAny(source, ["pressure", "mahina", "low pressure"])) {
      suggestedType = "Low pressure"
      summary =
        "Consumer reports lower than usual water pressure at the submitted location."
      observations = ["reduced water pressure", "service address affected"]
      priority = "High"
      rationale =
        "Reduced pressure may indicate a localized service issue or nearby maintenance."
    } else if (includesAny(source, ["meter", "metro"])) {
      suggestedType = "Meter concern"
      summary = "Consumer requests review of a concern near the water meter."
      observations = ["meter area involved"]
    } else if (
      includesAny(source, ["cloudy", "discolored", "kulay", "quality"])
    ) {
      suggestedType = "Water quality"
      summary =
        "Consumer reports an appearance or water-quality concern for assessment."
      observations = ["appearance concern", "staff assessment requested"]
      priority = "High"
      rationale =
        "Water appearance concerns should be reviewed promptly. This does not confirm contamination."
    } else if (includesAny(source, ["flood", "flooding", "baha"])) {
      suggestedType = "Leak"
      summary =
        "Consumer reports significant water accumulation at the submitted location."
      observations = ["water accumulation", "possible active flow"]
      priority = "Urgent"
      rationale =
        "Reported flooding may create a safety or property risk. Staff must confirm before action."
    }

    const detailLength =
      draft.typedDescription.trim().length + draft.transcript.trim().length
    const needsMoreDetail = !demo && !draft.photo && detailLength < 18
    const confidence = needsMoreDetail
      ? "low"
      : draft.photo || detailLength > 50
        ? "high"
        : "medium"

    const result: MultimodalAnalysisResult = {
      transcript:
        draft.transcript ||
        (demo
          ? "May tuloy-tuloy na tagas po sa tabi ng metro simula kaninang umaga. The ground is already wet."
          : ""),
      language: demo ? "Filipino / English" : "English",
      suggestedType,
      summary,
      observations:
        observations.length > 0 ? observations : ["consumer report received"],
      suggestedPriority: priority,
      priorityRationale: rationale,
      confidence,
      needsMoreDetail,
      advisoryMatch:
        draft.locationMode === "service" ||
        draft.alternateLocation.toLowerCase().includes("san manuel")
          ? {
              id: "maintenance",
              title: "Scheduled pressure reduction",
            }
          : undefined,
      provenance: "Prototype analysis",
    }
    return result
  },
}
