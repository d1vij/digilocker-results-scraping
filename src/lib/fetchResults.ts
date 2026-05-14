import chalk from "chalk";
import type { Result } from "~/types";
import { MARKER } from "~/utils";

export type FetchResultsProps = {
    rollnumber: string;
    admitnumber: string;
};
export async function fetchResults({
    admitnumber,
    rollnumber,
}: FetchResultsProps): Promise<Result> {
    const response = await fetch(
        "https://results.digilocker.gov.in/api/cbse/hscer/results",
        {
            method: "POST",
            headers: {
                accept: "*/*",
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
                cookie: "Path=/",
                Referer:
                    "https://results.digilocker.gov.in/CBSE12th2026resultXIInruew.html",
            },
            body: `rroll=${rollnumber}&year=2026&admn_id=${admitnumber}`,
        },
    );

    const json: Result = await response.json();

    /**
     * If Errored
     * {
     *     "status": 400,
     *     "request_id": "721cbe64-4b3a-4e02-81fe-82e77496ef6d",
     *     "error_code": "ERR_VALUE_MISMATCH",
     *     "message": "Invalid Admission id"
     * },
     */
    if (json.status === 400) {
        throw new Error(
            `${MARKER} Error in fetching results for ${rollnumber} | ${admitnumber}.\n Error: ${chalk.yellow(json.error_code)} | ${json.message}`,
        );
    }

    return json;
}
