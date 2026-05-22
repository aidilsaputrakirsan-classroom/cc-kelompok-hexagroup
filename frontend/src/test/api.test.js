import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  authAPI,
  financeAPI,
  letterAPI,
  userAPI,
  checkAPIConnection,
} from "../services/api";

// mock fetch
global.fetch = vi.fn();

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {});
  });

  it("checkAPIConnection return true jika API aktif", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const result = await checkAPIConnection();

    expect(fetch).toHaveBeenCalledWith(
  expect.stringContaining("/health")
);
    expect(result).toBe(true);
  });

  it("checkAPIConnection return false jika API gagal", async () => {
    fetch.mockRejectedValueOnce(new Error("API down"));

    const result = await checkAPIConnection();

    expect(result).toBe(false);
  });

  it("login memanggil endpoint yang benar", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "123" }),
    });

    await authAPI.login("test@mail.com", "123456");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("getTransactions memanggil endpoint finance", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const data = await financeAPI.getTransactions();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/finance/transactions"),
      expect.any(Object),
    );
    expect(data.items).toEqual([]);
  });

  it("deleteTransaction memanggil endpoint delete", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await financeAPI.deleteTransaction(1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/finance/transactions/1"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("getLetters memanggil endpoint letters", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const data = await letterAPI.getLetters();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/letters"),
      expect.any(Object),
    );
    expect(data.items).toEqual([]);
  });

  it("createLetter mengirim data dengan benar", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await letterAPI.createLetter("Judul", "Resmi", "Isi surat");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/letters"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("getAllUsers memanggil endpoint users", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ users: [] }),
    });

    const data = await userAPI.getAllUsers();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users"),
      expect.any(Object),
    );
    expect(data.users).toEqual([]);
  });

  it("throw error jika response tidak ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: "Bad Request" }),
    });

    await expect(authAPI.getMe()).rejects.toThrow("Bad Request");
  });
});
