import { useState } from "react";

export function useplantpredict() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function predict(file) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/predict", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Failed to Predict");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { predict, result, loading, error };
}
