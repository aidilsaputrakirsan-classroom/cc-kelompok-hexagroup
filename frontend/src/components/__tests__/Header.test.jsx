import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header";

// ================= MOCK ROUTER =================
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/dashboard" }),
  };
});

// ================= HELPER =================
const renderHeader = (user = null, setUser = vi.fn()) => {
  return render(
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
    </BrowserRouter>,
  );
};

// ================= TEST =================
describe("Header Component", () => {
  const userKetua = {
    full_name: "Test User",
    role: "ketua",
  };

  const userNonKetua = {
    full_name: "Test User",
    role: "anggota",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ================= BASIC =================
  it("menampilkan logo SIKASI", () => {
    renderHeader(userKetua);
    expect(screen.getByText(/sikasi/i)).toBeInTheDocument();
  });

  it("menampilkan nama dan role user", () => {
    renderHeader(userKetua);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/ketua/i)).toBeInTheDocument();
  });

  // ================= CONDITIONAL =================
  it("menampilkan menu ketika user ada", () => {
    renderHeader(userKetua);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it("tidak menampilkan menu ketika user null", () => {
    renderHeader(null);
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
  });

  // ================= ROLE =================
  it("role ketua bisa melihat menu admin", () => {
    renderHeader(userKetua);
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it("role selain ketua tidak bisa melihat menu admin", () => {
    renderHeader(userNonKetua);
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
  });

  // ================= LOGOUT =================
  it("menampilkan modal saat klik logout", () => {
    renderHeader(userKetua);

    fireEvent.click(screen.getByText(/logout/i));

    expect(
      screen.getByText(/apakah anda yakin ingin logout/i),
    ).toBeInTheDocument();
  });

  it("logout menghapus session dan redirect ke login", () => {
    const mockSetUser = vi.fn();

    // ✅ FIX: spy localStorage
    const clearSpy = vi.spyOn(Storage.prototype, "clear");

    renderHeader(userKetua, mockSetUser);

    // buka modal
    fireEvent.click(screen.getByText(/logout/i));

    // klik tombol konfirmasi (yang ada "✓ Logout")
    fireEvent.click(screen.getByText(/✓ logout/i));

    expect(clearSpy).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  // ================= NAVIGATION =================
  it("navigasi ke finance saat tombol diklik", () => {
    renderHeader(userKetua);

    fireEvent.click(screen.getByText(/finance/i));

    expect(mockNavigate).toHaveBeenCalledWith("/finance");
  });
});
