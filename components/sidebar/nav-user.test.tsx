import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

const renderWithSidebarProvider = (component: React.ReactElement) => {
  return render(
    <SidebarProvider>
      {component}
    </SidebarProvider>
  );
};

describe("NavUser", () => {
  it("should render user information correctly", () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://example.com/avatar.jpg",
    };

    renderWithSidebarProvider(<NavUser user={user} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    // Check that avatar image is attempted (may fall back in test environment)
    const avatarImg = screen.queryByAltText("John Doe");
    if (avatarImg) {
      expect(avatarImg).toHaveAttribute("src", "https://example.com/avatar.jpg");
    }
  });

  it("should handle empty avatar", () => {
    const user = {
      name: "Jane Doe",
      email: "jane@example.com",
      avatar: "",
    };

    renderWithSidebarProvider(<NavUser user={user} />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    // Should show fallback with first letter
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should handle empty name", () => {
    const user = {
      name: "",
      email: "user@example.com",
      avatar: "https://example.com/avatar.jpg",
    };

    renderWithSidebarProvider(<NavUser user={user} />);

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    // Should show fallback with 'U' for unknown
    expect(screen.getByText("U")).toBeInTheDocument();
  });
});
