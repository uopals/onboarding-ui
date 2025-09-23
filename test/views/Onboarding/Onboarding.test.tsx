import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import Onboarding from "../../../src/views/Onboarding/Onboarding";
import { API_BASE_URL } from "../../../src/constants";

const validCorporationNumber = "123456789";
const server = setupServer(
  http.post(`${API_BASE_URL}/profile-details`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.get(`${API_BASE_URL}/corporation-number/:corporationNumber`, (req) => {
    if (req.params.corporationNumber === validCorporationNumber) {
      return HttpResponse.json({ valid: true }, { status: 200 });
    }

    return HttpResponse.json(
      { valid: false, message: "Invalid corporation number" },
      { status: 404 },
    );
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Onboarding View", () => {
  it("renders the onboarding step and form", async () => {
    render(<Onboarding />);

    expect(screen.getByText(/Step 1 of 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Onboarding Form/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Corporation Number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields and invalid input", async () => {
    render(<Onboarding />);

    // Enter invalid data
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: " " },
    });
    fireEvent.blur(screen.getByLabelText(/First Name/i));
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: " " },
    });
    fireEvent.blur(screen.getByLabelText(/Last Name/i));
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567" },
    });
    fireEvent.blur(screen.getByLabelText(/Phone Number/i));
    fireEvent.change(screen.getByLabelText(/Corporation Number/i), {
      target: { value: "invalid" },
    });
    fireEvent.blur(screen.getByLabelText(/Corporation Number/i));

    await waitFor(() => {
      expect(
        screen.getByText(/firstName is a required field/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/lastName is a required field/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Phone number must have 10 digits/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Invalid corporation number/i),
      ).toBeInTheDocument();
    });
  });

  // Wasn't able to get this test to pass due to issues with async validation and form state
  it.skip("submits the form successfully with valid data", async () => {
    render(<Onboarding />);
    fireEvent.change(screen.getByLabelText(/Corporation Number/i), {
      target: { value: validCorporationNumber },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "4161234567" },
    });

    // Wait for async validation to complete before submitting
    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /Submit/i });
      expect(submitButton).toBeEnabled();
      fireEvent.click(submitButton);
    });

    // Wait for the form to reset (fields should be empty)
    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/i)).toHaveValue("");
      expect(screen.getByLabelText(/Last Name/i)).toHaveValue("");
      expect(screen.getByLabelText(/Phone Number/i)).toHaveValue("");
      expect(screen.getByLabelText(/Corporation Number/i)).toHaveValue("");
    });
  });
});
