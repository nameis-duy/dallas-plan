import test from "node:test";
import assert from "node:assert/strict";
import { parsePackingState } from "../src/utils/packing.js";

test("packing rejects invalid, outdated and unknown saved state safely", () => {
  for (const raw of [
    "bad JSON",
    "null",
    "{}",
    '{"version":0,"checked":[],"custom":[]}',
  ])
    assert.deepEqual(parsePackingState(raw, ["jacket"]), {
      version: 1,
      checked: [],
      custom: [],
    });
  const saved = JSON.stringify({
    version: 1,
    checked: ["jacket", "jacket", "removed", 5, "custom-abc"],
    custom: [
      { id: "custom-abc", label: "My item" },
      { id: "unsafe", label: "Invalid" },
    ],
  });
  assert.deepEqual(parsePackingState(saved, ["jacket"]), {
    version: 1,
    checked: ["jacket", "custom-abc"],
    custom: [{ id: "custom-abc", label: "My item" }],
  });
});
