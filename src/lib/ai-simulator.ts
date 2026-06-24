"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

interface AIResponse {
  sentiment: "Positive" | "Neutral" | "Negative" | "Alert";
  riskScore: number;
  aiMessage: string;
  createTask: boolean;
  taskTitle?: string;
  taskDesc?: string;
  riskReasons: string[];
}

/**
 * Advanced NLP classifier & medical FAQ engine
 */
export async function analyzePatientMessage(
  content: string, 
  treatmentName: string, 
  detailStyle = "Concise"
): Promise<AIResponse> {
  const text = content.toLowerCase();
  
  // 1. HIPAA Sentiment Check: Detect patient frustration/complaints
  const frustrationKeywords = ["frustrated", "angry", "wait", "nobody", "ignored", "worst", "terrible", "bad service", "complain"];
  const isFrustrated = frustrationKeywords.some((kw) => text.includes(kw));
  
  if (isFrustrated) {
    const detailMsg = detailStyle === "Detailed" 
      ? "I hear your frustration and apologize sincerely if you feel ignored. I am transferring this conversation to our chief nurse Sarah Connor immediately so she can look into your profile and call you back directly. Your care is our absolute priority."
      : "I apologize for the frustration. I have escalated this conversation directly to our nursing team to contact you right away.";
      
    return {
      sentiment: "Alert",
      riskScore: 0.75,
      aiMessage: detailMsg,
      createTask: true,
      taskTitle: "Patient Complaint / Frustrated Sentiment Detected",
      taskDesc: `Patient expressed frustration: "${content}". AI escalated to nurse override.`,
      riskReasons: ["Patient expressed negative sentiment", "Communication delay reported"],
    };
  }

  // 2. Urgent / Danger Symptoms Check
  const dangerKeywords = ["bleed", "pain", "hurt", "swell", "pus", "fever", "hot", "vomit", "nausea", "chills", "stitch", "loose", "broke", "infection"];
  const isDanger = dangerKeywords.some((kw) => text.includes(kw));
  const isIncreasingPain = text.includes("pain") && (text.includes("worse") || text.includes("increase") || text.includes("lot") || text.includes("bad") || text.includes("not helping"));

  if (isIncreasingPain || (isDanger && (text.includes("heavy") || text.includes("more") || text.includes("severe") || text.includes("no normal") || text.includes("bleeding a lot")))) {
    const detailMsg = detailStyle === "Detailed"
      ? "I have flagged your symptoms for immediate clinical review. Severe pain and bleeding can be warning signs of infection or post-op complications. A Care Coordinator from our clinic will call you on your phone shortly to assist you. If this is a medical emergency, please dial 911 immediately."
      : "I have flagged your symptoms for immediate review. A clinic nurse will call you shortly. If this is an emergency, please call 911.";

    return {
      sentiment: "Alert",
      riskScore: 0.90,
      aiMessage: detailMsg,
      createTask: true,
      taskTitle: "Urgent: Severe post-op symptoms reported",
      taskDesc: `Patient reported severe symptoms: "${content}". AI flagged as critical. Call patient.`,
      riskReasons: ["Severe pain/bleeding reported", "Pain medications not helping"],
    };
  }

  if (isDanger) {
    const detailMsg = detailStyle === "Detailed"
      ? "I understand you are experiencing some discomfort and swelling. I have logged these symptoms in your electronic health chart. To manage this at home: apply a cold compress for 15 minutes hourly, rest with your head elevated, and continue taking prescribed medications. A care coordinator will monitor your logs."
      : "I understand you are experiencing discomfort. I have logged this. Try applying ice, rest, and keep taking prescribed meds. A nurse will monitor.";

    return {
      sentiment: "Negative",
      riskScore: 0.55,
      aiMessage: detailMsg,
      createTask: true,
      taskTitle: "Follow Up: Post-op discomfort reported",
      taskDesc: `Patient reported mild symptoms: "${content}". AI logged for nurse review.`,
      riskReasons: ["Mild recovery pain/swelling reported"],
    };
  }

  // 3. Clinical FAQ Lookup Engine matching treatment context
  const isShowerQ = text.includes("shower") || text.includes("bath") || text.includes("wash");
  const isExerciseQ = text.includes("exercise") || text.includes("workout") || text.includes("run") || text.includes("lift");
  const isFoodQ = text.includes("eat") || text.includes("food") || text.includes("drink") || text.includes("coffee") || text.includes("diet");

  const treatment = treatmentName.toLowerCase();

  if (isShowerQ) {
    if (treatment.includes("dental") || treatment.includes("implant")) {
      return {
        sentiment: "Neutral",
        riskScore: 0.15,
        aiMessage: detailStyle === "Detailed"
          ? "Approved Dental Guidance: You can shower or wash normally. However, avoid extremely hot baths, steam rooms, or saunas for the first 72 hours, as heat increases blood pressure, which can cause the implant site to throbbing or bleed."
          : "Approved Dental Guidance: You can shower as normal, but avoid hot baths or saunas for 3 days to prevent bleeding.",
        createTask: false,
        riskReasons: [],
      };
    } else if (treatment.includes("knee") || treatment.includes("surgery") || treatment.includes("arthroscopy")) {
      return {
        sentiment: "Neutral",
        riskScore: 0.20,
        aiMessage: detailStyle === "Detailed"
          ? "Approved Surgical Guidance: You may shower 48 hours after your procedure. However, you must keep the knee dressing completely dry and clean. Wrap the area in plastic wrap or a waterproof sleeve. Do not submerge your leg in a bath."
          : "Approved Surgical Guidance: You can shower after 48 hours, but keep the dressing dry. Do not soak in a tub.",
        createTask: false,
        riskReasons: [],
      };
    } else {
      return {
        sentiment: "Neutral",
        riskScore: 0.10,
        aiMessage: "Approved Guidance: You can shower as normal. Keep the incision area clean and dry. Gently pat dry with a towel; do not scrub the wound.",
        createTask: false,
        riskReasons: [],
      };
    }
  }

  if (isExerciseQ) {
    if (treatment.includes("dental") || treatment.includes("implant")) {
      return {
        sentiment: "Neutral",
        riskScore: 0.15,
        aiMessage: detailStyle === "Detailed"
          ? "Approved Dental Guidance: We recommend avoiding strenuous physical activity, running, or heavy lifting for 48 to 72 hours after surgery. Increased heart rate can cause throbbing pain, swelling, and bleeding at the surgical site."
          : "Approved Dental Guidance: Avoid strenuous workouts, running, or lifting for 3 days to prevent site throbbing.",
        createTask: false,
        riskReasons: [],
      };
    } else if (treatment.includes("knee") || treatment.includes("surgery")) {
      return {
        sentiment: "Neutral",
        riskScore: 0.30,
        aiMessage: detailStyle === "Detailed"
          ? "Approved Surgical Guidance: Avoid any running, cycling, or gym training. Only perform the light physical therapy exercises specifically assigned to you by Dr. Marcus Jones. Physical therapy should begin on Day 10."
          : "Approved Surgical Guidance: Perform only your prescribed physical therapy. No gym workouts or running.",
        createTask: false,
        riskReasons: [],
      };
    } else {
      return {
        sentiment: "Neutral",
        riskScore: 0.12,
        aiMessage: "Approved Guidance: Rest is priority. Avoid intense workouts or heavy lifting for the first week, then resume light walking as tolerated.",
        createTask: false,
        riskReasons: [],
      };
    }
  }

  if (isFoodQ) {
    if (treatment.includes("dental") || treatment.includes("implant")) {
      return {
        sentiment: "Neutral",
        riskScore: 0.10,
        aiMessage: detailStyle === "Detailed"
          ? "Approved Dental Guidance: Stick to soft foods for the first 3-5 days (yogurt, pudding, warm soups, scrambled eggs). Avoid hard, crunchy, or spicy foods, and do not drink hot coffee or use a straw, as the suction can dislodge the blood clot."
          : "Approved Dental Guidance: Stick to soft foods (yogurt, soups). Avoid hard/spicy items, hot coffee, and straws.",
        createTask: false,
        riskReasons: [],
      };
    } else if (treatment.includes("diabetes") || treatment.includes("medformin")) {
      return {
        sentiment: "Neutral",
        riskScore: 0.10,
        aiMessage: detailStyle === "Detailed"
          ? "Approved Diabetes Guidance: Keep focusing on low-glycemic, fiber-rich foods (vegetables, lean proteins, whole grains). Avoid refined carbohydrates and sugary drinks. Remember to check blood sugar levels 2 hours post-meals."
          : "Approved Diabetes Guidance: Maintain a low-glycemic diet. Focus on proteins and veggies; avoid refined sugars.",
        createTask: false,
        riskReasons: [],
      };
    }
  }

  // Out of bounds FAQs escalation
  if (text.includes("help") || text.includes("question") || text.includes("not sure") || text.includes("guidelines")) {
    return {
      sentiment: "Neutral",
      riskScore: 0.30,
      aiMessage: "I want to be sure you receive the correct guidance. I am forwarding your specific question to our care team so a nurse can review and send you a message shortly.",
      createTask: true,
      taskTitle: "Patient Question Escalated from Chat",
      taskDesc: `Patient asked: "${content}". AI forwarded to clinic desk.`,
      riskReasons: ["Patient requested assistance"],
    };
  }

  // 4. Check for positive recovery notes
  const positiveKeywords = ["good", "fine", "better", "great", "no pain", "ok", "healed", "happy", "smooth", "heals"];
  const isPositive = positiveKeywords.some((kw) => text.includes(kw));

  if (isPositive) {
    return {
      sentiment: "Positive",
      riskScore: 0.05,
      aiMessage: detailStyle === "Detailed"
        ? "That is wonderful to hear! We are glad you are feeling better. Please continue following your post-op guidelines, rest, and let us know if anything changes. We will check in again at the next scheduled milestone."
        : "That is wonderful to hear! Continue resting and following post-op guidelines.",
      createTask: false,
      riskReasons: [],
    };
  }

  // 5. Default fallback (Neutral)
  return {
    sentiment: "Neutral",
    riskScore: 0.22,
    aiMessage: "Thank you for the update. I have logged this response in your recovery log. Please remember to rest, avoid strenuous activity, and reach out if you have any questions.",
    createTask: false,
    riskReasons: [],
  };
}

/**
 * Submits a patient message and generates the AI response under Autopilot
 */
export async function submitPatientResponse(patientId: string, content: string, followUpId?: string) {
  try {
    // 1. Create Patient message
    const patientMsg = await prisma.message.create({
      data: {
        patientId,
        followUpId,
        sender: "Patient",
        content,
        status: "Read",
      },
    });

    // 2. Fetch patient to resolve preferences and treatment
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { visits: true },
    });

    if (!patient) return { success: false, error: "Patient not found" };

    const treatment = patient.visits[0]?.treatment || "procedure";
    const detailStyle = patient.detailPreference;

    // 3. Analyze patient response
    const analysis = await analyzePatientMessage(content, treatment, detailStyle);

    // 4. Create Patient Response record
    await prisma.patientResponse.create({
      data: {
        patientId,
        followUpId,
        responseText: content,
        sentiment: analysis.sentiment,
        riskScore: analysis.riskScore,
      },
    });

    // 5. Calculate engagement score changes
    let newEngagement = patient.healthEngagementScore;
    if (analysis.sentiment === "Alert") {
      newEngagement = Math.max(20, patient.healthEngagementScore - 15); // Drop score on alerts
    } else if (analysis.sentiment === "Positive") {
      newEngagement = Math.min(100, patient.healthEngagementScore + 3); // Increase score on positive checks
    }

    // 6. Update Patient status, risk, reasons, and engagement
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        status: analysis.sentiment === "Alert" || analysis.sentiment === "Negative" ? "HighRisk" : patient.status,
        predictiveRiskScore: analysis.riskScore,
        riskReasons: JSON.stringify(analysis.riskReasons),
        healthEngagementScore: newEngagement,
      },
    });

    // 7. Create Clinical Task if flagged
    if (analysis.createTask) {
      await prisma.task.create({
        data: {
          patientId,
          clinicId: patient.clinicId,
          title: analysis.taskTitle || "AI Triage Alert",
          description: analysis.taskDesc || `Patient response flagged by AI: "${content}"`,
          priority: analysis.sentiment === "Alert" ? "Urgent" : "Medium",
          status: "Pending",
          assignedToName: "Nurse Sarah Connor",
        },
      });
    }

    // 8. Generate AI Assistant automated reply
    const aiMsg = await prisma.message.create({
      data: {
        patientId,
        followUpId,
        sender: "AI",
        content: analysis.aiMessage,
        status: "Sent",
      },
    });

    revalidatePath("/messages");
    revalidatePath("/dashboard");
    revalidatePath("/patients");

    return {
      success: true,
      patientMessage: patientMsg,
      aiMessage: aiMsg,
      analysis,
    };
  } catch (error) {
    console.error("Error submitting patient response:", error);
    return { success: false, error: "Failed to process message" };
  }
}

/**
 * Send a manual clinician reply to override the AI autopilot
 */
export async function submitClinicianMessage(patientId: string, content: string) {
  try {
    const msg = await prisma.message.create({
      data: {
        patientId,
        sender: "Clinic",
        content,
        status: "Sent",
      },
    });

    // Add Audit Log
    const nurse = await prisma.user.findFirst({ where: { role: "Nurse" } });
    if (nurse) {
      await prisma.auditLog.create({
        data: {
          userId: nurse.id,
          action: "MANUAL_MESSAGE",
          entity: "Message",
          entityId: msg.id,
          details: `Sent manual clinician reply to patient: "${content.substring(0, 30)}..."`,
        },
      });
    }

    revalidatePath("/messages");
    return { success: true, message: msg };
  } catch (error) {
    console.error("Error sending clinician message:", error);
    return { success: false, error: "Failed to send message" };
  }
}
