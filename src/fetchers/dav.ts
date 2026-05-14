import { fetchResults, generateAdmitCardNumber } from "~/lib";
import { MARKER } from "~/lib/utils";
import type { CBSEResultResponse } from "~/schemas/CBSEResultSchema";
import type { FailedResultFetch } from "~/schemas/FailedResultFetchSchema";
import type { CommonData, Result, StudentDataSchema } from "~/types";

export async function davFetcher(
    student: StudentDataSchema,
    commonData: CommonData,
): Promise<CBSEResultResponse | FailedResultFetch> {
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
        if (e instanceof Error) {
            console.log(
                `${MARKER} Error in generating admit card number. Error: ${e.message}`,
            );
        } else throw e;

        return {
            status: "failed",
            student_name: student.name,
            rollnumber: student.rollnumber,
        } satisfies FailedResultFetch;
    }

    try {
        const results = await fetchResults({
            admitnumber,
            rollnumber: student.rollnumber,
        });
        return results;
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.log(
                `${MARKER} Error in generating admit card number. Error: ${e.message}`,
            );

            return {
                status: "failed",
                student_name: student.name,
                rollnumber: student.rollnumber,
            } satisfies FailedResultFetch;
        }

        throw e;
    }
}
