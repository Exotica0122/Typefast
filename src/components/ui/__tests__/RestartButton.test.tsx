import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RestartButton } from "../RestartButton";

describe("RestartButton", () => {
  const buttonTestId = "1";
  const mockRestart = vi.fn();

  test("renders", () => {
    render(<RestartButton id={buttonTestId} handleRestart={mockRestart} />);
    expect(screen.getByTestId(buttonTestId)).toBeDefined();
  });

  test("should restart when clicked", () => {
    render(<RestartButton id={buttonTestId} handleRestart={mockRestart} />);
    const restartButton = screen.getByTestId(buttonTestId);
    fireEvent.click(restartButton);
    expect(mockRestart).toHaveBeenCalledOnce();
  });
});
