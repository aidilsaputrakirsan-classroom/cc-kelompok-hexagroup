import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import { describe, test, expect, vi } from 'vitest';

describe('SearchBar Component', () => {
  test('berhasil menampilkan input', () => {
    render(<SearchBar onSearch={() => {}} />);
    // Mencari elemen textbox (input) apapun yang ada di komponen
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('bisa menerima input teks dari user', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Gaji Bulanan' } });
    expect(input.value).toBe('Gaji Bulanan');
  });

  test('memanggil fungsi onSearch saat user mengetik', () => {
    const onSearchMock = vi.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Beli' } });
    expect(onSearchMock).toHaveBeenCalled();
  });

  test('memiliki styling container', () => {
    const { container } = render(<SearchBar onSearch={() => {}} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});