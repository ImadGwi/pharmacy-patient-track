export const DoctorSchema = {
  id: "string",
  username: "string",
  passwordHash: "string",
  role: "admin|doctor",
  active: "boolean",
  createdAt: "string",
}

export const PatientIndexSchema = {
  id: "string",
  name: "string",
  phone: "string",
}

export const VisitSchema = {
  visitId: "string",
  at: "string",
  doctorId: "string",
  questionnaire: {
    lastGPVisit: "string?",
    lastSpecialistVisit: "string?",
    lastLabTests: {
      date: "string?",
      notes: "string?",
    },
    nextAppointment: "string?",
    treatment: {
      medications: [
        {
          name: "string",
          dose: "string?",
        },
      ],
      duration: "string?",
      adherence: "good|medium|poor?",
      organization: ["pillbox|alarm|caregiver|other"],
      sideEffects: "string?",
    },
    lifestyle: {
      dietRecommended: "boolean?",
      exercise: "boolean?",
      smoking: "none|occasional|daily?",
      alcohol: "none|occasional|regular?",
    },
    evaluation: {
      diseaseKnowledge: "good|medium|low?",
      treatmentUnderstanding: "good|medium|low?",
      selfManagement: "autonomous|needsHelp?",
    },
    pharmacistNotes: "string?",
  },
  additionalInfo: {
    freeText: "string?",
    attachments: ["string"],
  },
}
