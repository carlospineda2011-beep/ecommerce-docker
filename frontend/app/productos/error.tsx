"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6">
      <p className="text-red-600">Error: {error.message}</p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-black text-white rounded">
        Reintentar
      </button>
    </div>
  );
}