export const generatePrescription = (fpg, ppPG, rpg, hbA1cValue, symptomsCount) => {
    let prescriptionType = "Incomplete"; // Default to incomplete investigation
    let instructions = [
        "Brisk walking/ Aerobic exercise for 30 minutes a day.",
        "Reduce Carbohydrate/ Calorie/ Sugar Intake.",
        "Reduce fat and oil intake.",
        "Increase protein intake.",
        "Get your baseline eye test (including retina check-up) done at the earliest.",
        "Quit alcohol and smoking if you do so.",
    ];
    let medications = [];
    

    const isDiabetic = (value) => value >= 126;
    const isPreDiabetic = (value) => value >= 100 && value < 126;

    if (fpg !== null || ppPG !== null || rpg !== null) {
        const reports = [fpg, ppPG, rpg].filter(v => v !== null);
        const diabeticReports = reports.filter(isDiabetic);
        const preDiabeticReports = reports.filter(isPreDiabetic);

        if (reports.length === 1) {
            const reportValue = reports[0];
            const isReportDiabetic = isDiabetic(reportValue);
            const isReportPreDiabetic = isPreDiabetic(reportValue);

            if (isReportPreDiabetic) {
                prescriptionType = "Incomplete";
                instructions.push(
                    symptomsCount === 0
                        ? "Repeat FPG and PpPG (add HbA1c if possible) within 1 week."
                        : "Repeat FPG and PpPG within 1 week."
                );
            } else if (isReportDiabetic) {
                prescriptionType = symptomsCount === 0 ? "Incomplete" : "Complete";
                if (prescriptionType === "Incomplete") {
                    instructions.push("Repeat FPG and PpPG within 1 week.");
                } else {
                    medications = [
                        "Tablet A (dose: x mg) - 1 tablet before breakfast",
                        "Tablet B (dose: y mg) - 1 tablet after lunch",
                        "Tablet C (dose: z mg) - 1 tablet with dinner",
                    ];
                }
            }
        } else if (reports.length === 2) {
            const isOnePreDiabetic = preDiabeticReports.length === 1 && diabeticReports.length === 1;

            if (isOnePreDiabetic || preDiabeticReports.length === 2) {
                prescriptionType = "Incomplete";
                instructions.push(
                    symptomsCount === 0
                        ? "Repeat FPG and PpPG within 1 month."
                        : "Repeat FPG and PpPG within 1 month."
                );
            } else if (diabeticReports.length === 2 || diabeticReports.length === 1) {
                prescriptionType = symptomsCount >= 2 ? "Complete" : "Incomplete";
                if (prescriptionType === "Complete") {
                    medications = [
                        "Tablet A (dose: x mg) - 1 tablet before breakfast",
                        "Tablet B (dose: y mg) - 1 tablet after lunch",
                        "Tablet C (dose: z mg) - 1 tablet with dinner",
                    ];
                } else {
                    instructions.push("Repeat FPG and PpPG within 1 month.");
                }
            }
        }
    }

    if (hbA1cValue !== null) {
        if (hbA1cValue < 5.7) {
            prescriptionType = "Incomplete";
            instructions.push("HbA1c: Normal. Advice: Diet and exercise.");
        } else if (hbA1cValue >= 5.7 && hbA1cValue < 6.5) {
            prescriptionType = "Incomplete";
            instructions.push("HbA1c: Pre-diabetes. Advice: Diet/exercise and repeat FPG and HbA1c in 3 months.");
        } else if (hbA1cValue >= 6.5) {
            prescriptionType = "Complete";
            medications = [
                "Tablet A (dose: x mg) - 1 tablet before breakfast",
                "Tablet B (dose: y mg) - 1 tablet after lunch",
                "Tablet C (dose: z mg) - 1 tablet with dinner",
            ];
        }
    }

    if (prescriptionType === "Incomplete") {
        instructions.push("Repeat the following tests within 1-2 week, and review with reports.");
        medications.push("To be decided during next follow-up with reports.");
    }

    const prescription = `
${" ".repeat(150)}Date and Time: ${new Date().toLocaleString()}

General Instructions:
${instructions.map((inst, index) => `${index + 1}. ${inst}`).join("\n")}

Medication:
${medications.map((med, index) => `${index + 1}. ${med}`).join("\n")}

${" ".repeat(160)}Signature of the Doctor:
${" ".repeat(160)}Name of the Doctor
    `;

    return prescription;
};
