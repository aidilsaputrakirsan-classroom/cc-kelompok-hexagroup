import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header";

/* ================= 1. MOCK CONTEXT (DIPERBAIKI) ================= */
// Kita mock langsung path useTheme agar tidak undefined saat dipanggil DarkModeToggle
vi.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({
    darkMode: false,
    toggleDarkMode: vi.fn(),
  }),
}));

/* ================= 2. MOCK ROUTER (DIPERBAIKI) ================= */
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/dashboard" }),
  };
});

/* ================= 3. HELPER RENDER ================= */
const renderHeader = (user = null, setUser = vi.fn()) => {
  return render(
    <BrowserRouter>
      <Header
        user={user}
        setUser={setUser}
        darkMode={false}
        setDarkMode={vi.fn()}
      />
    </BrowserRouter>
  );
};

/* ================= 4. TEST SUITE ================= */
describe("Header Component", () => {
  const userKetua = {
    full_name: "Test User",
    role: "ketua",
  };

  const userAnggota = {
    full_name: "Test User",
    role: "anggota",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Bersihkan localStorage setiap sebelum tes
    localStorage.clear();
  });

  it("menampilkan logo SIKASI", () => {
    renderHeader(userKetua);
    expect(screen.getByText("SIKASI")).toBeInTheDocument();
  });

  it("menampilkan nama dan role user", () => {
    renderHeader(userKetua);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/ketua/i)).toBeInTheDocument();
  });

  it("menampilkan menu ketika user login", () => {
    renderHeader(userKetua);
    expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /finance/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /letters/i })).toBeInTheDocument();
  });

  it("tidak menampilkan menu jika user null", () => {
    renderHeader(null);
    expect(screen.queryByRole("button", { name: /dashboard/i })).not.toBeInTheDocument();
  });

  it("ketua bisa melihat admin", () => {
    renderHeader(userKetua);
    expect(screen.getByRole("button", { name: /admin/i })).toBeInTheDocument();
  });

  it("anggota tidak bisa melihat admin", () => {
    renderHeader(userAnggota);
    expect(screen.queryByRole("button", { name: /admin/i })).not.toBeInTheDocument();
  });

  it("navigasi ke finance", () => {
    renderHeader(userKetua);
    fireEvent.click(screen.getByRole("button", { name: /finance/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/finance");
  });

  it("navigasi ke dashboard lewat logo", () => {
    renderHeader(userKetua);
    fireEvent.click(screen.getByText("SIKASI"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("menampilkan modal logout", () => {
    renderHeader(userKetua);
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(
      screen.getByText(/apakah anda yakin ingin logout/i)
    ).toBeInTheDocument();
  });

  it("logout berhasil", () => {
    const mockSetUser = vi.fn();
    const clearSpy = vi.spyOn(Storage.prototype, "clear");

    renderHeader(userKetua, mockSetUser);

    // 1. Klik tombol logout di Header untuk buka modal
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    
    // 2. Klik tombol konfirmasi logout di dalam Modal
    const confirmBtn = screen.getByText(/✓ Logout/i);
    fireEvent.click(confirmBtn);

    expect(clearSpy).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});