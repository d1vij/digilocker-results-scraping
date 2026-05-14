import path from "node:path";
import { parallel } from "radashi";
import { fetchIpStudents } from "~/fetchers";
import type { Result } from "~/types";
import ipStudents from "#/student-data/ip-students.json";

async function main() {
    const results = await parallel(10, ipStudents, (student) =>
        fetchIpStudents(student, {
            centerNumber: "822285",
            schoolNumber: "30058",
        }),
    );
    const filtered = results.filter(Boolean) as Result[];
    await Bun.write(
        path.join(__dirname, "../data/scraped/ip-students.json"),
        JSON.stringify(filtered, null, 4),
    );
}

if (import.meta.main) {
    await main();
}
