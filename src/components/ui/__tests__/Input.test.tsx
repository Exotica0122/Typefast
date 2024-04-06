import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Input } from "../Input";

describe("Input", () => {
  const inputId = "1";
  const inputValue = "value";
  const inputLabel = "label";
  const inputMessage = "message";
  const inputOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders", () => {
    render(<Input id={inputId} />);
    expect(screen.getByTestId(inputId)).toBeDefined();
  });

  test("renders label", () => {
    render(<Input id={inputId} label={inputLabel} />);
    expect(screen.getByText(inputLabel)).toBeDefined();
  });

  test("renders message", () => {
    render(<Input id={inputId} message={inputMessage} />);
    expect(screen.getByText(inputMessage)).toBeDefined();
  });

  test("should call on change handler when typed", () => {
    render(<Input id={inputId} onChange={inputOnChange} />);
    const input = screen.getByTestId(inputId);
    fireEvent.change(input, { target: { value: inputValue } });

    expect(inputOnChange).toHaveBeenCalledOnce();
  });

  test("should render disabled input", () => {
    render(<Input id={inputId} onChange={inputOnChange} disabled />);
    const input = screen.getByTestId(inputId);
    fireEvent.change(input, { target: { value: inputValue } });

    expect(input).toHaveProperty("disabled");
  });
});
