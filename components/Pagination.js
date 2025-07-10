export default function Pagination({ page, total, setPage }) {
  if (total < 2) return null;
  return (
    <div className="flex justify-center gap-2 mt-8">
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
      {[...Array(total)].map((_, i) => (
        <button key={i+1} onClick={() => setPage(i+1)}
          className={`px-3 py-1 border rounded ${page===i+1 ? "bg-[#1B263B] text-white" : ""}`}>
          {i+1}
        </button>
      ))}
      <button disabled={page === total} onClick={() => setPage(p => p + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  );
}
