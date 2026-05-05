import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemCard from '../ItemCard'

// ================= MOCK DATA =================
const mockTransaction = {
  id: 1,
  description: 'Pemasukan kas',
  amount: 100000,
  type: 'income',
  category: 'Kas',
  created_at: '2024-01-01'
}

const mockLetter = {
  id: 2,
  title: 'Surat Undangan',
  content: 'Isi surat panjang banget untuk testing komponen item card...',
  status: 'draft',
  letter_type: 'Resmi',
  date: '2024-01-01'
}

const userAdmin = {
  role: 'ketua'
}

const userAnggota = {
  role: 'anggota'
}

// ================= TEST =================
describe('ItemCard Component', () => {

  // ================= RENDER =================
  it('menampilkan deskripsi transaksi', () => {
    render(
      <ItemCard
        item={mockTransaction}
        type="transaction"
        user={userAdmin}
        onDelete={() => {}}
      />
    )

    expect(screen.getByText(/pemasukan kas/i)).toBeInTheDocument()
  })

  it('menampilkan title untuk letter', () => {
    render(
      <ItemCard
        item={mockLetter}
        type="letter"
        user={userAdmin}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    )

    expect(screen.getByText(/surat undangan/i)).toBeInTheDocument()
  })

  // ================= ROLE ACCESS =================
  it('menampilkan tombol delete jika user bukan anggota', () => {
    render(
      <ItemCard
        item={mockTransaction}
        type="transaction"
        user={userAdmin}
        onDelete={() => {}}
      />
    )

    expect(screen.getByText(/delete/i)).toBeInTheDocument()
  })

  it('tidak menampilkan tombol aksi jika user anggota', () => {
    render(
      <ItemCard
        item={mockTransaction}
        type="transaction"
        user={userAnggota}
        onDelete={() => {}}
      />
    )

    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument()
  })

  // ================= DELETE =================
  it('memanggil onDelete saat tombol delete diklik', () => {
    const handleDelete = vi.fn()

    render(
      <ItemCard
        item={mockTransaction}
        type="transaction"
        user={userAdmin}
        onDelete={handleDelete}
      />
    )

    fireEvent.click(screen.getByText(/delete/i))

    expect(handleDelete).toHaveBeenCalledWith(mockTransaction.id)
  })

  // ================= UPDATE (KHUSUS LETTER DRAFT) =================
  it('menampilkan tombol edit untuk letter draft', () => {
    render(
      <ItemCard
        item={mockLetter}
        type="letter"
        user={userAdmin}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    )

    expect(screen.getByText(/edit/i)).toBeInTheDocument()
  })

  it('memanggil onUpdate saat tombol edit diklik', () => {
    const handleUpdate = vi.fn()

    render(
      <ItemCard
        item={mockLetter}
        type="letter"
        user={userAdmin}
        onDelete={() => {}}
        onUpdate={handleUpdate}
      />
    )

    fireEvent.click(screen.getByText(/edit/i))

    expect(handleUpdate).toHaveBeenCalledWith(mockLetter.id)
  })

})