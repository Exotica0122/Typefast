import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../Label";

describe("Label", () => {
  const labelTitle = "title";
  const labelValue = "value";

  test("renders", () => {
    render(<Label title={labelTitle} value={labelValue} />);
    expect(screen.getByText(labelTitle)).toBeDefined();
    expect(screen.getByText(labelValue)).toBeDefined();
  });
});
