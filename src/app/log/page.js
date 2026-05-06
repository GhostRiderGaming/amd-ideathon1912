'use client';
import { useState } from 'react';
import FoodScanner from '@/components/FoodScanner';
import MealCard from '@/components/MealCard';
import { useRouter } from 'next/navigation';

export default function LogMeal() {
  const [mode, setMode] = useState('choose');
  const [textInput, setTextInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const getUserId = () => localStorage.getItem('nourishai_userId') || 'default-user';

  const handlePhotoResult = async (base64, mimeType) => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: getUserId(), imageBase64: base64, mimeType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.meal || data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    }
    setAnalyzing(false);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: getUserId(), description: textInput }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    }
    setAnalyzing(false);
  };

  if (result) {
    return (
      <main className="page log-page">
        <h1 className="page-title">✅ Meal Logged!</h1>
        <MealCard meal={result} />
        <div className="log-actions">
          <button className="btn btn-primary" onClick={() => router.push('/')}>Back to Dashboard</button>
          <button className="btn btn-ghost" onClick={() => { setResult(null); setMode('choose'); setTextInput(''); }}>Log Another</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page log-page">
      <h1 className="page-title">Log a Meal</h1>
      <p className="page-subtitle">Snap a photo or describe what you ate</p>

      {mode === 'choose' && (
        <div className="log-mode-selector">
          <button className="mode-card" onClick={() => setMode('photo')}>
            <span className="mode-icon">📸</span>
            <span className="mode-title">Photo Scan</span>
            <span className="mode-desc">AI analyzes your food photo</span>
          </button>
          <button className="mode-card" onClick={() => setMode('text')}>
            <span className="mode-icon">✏️</span>
            <span className="mode-title">Text Input</span>
            <span className="mode-desc">Describe what you ate</span>
          </button>
        </div>
      )}

      {mode === 'photo' && (
        <div className="log-content">
          <FoodScanner onResult={handlePhotoResult} loading={analyzing} />
          <button className="btn btn-ghost" onClick={() => setMode('choose')}>← Back</button>
        </div>
      )}

      {mode === 'text' && (
        <div className="log-content">
          <form onSubmit={handleTextSubmit} className="text-log-form">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="E.g., 2 eggs, toast with butter, and a glass of orange juice"
              className="text-log-input"
              rows={4}
              disabled={analyzing}
              aria-label="Describe your meal"
              id="meal-description"
            />
            <button type="submit" className="btn btn-primary btn-full" disabled={!textInput.trim() || analyzing}>
              {analyzing ? 'Analyzing with AI...' : '🔍 Analyze Meal'}
            </button>
          </form>
          <button className="btn btn-ghost" onClick={() => setMode('choose')}>← Back</button>
        </div>
      )}

      {error && <div className="error-banner" role="alert">{error}</div>}
    </main>
  );
}
