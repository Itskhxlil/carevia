import diseaseFields from "./diseaseFields.json";

export { diseaseFields };

export const DISEASE_OPTIONS = Object.keys(diseaseFields).map((id) => ({
  id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
}));

const EMPTY_FIELDS = [];

export function fieldsForDisease(diseaseId) {
  const list = diseaseFields[diseaseId];
  return Array.isArray(list) ? list : EMPTY_FIELDS;
}
