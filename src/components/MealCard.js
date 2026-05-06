'use client';

export default function MealCard({ meal, compact = false, onDelete }) {
  const typeEmoji = {
    breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪',
  };

  const scoreColor = meal.healthScore >= 75 ? '#10b981' : meal.healthScore >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`meal-card ${compact ? 'compact' : ''}`} role="article" aria-label={`${meal.name} - ${Math.round(meal.calories)} calories`}>
      <div className="meal-card-header">
        <span className="meal-card-emoji">{typeEmoji[meal.mealType] || '🍽️'}</span>
        <div className="meal-card-info">
          <h3 className="meal-card-name">{meal.name}</h3>
          <span className="meal-card-type">{meal.mealType}</span>
        </div>
        <div className="meal-card-score" style={{ color: scoreColor, borderColor: scoreColor }}>
          {Math.round(meal.healthScore)}
        </div>
      </div>
      {!compact && (
        <>
          <div className="meal-card-macros">
            <div className="meal-card-macro">
              <span className="macro-val">{Math.round(meal.calories)}</span>
              <span className="macro-label">kcal</span>
            </div>
            <div className="meal-card-macro">
              <span className="macro-val">{Math.round(meal.protein)}g</span>
              <span className="macro-label">Protein</span>
            </div>
            <div className="meal-card-macro">
              <span className="macro-val">{Math.round(meal.carbs)}g</span>
              <span className="macro-label">Carbs</span>
            </div>
            <div className="meal-card-macro">
              <span className="macro-val">{Math.round(meal.fat)}g</span>
              <span className="macro-label">Fat</span>
            </div>
          </div>
          {meal.aiSuggestions && (
            <p className="meal-card-suggestion">💡 {meal.aiSuggestions}</p>
          )}
        </>
      )}
      {onDelete && (
        <button className="meal-card-delete" onClick={() => onDelete(meal.id)} aria-label={`Delete ${meal.name}`}>×</button>
      )}
    </div>
  );
}
