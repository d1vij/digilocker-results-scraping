import {
    AdmitCardNumberGeneratorError,
    fetchResults,
    generateAdmitCardNumber,
} from "~/lib";
import type { CommonData, Result, StudentDataSchema } from "~/types";

export async function fetchIpStudents(
    student: StudentDataSchema,
    commonData: CommonData,
): Promise<Result | null> {
    let admitnumber: string;
    try {
        admitnumber = generateAdmitCardNumber({
            ...commonData,
            // im gonna assume both the parents have the same surname as the student
            // since we only require the letters from the surname for generating the admit card number
            fathersName: student.name,
            mothersName: student.name,
            rollnumber: student.rollnumber,
        });
    } catch (e: unknown) {
        if (e instanceof AdmitCardNumberGeneratorError) {
        }

        return null;
    }

    try {
        const results = await fetchResults({
            admitnumber,
            rollnumber: student.rollnumber,
        });
        return results;
    } catch (e: unknown) {
        if (e instanceof Error) {
            return null;
        }

        throw e;
    }
}
