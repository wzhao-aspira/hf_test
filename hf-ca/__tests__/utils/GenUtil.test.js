/* eslint-disable global-require */
/* eslint-disable no-undef */

import { sum } from "../../src/utils/GenUtil";

test("sum", () => {
    const value = sum(1, 2);
    expect(value).toBe(3);
});
