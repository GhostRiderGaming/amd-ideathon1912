'use client';
import { useState, useEffect } from 'react';
import MealCard from '@/components/MealCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function History() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    const userId = localStorage.getItem('nourishai_userId') || 'default-user';
    try {
      const res = await fetch(`/api/meals?userId=${userId}`);
      const data = await res.json();
      setMeals(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (mealId) => {
    try {
      await fetch(`/api/meals/${mealId}`, { method: 'DELETE' });
      setMeals(prev => prev.filter(m => m.id !== mealId));
    } catch {}
  };

  const groupByDate = (meals) => {
    const groups = {};
    meals.forEach(meal => {
      const date = new Date(meal.loggedAt).toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric',
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(meal);
    });
    return groups;
  };

  const grouped = groupByDate(meals);

  return (
    <main className="page history-page">
      <h1 className="page-title">Meal History</h1>
      <p className="page-subtitle">{meals.length} meals logged</p>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : meals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>No meals logged yet</p>
          <a href="/log" className="btn btn-primary">Log Your First Meal</a>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dateMeals]) => (
          <div key={date} className="history-group">
            <h3 className="history-date">{date}</h3>
            <div className="meals-list">
              {dateMeals.map(meal => (
                <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
              ))}
            </div>
            <div className="history-day-summary">
              <span>Total: {Math.round(dateMeals.reduce((s, m) => s + m.calories, 0))} kcal</span>
              <span>P: {Math.round(dateMeals.reduce((s, m) => s + m.protein, 0))}g</span>
              <span>C: {Math.round(dateMeals.reduce((s, m) => s + m.carbs, 0))}g</span>
              <span>F: {Math.round(dateMeals.reduce((s, m) => s + m.fat, 0))}g</span>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
