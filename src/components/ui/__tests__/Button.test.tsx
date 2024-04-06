import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  const buttonText = "button";
  const mockOnClick = vi.fn();

  test("renders", () => {
    render(<Button>{buttonText}</Button>);
    expect(screen.getByText(buttonText)).toBeDefined();
  });

  test("should handle click event", async () => {
    render(<Button onClick={mockOnClick}>{buttonText}</Button>);
    fireEvent.click(await screen.findByText(buttonText));
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
