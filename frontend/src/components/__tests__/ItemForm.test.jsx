import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemForm from '../ItemForm';
import { describe, test, expect, vi } from 'vitest';

describe('ItemForm Component', () => {
  const mockOnSubmit = vi.fn().mockImplementation(() => Promise.resolve());

  test('berhasil merender form', () => {
    render(<ItemForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText(/Simpan/i)).toBeInTheDocument();
  });

  test('memperbarui state saat input diubah', () => {
    render(<ItemForm onSubmit={mockOnSubmit} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Beli ATK' } });
    expect(inputs[0].value).toBe('Beli ATK');
  });

  test('memanggil onSubmit saat form dikirim', async () => {
    const { container } = render(<ItemForm onSubmit={mockOnSubmit} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Beli ATK' } });

    // Cari form dan submit langsung (cara paling aman)
    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});