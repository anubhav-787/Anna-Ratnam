'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function fetchReceipts(q = '') {
    setLoading(true)
    const res = await fetch(`/api/receipts?q=${q}`)
    const data = await res.json()
    setReceipts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchReceipts()
  }, [])

  async function handleDelete(id) {
    setDeletingId(id)
    await fetch('/api/receipts', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    setReceipts((prev) => prev.filter((r) => r.id !== id))
    setDeletingId(null)
  }

  function handleSearch(e) {
    e.preventDefault()
    fetchReceipts(query)
  }

  return (
    <div className="bg-gray-900 min-h-screen w-full">
      {/* Navbar */}
      <div className="pt-0 h-[10vh] w-full text-white bg-gray-500 flex items-center justify-around">
        <span className="text-[#D60082] text-3xl font-bold">Receipt.AI</span>
        <Link href="/Reciptscanner">
          <button className="bg-green-700 rounded-2xl font-bold p-2 text-white hover:bg-emerald-400">
            Receipt-scanner
          </button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="py-2.5 flex justify-end w-full px-3">   
        <h3 className="font-bold text-white px-7.5 py-1.5">Search Receipts</h3>
        <input
          className="bg-gray-500 text-white placeholder:text-gray-300 py-1 px-2"
          type="text"
          placeholder="shop-name, Date, Category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="ml-2 bg-blue-600 hover:bg-blue-400 text-white px-3 py-1 rounded-lg">
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto"><table className="mt-6 border w-full text-white ">
        <thead>
          <tr className="border">
            <th className="border p-2">Merchant</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={7} className="text-center p-4 text-gray-400">Loading...</td></tr>
          )}
          {!loading && receipts.map((r) => (
            <tr key={r.id} className="border text-center">
              <td className="border p-2">{r.merchant ?? '—'}</td>
              <td className="border p-2">{new Date(r.date).toLocaleDateString()}</td>
              <td className="border p-2">{r.description ?? '—'}</td>
              <td className="border p-2">{r.category ?? '—'}</td>
              <td className="border p-2">₹{r.amount.toFixed(2)}</td>
              <td className="border p-2">
                {r.imageUrl
                  ? <a href={r.imageUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">View</a>
                  : '—'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  className="bg-red-600 hover:bg-red-400 disabled:bg-red-900 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg text-sm"
                >
                  {deletingId === r.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
          {!loading && receipts.length === 0 && (
            <tr><td colSpan={7} className="text-center p-4 text-gray-400">No receipts found</td></tr>
          )}
        </tbody>
      </table></div>
    </div>
  )
}
