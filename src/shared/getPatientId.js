// src/features/shared/getPatientId.js
export function getPatientId(data) {
  if (!data || typeof data !== "object") return null;
  return (
    data?.patient?.id ??
    data?.patient_id ??
    data?.patientId ??
    data?.client?.id ??
    data?.userId ??
    data?.id ??
    null
  );
}
