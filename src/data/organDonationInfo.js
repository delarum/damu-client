// Reference facts for each pledgeable organ. Kept short, factual, and
// non-alarming — this is informational, not medical advice. Each entry
// links out to a real, reputable source rather than trying to be the
// final word itself.
//
// anchor: { x, y } as a percentage of the body illustration's bounding box,
// tuned separately for the male and female SVGs since proportions differ
// slightly (shoulder width, hip width).

export const ORGAN_INFO = {
  kidney: {
    label: "Kidney",
    swLabel: "Figo",
    summary:
      "Most living donors give one of their two kidneys. The remaining kidney adapts to take over filtering on its own.",
    massDonated: "1 of 2 kidneys (~50% of kidney tissue)",
    recovery: "2–4 weeks before normal activity, full recovery by 6 weeks",
    sourceLabel: "National Kidney Foundation",
    sourceUrl: "https://www.kidney.org/transplantation/livingdonors",
    anchor: { male: { x: 70, y: 47 }, female: { x: 70, y: 47 } },
  },
  liver: {
    label: "Liver",
    swLabel: "Ini",
    summary:
      "Living donors give a section of the liver — it's the one organ that regrows close to its full size in both donor and recipient.",
    massDonated: "A lobe — roughly 50–70% of total liver volume",
    recovery: "2–3 weeks in hospital and at home, full regrowth in 2–3 months",
    sourceLabel: "OrganDonor.gov",
    sourceUrl: "https://www.organdonor.gov/about/process/living-donation",
    anchor: { male: { x: 58, y: 44 }, female: { x: 58, y: 44 } },
  },
  cornea: {
    label: "Cornea",
    swLabel: "Konea",
    summary:
      "Cornea donation happens after death and can restore sight to two people from a single donor.",
    massDonated: "Both corneas (after death)",
    recovery: "Not applicable — donated posthumously",
    sourceLabel: "OrganDonor.gov",
    sourceUrl: "https://www.organdonor.gov/about/what/eye-tissue",
    anchor: { male: { x: 50, y: 14 }, female: { x: 50, y: 14 } },
  },
  heart: {
    label: "Heart",
    swLabel: "Moyo",
    summary:
      "The heart can only be donated after death, and goes to whichever matched recipient needs it most urgently.",
    massDonated: "Whole heart (after death)",
    recovery: "Not applicable — donated posthumously",
    sourceLabel: "OrganDonor.gov",
    sourceUrl: "https://www.organdonor.gov/about/what/heart",
    anchor: { male: { x: 44, y: 34 }, female: { x: 44, y: 34 } },
  },
  bone_marrow: {
    label: "Bone marrow",
    swLabel: "Uboho",
    summary:
      "Most donations are from blood, not surgery — marrow cells are filtered out from blood drawn over a few hours.",
    massDonated: "About 5% of total marrow, replaced within 4–6 weeks",
    recovery: "1–2 weeks of mild fatigue or soreness",
    sourceLabel: "Be The Match",
    sourceUrl: "https://bethematch.org/transplant-basics/how-does-a-marrow-transplant-work/donating-bone-marrow/",
    anchor: { male: { x: 50, y: 56 }, female: { x: 50, y: 56 } },
  },
  lung: {
    label: "Lung",
    swLabel: "Pafu",
    summary:
      "Living lung donation is rare and usually involves a single lobe; most lung donations happen after death.",
    massDonated: "A single lobe, or both lungs (after death)",
    recovery: "4–6 weeks for living lobar donation",
    sourceLabel: "OrganDonor.gov",
    sourceUrl: "https://www.organdonor.gov/about/what/lung",
    anchor: { male: { x: 38, y: 32 }, female: { x: 38, y: 32 } },
  },
  pancreas: {
    label: "Pancreas",
    swLabel: "Kongosho",
    summary:
      "Most pancreas donations happen after death; a small number of living donors give a portion (a distal segment).",
    massDonated: "A distal segment (~20–30%), or whole organ (after death)",
    recovery: "4–6 weeks for living segmental donation",
    sourceLabel: "OrganDonor.gov",
    sourceUrl: "https://www.organdonor.gov/about/what/pancreas",
    anchor: { male: { x: 56, y: 48 }, female: { x: 56, y: 48 } },
  },
};

export const FALLBACK_ORGAN_ANCHOR = { x: 50, y: 50 };