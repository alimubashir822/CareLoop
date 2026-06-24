import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding expanded database...");

  // Clean old data
  await prisma.vitalReading.deleteMany({});
  await prisma.chronicEnrollment.deleteMany({});
  await prisma.chronicProgram.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.analytics.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.patientResponse.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.followUp.deleteMany({});
  await prisma.carePlan.deleteMany({});
  await prisma.visit.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.clinic.deleteMany({});
  await prisma.organization.deleteMany({});

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: { name: "CareLoop Health Group" },
  });

  // 2. Create Clinics with White-Label Branding Themes
  const dentalClinic = await prisma.clinic.create({
    data: {
      id: "dental-clinic-id",
      name: "CareLoop Dental Center",
      organizationId: org.id,
      themePrimary: "#0d9488", // Teal
      themeName: "CareLoop AI",
    },
  });
  const surgeryClinic = await prisma.clinic.create({
    data: {
      id: "surgical-clinic-id",
      name: "CareLoop Surgical Clinic",
      organizationId: org.id,
      themePrimary: "#6366f1", // Indigo
      themeName: "Summit Surgical",
    },
  });
  const primaryClinic = await prisma.clinic.create({
    data: {
      id: "primary-clinic-id",
      name: "CareLoop Primary Care",
      organizationId: org.id,
      themePrimary: "#0284c7", // Sky Blue
      themeName: "HealthFlow Primary",
    },
  });

  // 3. Create Users (Staff)
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@careloop.ai",
      name: "Alex Admin",
      role: "Admin",
      clinicId: dentalClinic.id,
    },
  });

  const doc1User = await prisma.user.create({
    data: {
      email: "dr.smith@careloop.ai",
      name: "Dr. Rachel Smith",
      role: "Doctor",
      clinicId: dentalClinic.id,
    },
  });
  const doctor1 = await prisma.doctor.create({
    data: {
      userId: doc1User.id,
      specialty: "Implantology & Cosmetic Dentistry",
      clinicId: dentalClinic.id,
    },
  });

  const doc2User = await prisma.user.create({
    data: {
      email: "dr.jones@careloop.ai",
      name: "Dr. Marcus Jones",
      role: "Doctor",
      clinicId: surgeryClinic.id,
    },
  });
  const doctor2 = await prisma.doctor.create({
    data: {
      userId: doc2User.id,
      specialty: "Orthopedic Surgery",
      clinicId: surgeryClinic.id,
    },
  });

  const nurseUser = await prisma.user.create({
    data: {
      email: "nurse.sarah@careloop.ai",
      name: "Sarah Connor",
      role: "Nurse",
      clinicId: dentalClinic.id,
    },
  });

  const coordinatorUser = await prisma.user.create({
    data: {
      email: "coordinator.clara@careloop.ai",
      name: "Clara Oswald",
      role: "CareCoordinator",
      clinicId: primaryClinic.id,
    },
  });

  // 4. Create Patients with CRM Indicators, AI Risk details, & Preferences
  const patientSarah = await prisma.patient.create({
    data: {
      name: "Sarah Jenkins",
      email: "sarah.jenkins@gmail.com",
      phone: "+1 (555) 382-9102",
      birthDate: "1988-04-12",
      status: "HighRisk",
      healthEngagementScore: 95,
      predictiveRiskScore: 0.88,
      riskReasons: JSON.stringify(["Reported increasing post-op pain", "Reported bleeding around suture", "Stated pain meds are not helping"]),
      communicationPreference: "Portal",
      detailPreference: "Detailed",
      memoryNotes: "Prefers morning checks; extremely anxious about surgical stitches; requested callback reminder.",
      clinicId: dentalClinic.id,
    },
  });

  const patientJohn = await prisma.patient.create({
    data: {
      name: "John Miller",
      email: "john.miller@yahoo.com",
      phone: "+1 (555) 831-2940",
      birthDate: "1975-09-22",
      status: "Active",
      healthEngagementScore: 78,
      predictiveRiskScore: 0.35,
      riskReasons: JSON.stringify(["Missed Day 3 swelling checklist response", "High swelling reported Day 1"]),
      communicationPreference: "SMS",
      detailPreference: "Concise",
      memoryNotes: "Prefers direct SMS check-ins; requested physical therapy coordinator contact details.",
      clinicId: surgeryClinic.id,
    },
  });

  const patientDavid = await prisma.patient.create({
    data: {
      name: "David Wilson",
      email: "david.wilson@outlook.com",
      phone: "+1 (555) 749-0129",
      birthDate: "1960-11-05",
      status: "Active",
      healthEngagementScore: 98,
      predictiveRiskScore: 0.12,
      riskReasons: JSON.stringify(["Older cohort age factor"]),
      communicationPreference: "Email",
      detailPreference: "Detailed",
      memoryNotes: "Highly compliant chronic patient; logs glucose levels twice weekly via portal.",
      clinicId: primaryClinic.id,
    },
  });

  const patientMichael = await prisma.patient.create({
    data: {
      name: "Michael Brown",
      email: "michael.b@gmail.com",
      phone: "+1 (555) 463-9182",
      birthDate: "1982-07-30",
      status: "Active",
      healthEngagementScore: 40,
      predictiveRiskScore: 0.74,
      riskReasons: JSON.stringify(["Missed scheduled Cleaning appointment", "No response to 3 consecutive outreach attempts"]),
      communicationPreference: "SMS",
      detailPreference: "Concise",
      memoryNotes: "Hard to reach; misses cleaning appointments; works late shifts.",
      clinicId: dentalClinic.id,
    },
  });

  // New chronic care patient: Maria Torres (Hypertension)
  const patientMaria = await prisma.patient.create({
    data: {
      name: "Maria Torres",
      email: "maria.torres@gmail.com",
      phone: "+1 (555) 912-3047",
      birthDate: "1967-03-18",
      status: "HighRisk",
      healthEngagementScore: 71,
      predictiveRiskScore: 0.62,
      riskReasons: JSON.stringify(["Systolic BP repeatedly above 160 mmHg", "Missed two weekly check-ins", "Self-reported stress and fatigue"]),
      communicationPreference: "SMS",
      detailPreference: "Concise",
      memoryNotes: "Caregiver for elderly parent; responds better to evening SMS. Concerned about medication side effects.",
      clinicId: primaryClinic.id,
    },
  });

  // 5. Create Care Plan templates
  const dentalImplantPlan = await prisma.carePlan.create({
    data: {
      name: "Dental Implant Care Journey",
      description: "Post-surgery follow-up timeline for dental implant patients, tracking pain, bleeding, and recovery milestone schedules.",
      clinicId: dentalClinic.id,
      triggerEvent: "VisitCompleted",
      stepsJson: JSON.stringify([
        { day: 0, type: "Instructions", channel: "Portal", title: "Immediate Post-Op Instructions" },
        { day: 1, type: "CheckIn", channel: "SMS", title: "Day 1 Swelling Check" },
        { day: 3, type: "CheckIn", channel: "Portal", title: "Day 3 Pain & Bleeding Check" },
        { day: 7, type: "CheckIn", channel: "SMS", title: "Day 7 Suture Check" },
        { day: 30, type: "Reminder", channel: "Email", title: "Follow-up Appointment Check-in" },
      ]),
    },
  });

  const surgeryRecoveryPlan = await prisma.carePlan.create({
    data: {
      name: "Orthopedic Surgery Recovery Journey",
      description: "Post-operative tracking for orthopedic surgeries, focusing on pain management, wound care, and physical therapy progression.",
      clinicId: surgeryClinic.id,
      triggerEvent: "VisitCompleted",
      stepsJson: JSON.stringify([
        { day: 0, type: "Instructions", channel: "Portal", title: "Wound Care & Pain Management" },
        { day: 2, type: "CheckIn", channel: "Portal", title: "Pain & Medication Verification" },
        { day: 7, type: "CheckIn", channel: "SMS", title: "Wound Healing & Redness Check" },
        { day: 10, type: "Reminder", channel: "SMS", title: "Physical Therapy Start Notice" },
        { day: 14, type: "Reminder", channel: "Email", title: "Suture Removal Visit Scheduled" },
      ]),
    },
  });

  // 6. Create Appointments and Visits
  // Sarah Jenkins Dental Implant visit 3 days ago
  const date3DaysAgo = new Date();
  date3DaysAgo.setDate(date3DaysAgo.getDate() - 3);

  const sarahAppt = await prisma.appointment.create({
    data: {
      patientId: patientSarah.id,
      doctorId: doctor1.id,
      clinicId: dentalClinic.id,
      scheduledAt: date3DaysAgo,
      status: "Completed",
      type: "Surgery",
      notes: "Placed titanium implant in tooth #14. Stitches secured. Post-op x-ray looks perfect.",
    },
  });

  const sarahVisit = await prisma.visit.create({
    data: {
      patientId: patientSarah.id,
      doctorId: doctor1.id,
      clinicId: dentalClinic.id,
      appointmentId: sarahAppt.id,
      date: date3DaysAgo,
      diagnosis: "Partial edentulism of maxilla, tooth #14",
      treatment: "Dental implant surgery",
      notes: "Instructions discussed: soft diet, ice packs, painkillers, zero hard workouts.",
      instructions: "Avoid hard or hot foods for 3 days. Gently rinse with warm salt water after 24 hours. Take prescribed Ibuprofen 600mg every 6 hours as needed. Contact us if bleeding is continuous or pain worsens.",
    },
  });

  // John Miller Knee surgery 6 days ago
  const date6DaysAgo = new Date();
  date6DaysAgo.setDate(date6DaysAgo.getDate() - 6);

  const johnAppt = await prisma.appointment.create({
    data: {
      patientId: patientJohn.id,
      doctorId: doctor2.id,
      clinicId: surgeryClinic.id,
      scheduledAt: date6DaysAgo,
      status: "Completed",
      type: "Surgery",
      notes: "Arthroscopic repair of right knee meniscus tear.",
    },
  });

  const johnVisit = await prisma.visit.create({
    data: {
      patientId: patientJohn.id,
      doctorId: doctor2.id,
      clinicId: surgeryClinic.id,
      appointmentId: johnAppt.id,
      date: date6DaysAgo,
      diagnosis: "Tear of right medial meniscus",
      treatment: "Knee arthroscopy and partial meniscectomy",
      notes: "Instructed on elevation and cryotherapy. PT starts in 10 days.",
      instructions: "Keep the surgical dressing clean and dry. Elevate the right leg above heart level when resting. Apply ice pack for 20 minutes every 2 hours to manage swelling. Complete your physical therapy forms.",
    },
  });

  // Michael Brown Missed Appointment 2 days ago
  const date2DaysAgo = new Date();
  date2DaysAgo.setDate(date2DaysAgo.getDate() - 2);
  
  await prisma.appointment.create({
    data: {
      patientId: patientMichael.id,
      doctorId: doctor1.id,
      clinicId: dentalClinic.id,
      scheduledAt: date2DaysAgo,
      status: "Missed",
      type: "Cleaning",
      notes: "No show. Tried calling, went to voicemail.",
    },
  });

  // David Wilson diabetes check-in (Chronic Care)
  const date10DaysAgo = new Date();
  date10DaysAgo.setDate(date10DaysAgo.getDate() - 10);
  const davidAppt = await prisma.appointment.create({
    data: {
      patientId: patientDavid.id,
      doctorId: doctor1.id,
      clinicId: primaryClinic.id,
      scheduledAt: date10DaysAgo,
      status: "Completed",
      type: "Routine",
      notes: "Regular check-up for diabetes management.",
    },
  });
  const davidVisit = await prisma.visit.create({
    data: {
      patientId: patientDavid.id,
      doctorId: doctor1.id,
      clinicId: primaryClinic.id,
      appointmentId: davidAppt.id,
      date: date10DaysAgo,
      diagnosis: "Type 2 Diabetes Mellitus",
      treatment: "Metformin daily therapy review",
      notes: "Blood sugar looks stable, advised to keep logging.",
      instructions: "Continue taking Metformin 500mg with dinner. Maintain a low glycemic diet. Log blood sugar levels in the CareLoop portal twice a week.",
    },
  });

  // 7. Seed Follow-ups and messages
  // Sarah's completed instructions message (Day 0)
  const followUpSarahDay0 = await prisma.followUp.create({
    data: {
      patientId: patientSarah.id,
      visitId: sarahVisit.id,
      carePlanId: dentalImplantPlan.id,
      title: "Immediate Post-Op Instructions",
      status: "Completed",
      scheduledDate: date3DaysAgo,
      sentAt: date3DaysAgo,
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientSarah.id,
      followUpId: followUpSarahDay0.id,
      sender: "AI",
      content: `Hi Sarah, here are your care instructions after your dental procedure:
- Avoid hard or hot foods.
- Rinse gently with salt water after 24 hours.
- Take prescribed Ibuprofen 600mg every 6 hours.
Reply if you have questions!`,
      status: "Read",
      sentAt: date3DaysAgo,
    },
  });

  // Sarah's Day 1 check-in (Completed, Positive response)
  const date2DaysAgoActual = new Date();
  date2DaysAgoActual.setDate(date2DaysAgoActual.getDate() - 2);

  const followUpSarahDay1 = await prisma.followUp.create({
    data: {
      patientId: patientSarah.id,
      visitId: sarahVisit.id,
      carePlanId: dentalImplantPlan.id,
      title: "Day 1 Swelling Check",
      status: "Completed",
      scheduledDate: date2DaysAgoActual,
      sentAt: date2DaysAgoActual,
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientSarah.id,
      followUpId: followUpSarahDay1.id,
      sender: "AI",
      content: "Hi Sarah, how is your swelling today? (Reply with: 1 for Good, 2 for Moderate, 3 for Severe)",
      status: "Read",
      sentAt: date2DaysAgoActual,
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientSarah.id,
      followUpId: followUpSarahDay1.id,
      sender: "Patient",
      content: "1 - Swelling is good, very minor.",
      status: "Read",
      sentAt: date2DaysAgoActual,
    },
  });

  await prisma.patientResponse.create({
    data: {
      patientId: patientSarah.id,
      followUpId: followUpSarahDay1.id,
      responseText: "1 - Swelling is good, very minor.",
      sentiment: "Positive",
      riskScore: 0.1,
      respondedAt: date2DaysAgoActual,
    },
  });

  // Sarah's Day 3 check-in (Escalated, Negative Response - Urgent Alert)
  const followUpSarahDay3 = await prisma.followUp.create({
    data: {
      patientId: patientSarah.id,
      visitId: sarahVisit.id,
      carePlanId: dentalImplantPlan.id,
      title: "Day 3 Pain & Bleeding Check",
      status: "Escalated",
      scheduledDate: new Date(), // Today
      sentAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientSarah.id,
      followUpId: followUpSarahDay3.id,
      sender: "AI",
      content: "Hi Sarah, it's Day 3 of your recovery. How is your pain level? Are you experiencing any continuous bleeding?",
      status: "Read",
      sentAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientSarah.id,
      followUpId: followUpSarahDay3.id,
      sender: "Patient",
      content: "Actually, my pain is increasing a lot today and I see some bleeding around the stitch. What should I do?",
      status: "Read",
      sentAt: new Date(),
    },
  });

  await prisma.patientResponse.create({
    data: {
      patientId: patientSarah.id,
      followUpId: followUpSarahDay3.id,
      responseText: "Actually, my pain is increasing a lot today and I see some bleeding around the stitch. What should I do?",
      sentiment: "Alert",
      riskScore: 0.88,
      respondedAt: new Date(),
    },
  });

  // 8. Create Tasks for High Risk patients with explicit nurse assignees
  await prisma.task.create({
    data: {
      patientId: patientSarah.id,
      clinicId: dentalClinic.id,
      title: "Contact Sarah Jenkins: Recovery Pain & Bleeding Alert",
      description: "AI Flagged: Sarah reported 'pain increasing a lot' and 'bleeding around the stitch' during her Day 3 Follow-Up check-in. Staff needs to call her and evaluate for infection.",
      priority: "Urgent",
      status: "Pending",
      assignedToId: nurseUser.id,
      assignedToName: "Nurse Sarah Connor",
    },
  });

  await prisma.task.create({
    data: {
      patientId: patientMichael.id,
      clinicId: dentalClinic.id,
      title: "Reschedule Missed Appointment - Michael Brown",
      description: "Michael missed his Cleaning appointment on June 22. Send a rescheduling outreach message with available calendar links.",
      priority: "Medium",
      status: "Pending",
      assignedToId: nurseUser.id,
      assignedToName: "Nurse Sarah Connor",
    },
  });

  // 9. John Miller (Knee Surgery) Follow-up (Completed, Neutral)
  const followUpJohnDay0 = await prisma.followUp.create({
    data: {
      patientId: patientJohn.id,
      visitId: johnVisit.id,
      carePlanId: surgeryRecoveryPlan.id,
      title: "Wound Care & Pain Management",
      status: "Completed",
      scheduledDate: date6DaysAgo,
      sentAt: date6DaysAgo,
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientJohn.id,
      followUpId: followUpJohnDay0.id,
      sender: "AI",
      content: "Hi John, post-op instructions: Elevate leg and ice hourly. Contact clinic if pain exceeds 7/10.",
      status: "Read",
      sentAt: date6DaysAgo,
    },
  });

  const followUpJohnDay2 = await prisma.followUp.create({
    data: {
      patientId: patientJohn.id,
      visitId: johnVisit.id,
      carePlanId: surgeryRecoveryPlan.id,
      title: "Pain & Medication Verification",
      status: "Completed",
      scheduledDate: date2DaysAgo,
      sentAt: date2DaysAgo,
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientJohn.id,
      followUpId: followUpJohnDay2.id,
      sender: "AI",
      content: "Hi John, how are you managing your pain today? Are you able to take your medications?",
      status: "Read",
      sentAt: date2DaysAgo,
    },
  });

  await prisma.message.create({
    data: {
      patientId: patientJohn.id,
      followUpId: followUpJohnDay2.id,
      sender: "Patient",
      content: "It hurts a bit, but the pain medication is keeping it around a 3/10. Able to move slightly.",
      status: "Read",
      sentAt: date2DaysAgo,
    },
  });

  await prisma.patientResponse.create({
    data: {
      patientId: patientJohn.id,
      followUpId: followUpJohnDay2.id,
      responseText: "It hurts a bit, but the pain medication is keeping it around a 3/10. Able to move slightly.",
      sentiment: "Neutral",
      riskScore: 0.35,
      respondedAt: date2DaysAgo,
    },
  });

  // 10. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: nurseUser.id,
      action: "VIEW_RESPONSE",
      entity: "PatientResponse",
      entityId: followUpSarahDay3.id,
      details: "Sarah Connor reviewed Sarah Jenkins' Day 3 pain and bleeding alert.",
    },
  });

  // 11. Create Analytics data (Past 6 Months)
  for (let i = 5; i >= 0; i--) {
    const analyticsDate = new Date();
    analyticsDate.setMonth(analyticsDate.getMonth() - i);
    
    // ResponseRate
    await prisma.analytics.create({
      data: {
        clinicId: dentalClinic.id,
        date: analyticsDate,
        metric: "ResponseRate",
        value: 85 + Math.random() * 5, // 85% to 90%
      },
    });

    // SymptomAlerts
    await prisma.analytics.create({
      data: {
        clinicId: dentalClinic.id,
        date: analyticsDate,
        metric: "SymptomAlerts",
        value: Math.floor(4 + Math.random() * 4), // 4 to 8
      },
    });

    // AppointmentsRecovered
    await prisma.analytics.create({
      data: {
        clinicId: dentalClinic.id,
        date: analyticsDate,
        metric: "AppointmentsRecovered",
        value: Math.floor(25 + Math.random() * 10), // 25 to 35
      },
    });

    // ActivePatients
    await prisma.analytics.create({
      data: {
        clinicId: dentalClinic.id,
        date: analyticsDate,
        metric: "ActivePatients",
        value: 320 + Math.floor(Math.random() * 30),
      },
    });
  }

  // ── CHRONIC CARE PROGRAMS ──────────────────────────────────────────────────

  const diabetesProgram = await prisma.chronicProgram.create({
    data: {
      name: "Diabetes Management Program",
      type: "DIABETES",
      description: "Structured glucose monitoring and lifestyle coaching for Type 2 Diabetes patients. Tracks fasting glucose, post-meal readings, and HbA1c trends to prevent complications and reduce ER visits.",
      clinicId: primaryClinic.id,
      targetMetric: "GLUCOSE",
      targetMin: 70,
      targetMax: 140,
      unit: "mg/dL",
      checkInFrequency: "DAILY",
    },
  });

  const hypertensionProgram = await prisma.chronicProgram.create({
    data: {
      name: "Hypertension Control Program",
      type: "HYPERTENSION",
      description: "Evidence-based blood pressure monitoring program for hypertensive patients. Includes weekly BP check-ins, medication adherence tracking, and automated alerts for BP exceeding 160/100 mmHg.",
      clinicId: primaryClinic.id,
      targetMetric: "BLOOD_PRESSURE",
      targetMin: 90,
      targetMax: 130,
      unit: "mmHg",
      checkInFrequency: "WEEKLY",
    },
  });

  // ── ENROLL PATIENTS ────────────────────────────────────────────────────────

  // David Wilson → Diabetes Program (enrolled 90 days ago)
  const date90DaysAgo = new Date();
  date90DaysAgo.setDate(date90DaysAgo.getDate() - 90);
  const date7DaysAgo = new Date();
  date7DaysAgo.setDate(date7DaysAgo.getDate() - 7);
  const dateNextWeek = new Date();
  dateNextWeek.setDate(dateNextWeek.getDate() + 7);

  const davidEnrollment = await prisma.chronicEnrollment.create({
    data: {
      patientId: patientDavid.id,
      programId: diabetesProgram.id,
      enrolledAt: date90DaysAgo,
      status: "ACTIVE",
      complianceScore: 94,
      lastReading: date7DaysAgo,
      nextCheckIn: dateNextWeek,
      notes: "Patient is highly compliant. Glucose trending down over past 12 weeks. HbA1c improved from 8.2% to 6.9%.",
    },
  });

  // Maria Torres → Hypertension Program (enrolled 60 days ago)
  const date60DaysAgo = new Date();
  date60DaysAgo.setDate(date60DaysAgo.getDate() - 60);
  const date3DaysFromNow = new Date();
  date3DaysFromNow.setDate(date3DaysFromNow.getDate() + 3);

  const mariaEnrollment = await prisma.chronicEnrollment.create({
    data: {
      patientId: patientMaria.id,
      programId: hypertensionProgram.id,
      enrolledAt: date60DaysAgo,
      status: "ACTIVE",
      complianceScore: 71,
      lastReading: date2DaysAgo,
      nextCheckIn: date3DaysFromNow,
      notes: "Intermittent compliance. Missed 2 weekly check-ins in week 6. Systolic BP spiked to 168 mmHg — AI flagged for clinical review.",
    },
  });

  // ── VITAL READINGS: David (Glucose — 90 days, bi-weekly) ───────────────────
  const glucoseReadings = [
    // Week 1-4: High readings (uncontrolled)
    { daysAgo: 90, value: 218, status: "HIGH",     flag: "Fasting glucose significantly elevated. Dietary review recommended." },
    { daysAgo: 87, value: 195, status: "HIGH",     flag: "Post-meal spike detected. Consider adjusting Metformin dosage." },
    { daysAgo: 84, value: 210, status: "HIGH",     flag: null },
    { daysAgo: 81, value: 178, status: "HIGH",     flag: "Downward trend beginning. Reinforce dietary compliance." },
    // Week 5-8: Improving
    { daysAgo: 70, value: 162, status: "HIGH",     flag: null },
    { daysAgo: 63, value: 155, status: "HIGH",     flag: "Glucose improving steadily. Patient reported consistent low-carb diet." },
    { daysAgo: 56, value: 148, status: "HIGH",     flag: null },
    { daysAgo: 49, value: 143, status: "HIGH",     flag: "Near target range. Excellent trend. Reinforce positive behavior." },
    // Week 9-12: Controlled
    { daysAgo: 42, value: 138, status: "NORMAL",   flag: "Glucose in target range for first time. Great milestone!" },
    { daysAgo: 35, value: 125, status: "NORMAL",   flag: null },
    { daysAgo: 28, value: 119, status: "NORMAL",   flag: "Consistent control achieved. HbA1c likely to show significant improvement." },
    { daysAgo: 21, value: 112, status: "NORMAL",   flag: null },
    { daysAgo: 14, value: 108, status: "NORMAL",   flag: null },
    { daysAgo: 7,  value: 103, status: "NORMAL",   flag: "Outstanding compliance. Glucose well within target range." },
  ];

  for (const r of glucoseReadings) {
    const rDate = new Date();
    rDate.setDate(rDate.getDate() - r.daysAgo);
    await prisma.vitalReading.create({
      data: {
        enrollmentId: davidEnrollment.id,
        recordedAt: rDate,
        metricType: "GLUCOSE",
        value: r.value,
        unit: "mg/dL",
        status: r.status,
        aiFlag: r.flag ?? null,
        source: "PATIENT_REPORTED",
      },
    });
  }

  // ── VITAL READINGS: Maria (Systolic BP — 60 days, weekly) ─────────────────
  const bpReadings = [
    // Weeks 1-4: Very high
    { daysAgo: 60, sysBP: 168, diaBP: 102, sysStatus: "CRITICAL", diaStatus: "HIGH",   flag: "Critical: Systolic BP > 160 mmHg. Immediate clinical review required." },
    { daysAgo: 56, sysBP: 172, diaBP: 105, sysStatus: "CRITICAL", diaStatus: "CRITICAL", flag: "Systolic hypertensive crisis level. Flagging for urgent physician follow-up." },
    { daysAgo: 49, sysBP: 165, diaBP: 98,  sysStatus: "CRITICAL", diaStatus: "HIGH",   flag: null },
    { daysAgo: 42, sysBP: 158, diaBP: 96,  sysStatus: "HIGH",     diaStatus: "HIGH",   flag: "Medication adherence confirmed this week. Slight improvement." },
    // Week 5-6: Missed check-ins (no readings)
    // Week 7-8: Partial improvement
    { daysAgo: 28, sysBP: 152, diaBP: 92,  sysStatus: "HIGH",     diaStatus: "HIGH",   flag: "Resumed check-ins. BP still elevated but trending down." },
    { daysAgo: 21, sysBP: 148, diaBP: 90,  sysStatus: "HIGH",     diaStatus: "NORMAL", flag: null },
    // Week 9-10: Better but still high
    { daysAgo: 14, sysBP: 142, diaBP: 88,  sysStatus: "HIGH",     diaStatus: "NORMAL", flag: "Diastolic now in range. Systolic still needs attention." },
    { daysAgo: 2,  sysBP: 139, diaBP: 86,  sysStatus: "HIGH",     diaStatus: "NORMAL", flag: "Recent reading shows continued improvement. Encourage salt restriction." },
  ];

  for (const r of bpReadings) {
    const rDate = new Date();
    rDate.setDate(rDate.getDate() - r.daysAgo);
    await prisma.vitalReading.create({
      data: {
        enrollmentId: mariaEnrollment.id,
        recordedAt: rDate,
        metricType: "SYSTOLIC_BP",
        value: r.sysBP,
        unit: "mmHg",
        status: r.sysStatus,
        aiFlag: r.flag ?? null,
        source: "PATIENT_REPORTED",
      },
    });
    await prisma.vitalReading.create({
      data: {
        enrollmentId: mariaEnrollment.id,
        recordedAt: rDate,
        metricType: "DIASTOLIC_BP",
        value: r.diaBP,
        unit: "mmHg",
        status: r.diaStatus,
        aiFlag: null,
        source: "PATIENT_REPORTED",
      },
    });
  }

  // ── TASK: Maria's critical BP alert ───────────────────────────────────────
  await prisma.task.create({
    data: {
      patientId: patientMaria.id,
      clinicId: primaryClinic.id,
      title: "BP ALERT: Maria Torres — Systolic 172 mmHg Detected",
      description: "AI flagged a hypertensive crisis-level reading (172/105 mmHg) on her Week 2 check-in. Physician review and medication reassessment urgently needed.",
      priority: "Urgent",
      status: "Pending",
      assignedToId: coordinatorUser.id,
      assignedToName: "Clara Oswald",
    },
  });

  console.log("Database seeded with expanded clinical datasets successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
