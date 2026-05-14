import { expect, test } from "bun:test";
import { generateAdmitCardNumber } from "~/lib";

test("Generating Known admit cards", () => {
    expect(
        generateAdmitCardNumber({
            fathersName: "verma",
            mothersName: "verma",
            rollnumber: "72826245",
            schoolNumber: "30672",
            centerNumber: "242277",
        }),
    ).toBe("MA453022");
});
