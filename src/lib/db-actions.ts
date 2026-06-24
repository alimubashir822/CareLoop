"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

/**
 * Complete a clinical follow-up task
 */
export async function completeTask(taskId: string, redirectPath = "/dashboard") {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "Completed" },
    });
    
    // Add audit log
    const completedTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (completedTask) {
      // Find nurse (assignee or default)
      const nurse = await prisma.user.findFirst({ where: { role: "Nurse" } });
      if (nurse) {
        await prisma.auditLog.create({
          data: {
            userId: nurse.id,
            action: "COMPLETE_TASK",
            entity: "Task",
            entityId: taskId,
            details: `Completed task: ${completedTask.title}`,
          },
        });
      }
    }
    
    revalidatePath(redirectPath);
    return { success: true };
  } catch (error) {
    console.error("Failed to complete task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

/**
 * Reset simulated database alert for Sarah Jenkins
 */
export async function resetSarahAlert() {
  try {
    // 1. Re-add Sarah's task if it was completed
    const existing = await prisma.task.findFirst({
      where: {
        patient: { name: "Sarah Jenkins" },
        title: { contains: "Recovery Pain" },
      },
    });

    if (existing) {
      await prisma.task.update({
        where: { id: existing.id },
        data: { status: "Pending" },
      });
    } else {
      const sarah = await prisma.patient.findFirst({ where: { name: "Sarah Jenkins" } });
      const nurse = await prisma.user.findFirst({ where: { role: "Nurse" } });
      if (sarah && nurse) {
        await prisma.task.create({
          data: {
            patientId: sarah.id,
            clinicId: sarah.clinicId,
            title: "Contact Sarah Jenkins: Recovery Pain & Bleeding Alert",
            description: "AI Flagged: Sarah reported 'pain increasing a lot' and 'bleeding around the stitch' during her Day 3 Follow-Up check-in.",
            priority: "Urgent",
            status: "Pending",
            assignedToId: nurse.id,
          },
        });
      }
    }

    // 2. Mark Sarah as HighRisk
    await prisma.patient.updateMany({
      where: { name: "Sarah Jenkins" },
      data: { status: "HighRisk" },
    });

    revalidatePath("/dashboard");
    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Failed to reset alert:", error);
    return { success: false };
  }
}

/**
 * Simulate a new incoming patient alert
 */
export async function simulateNewAlert(clinicId: string) {
  try {
    const patient = await prisma.patient.findFirst({
      where: { clinicId, name: { not: "Sarah Jenkins" } },
    });

    if (!patient) return { success: false, error: "No suitable patient found to simulate alert." };

    // Create a new task representing an AI flagged alert
    const titles = [
      "AI Alert: Medication side effect reported",
      "AI Alert: Patient missed Day 3 wound checklist",
      "AI Alert: Severe nausea reported from pain meds",
    ];
    const descriptions = [
      `Patient reported mild dizziness and stomach upset after taking post-op medication. AI flagged potential adverse reaction.`,
      `Patient has not responded to multiple follow-up forms. AI flagged potential communication gap.`,
      `Patient reported severe nausea and headache since yesterday. Suggest calling to verify if they can adjust medication dose.`,
    ];

    const idx = Math.floor(Math.random() * titles.length);

    await prisma.task.create({
      data: {
        patientId: patient.id,
        clinicId,
        title: titles[idx],
        description: `${descriptions[idx]} (Triggered via Dashboard simulation)`,
        priority: "High",
        status: "Pending",
      },
    });

    // Also update patient status
    await prisma.patient.update({
      where: { id: patient.id },
      data: { status: "HighRisk" },
    });

    revalidatePath("/dashboard");
    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Failed to simulate alert:", error);
    return { success: false, error: "Failed to simulate alert" };
  }
}

/**
 * Assign a Care Journey (CarePlan) to a patient
 */
export async function assignCarePlan(patientId: string, carePlanId: string) {
  try {
    const carePlan = await prisma.carePlan.findUnique({ where: { id: carePlanId } });
    if (!carePlan) return { success: false, error: "Care plan not found" };

    const steps = JSON.parse(carePlan.stepsJson);

    // Create follow-ups based on steps
    for (const step of steps) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + step.day);

      await prisma.followUp.create({
        data: {
          patientId,
          carePlanId,
          title: step.title,
          status: "Pending",
          scheduledDate,
        },
      });
    }

    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Failed to assign care plan:", error);
    return { success: false, error: "Failed to assign care plan" };
  }
}

/**
 * AI-Generated Care Plan from physician description
 */
export async function generateAICarePlan(clinicId: string, prompt: string) {
  try {
    const text = prompt.toLowerCase();
    let name = "AI Generated Care Journey";
    let desc = `Custom care protocol created for prompt: "${prompt}"`;
    let triggerEvent = "VisitCompleted";
    let steps = [] as Array<any>;

    if (text.includes("wisdom") || text.includes("tooth") || text.includes("dental") || text.includes("teeth") || text.includes("extraction")) {
      name = "Post-Extraction Recovery Journey";
      desc = "AI Triage: Automated sequence for post-extraction dental patients, focusing on soft food adherence, dry socket prevention, and swelling monitors.";
      steps = [
        { day: 0, type: "Instructions", channel: "Portal", title: "Soft Food & Salt Water Rinse Guide" },
        { day: 1, type: "CheckIn", channel: "SMS", title: "Day 1 Post-Op Swelling check" },
        { day: 3, type: "CheckIn", channel: "Portal", title: "Day 3 Critical Pain Triage" },
        { day: 7, type: "Reminder", channel: "SMS", title: "Day 7 Suture Removal Notice" }
      ];
    } else if (text.includes("knee") || text.includes("therapy") || text.includes("surgery") || text.includes("rehab") || text.includes("joint")) {
      name = "Post-Surgical Joint Rehab Journey";
      desc = "AI Triage: Comprehensive sequence for joint surgeries, outlining wound dryness checks, physical therapy progressions, and unmanaged pain triage.";
      steps = [
        { day: 0, type: "Instructions", channel: "Portal", title: "Joint Elevation & Ice Guide" },
        { day: 2, type: "CheckIn", channel: "Portal", title: "Day 2 Swelling & Incision Check" },
        { day: 10, type: "Reminder", channel: "SMS", title: "Physical Therapy Onset Notification" },
        { day: 14, type: "Reminder", channel: "Email", title: "Orthopedic Suture Removal Schedule" }
      ];
    } else if (text.includes("diabetes") || text.includes("glucose") || text.includes("sugar")) {
      name = "Chronic Glycemic Tracking Journey";
      desc = "AI Triage: Long-term diabetes check-ins, monthly glucose level log forms, and quarterly scheduling outreach reminders.";
      steps = [
        { day: 0, type: "Instructions", channel: "Portal", title: "Daily Glucose Log Intake Guide" },
        { day: 30, type: "CheckIn", channel: "Email", title: "Monthly Blood Sugar Review Log" },
        { day: 90, type: "Reminder", channel: "SMS", title: "Quarterly HbA1c Appointment Booking" }
      ];
    } else {
      name = "AI Recovery Journey Support";
      desc = `Custom AI-designed care plan for clinical prompt: "${prompt}"`;
      steps = [
        { day: 0, type: "Instructions", channel: "Portal", title: "Post-Visit Care Overview" },
        { day: 3, type: "CheckIn", channel: "SMS", title: "Day 3 Recovery Assessment" },
        { day: 7, type: "Reminder", channel: "Email", title: "Week 1 Healing Check Call" }
      ];
    }

    const carePlan = await prisma.carePlan.create({
      data: {
        name,
        description: desc,
        clinicId,
        triggerEvent,
        stepsJson: JSON.stringify(steps)
      }
    });

    // Add Audit Log
    const admin = await prisma.user.findFirst({ where: { role: "Doctor" } }) || await prisma.user.findFirst();
    if (admin) {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "GENERATE_PLAN",
          entity: "CarePlan",
          entityId: carePlan.id,
          details: `Generated AI care plan: "${name}" from prompt: "${prompt}"`,
        }
      });
    }

    revalidatePath("/care-plans");
    return { success: true, plan: carePlan };
  } catch (error) {
    console.error("Failed to generate care plan:", error);
    return { success: false, error: "Failed to generate care plan" };
  }
}
