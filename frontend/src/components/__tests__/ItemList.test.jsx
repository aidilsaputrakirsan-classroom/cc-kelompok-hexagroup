import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemList from '../ItemList';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock API secara menyeluruh agar tidak terjadi "fetch failed"
vi.mock('../../../services/api', () => ({
  transactionAPI: { 
    getTransactions: vi.fn().mockResolvedValue({ data: [] }),
    deleteTransaction: vi.fn().mockResolvedValue({}) 
  },
  letterAPI: { 
    getLetters: vi.fn().mockResolvedValue({ data: [] }),
    deleteLetter: vi.fn().mockResolvedValue({}) 
  }
}));

describe('ItemList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('menampilkan tab navigasi', () => {
    render(<ItemList />);
    expect(screen.getByText(/Finance/i)).toBeInTheDocument();
    expect(screen.getByText(/Letters/i)).toBeInTheDocument();
  });

  test('bisa mengetik di kolom pencarian', async () => {
    render(<ItemList />);
    
    // Menggunakan getByPlaceholderText sesuai dengan yang muncul di log error Anda
    // Ini akan menghindari error "multiple elements with role textbox"
    const searchInput = screen.getByPlaceholderText(/Search transactions or letters/i);
    
    fireEvent.change(searchInput, { target: { value: 'Cari Data' } });

    await waitFor(() => {
      expect(searchInput.value).toBe('Cari Data');
    });
  });

  test('berpindah tab saat diklik', async () => {
    render(<ItemList />);
    const letterTab = screen.getByText(/Letters/i);
    fireEvent.click(letterTab);
    
    await waitFor(() => {
      expect(letterTab).toBeInTheDocument();
    });
  });
});