import path from "node:path";
import chalk from "chalk";
import { fork, parallel } from "radashi";
import { davFetcher } from "~/fetchers";
import { MARKER } from "~/lib/utils";
import {
    type CBSEResultResponse,
    CBSEResultResponseSchema,
} from "~/schemas/CBSEResultSchema";
import {
    type FailedResultFetch,
    FailedResultFetchSchema,
} from "~/schemas/FailedResultFetchSchema";
import type { Result, StudentDataSchema } from "~/types";
import davStudents from "#/student-data/dav-students.json";

import * as v from "valibot";

const DavResultsSchema = v.object({
    success: v.array(CBSEResultResponseSchema),
    failed: v.array(FailedResultFetchSchema),
});
export type DavResults = v.InferInput<typeof DavResultsSchema>;

async function main() {
    const centerNumber = "822285";
    const schoolNumber = "30058";

    const results = await parallel<
        StudentDataSchema,
        FailedResultFetch | CBSEResultResponse
    >(10, davStudents, (student) => {
        console.log(`${MARKER} Fetching result for ${student.name}`);
        return davFetcher(student, {
            centerNumber,
            schoolNumber,
        });
    });

    const [failed, successfull] = fork(results, (r) => r.status === "failed");

    console.log(
        `${MARKER} Scraped (${chalk.green(successfull.length)} + ${chalk.red(failed.length)})/${davStudents.length} results.`,
    );

    const json = v.parse(DavResultsSchema, {
        success: successfull,
        failed: failed,
    });

    await Bun.write(
        path.join(__dirname, "../../data/scraped/dav.json"),
        JSON.stringify(json, null, 4),
    );
}

if (import.meta.main) {
    await main();
}
