'use client';
import { useState, useEffect, useCallback } from 'react';
import HealthScoreRing from '@/components/HealthScoreRing';
import MacroRing from '@/components/MacroRing';
import MealCard from '@/components/MealCard';
import StreakCounter from '@/components/StreakCounter';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Link from 'next/link';

const DEFAULT_USER_ID = 'default-user';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('nourishai_userId');
    if (stored) {
      setUserId(stored);
    } else {
      initUser();
    }
  }, []);

  const initUser = async () => {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: DEFAULT_USER_ID, name: 'User' }),
      });
      const user = await res.json();
      localStorage.setItem('nourishai_userId', user.id);
      setUserId(user.id);
    } catch {
      setUserId(DEFAULT_USER_ID);
    }
  };

  const loadDashboard = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?userId=${userId}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) loadDashboard();
  }, [userId, loadDashboard]);

  if (loading) {
    return (
      <main className="page dashboard-page">
        <div className="dashboard-header">
          <h1 className="page-title">NourishAI</h1>
          <p className="page-subtitle">Your AI Food Intelligence</p>
        </div>
        <div className="dashboard-score-section">
          <LoadingSkeleton type="ring" />
        </div>
        <LoadingSkeleton type="card" count={3} />
      </main>
    );
  }

  const totals = data?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const targets = data?.targets || { calories: 2000, protein: 50, carbs: 250, fat: 65 };

  return (
    <main className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">NourishAI</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <StreakCounter count={data?.streak || 0} />
      </div>

      <div className="dashboard-score-section">
        <HealthScoreRing score={data?.healthScore || 0} size={160} />
      </div>

      <div className="macro-rings-row">
        <MacroRing current={totals.calories} target={targets.calories} color="#10b981" label="Calories" unit="kcal" />
        <MacroRing current={totals.protein} target={targets.protein} color="#3b82f6" label="Protein" />
        <MacroRing current={totals.carbs} target={targets.carbs} color="#f59e0b" label="Carbs" />
        <MacroRing current={totals.fat} target={targets.fat} color="#ef4444" label="Fat" />
      </div>

      {data?.insight && (
        <div className="insight-card" role="status" aria-label="AI Insight">
          <span className="insight-icon">✨</span>
          <p className="insight-text">{data.insight}</p>
        </div>
      )}

      <div className="section-header">
        <h2>Today&apos;s Meals</h2>
        <Link href="/log" className="section-action">+ Log Meal</Link>
      </div>

      {data?.todayMeals?.length > 0 ? (
        <div className="meals-list">
          {data.todayMeals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <p>No meals logged today</p>
          <Link href="/log" className="btn btn-primary">Log Your First Meal</Link>
        </div>
      )}

      <Link href="/log" className="fab" aria-label="Log a meal">
        <span>+</span>
      </Link>
    </main>
  );
}
