import type { GenerateAdmitCardNumberProps } from "~/lib";

export type StudentDataSchema = {
    name: string;
    rollnumber: string;
};

export type Result = Record<string, unknown>;
export type ScrapedData = Result[];
export type CommonData = Omit<
    GenerateAdmitCardNumberProps,
    "fathersName" | "mothersName" | "rollnumber"
>;
