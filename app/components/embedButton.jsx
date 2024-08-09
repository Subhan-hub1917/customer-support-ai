import { useState } from 'react';
export default function GenerateEmbeddingsButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trigger: true }), // You can send additional data if needed
      });

      if (response.ok) {
        setMessage('Embeddings generated and stored successfully!');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Embeddings'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
