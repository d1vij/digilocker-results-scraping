import { describe, expect, test } from "bun:test";
import path from "node:path";
import { generateAdmitCardNumber } from "~/lib";
import { fetchResults } from "~/lib/fetchResults";

test("Known Fetching", async () => {
    const rollnumber = "15623245";
    const admitnumber = "MA453022";

    const results = await fetchResults({
        admitnumber,
        rollnumber,
    });

    await Bun.write(
        path.join(__dirname, `../scraped/${rollnumber}.json`),
        JSON.stringify(results, null, 4),
    );

    expect(results).toBeObject();
}, 15_000);

describe("Unknown Fetching", () => {
    test("First", async () => {
        const rollnumber = "15623244";
        const admitnumber = generateAdmitCardNumber({
            fathersName: "jee",
            mothersName: "jee",
            centerNumber: "822285",
            schoolNumber: "30058",
            rollnumber,
        });

        const results = await fetchResults({
            admitnumber,
            rollnumber,
        });

        await Bun.write(
            path.join(__dirname, `../scraped/${rollnumber}.json`),
            JSON.stringify(results, null, 4),
        );

        expect(results).toBeObject();
    }, 15_000);

    test("Second", async () => {
        const rollnumber = "15623263";
        const admitnumber = generateAdmitCardNumber({
            fathersName: "inde",
            mothersName: "inde",
            centerNumber: "822285",
            schoolNumber: "30058",
            rollnumber,
        });

        const results = await fetchResults({
            admitnumber,
            rollnumber,
        });

        await Bun.write(
            path.join(__dirname, `../scraped/${rollnumber}.json`),
            JSON.stringify(results, null, 4),
        );

        expect(results).toBeObject();
    }, 15_000);
});
