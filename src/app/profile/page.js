'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '', age: '', weightKg: '', heightCm: '',
    activityLevel: 'moderate', goal: 'maintain',
    dietaryRestrictions: [], allergies: '',
    dailyCalorieTarget: 2000, dailyProteinTarget: 50,
    dailyCarbTarget: 250, dailyFatTarget: 65,
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const userId = localStorage.getItem('nourishai_userId') || 'default-user';
    try {
      const res = await fetch(`/api/user?userId=${userId}`);
      if (res.ok) {
        const user = await res.json();
        setForm({
          name: user.name || '',
          age: user.age || '',
          weightKg: user.weightKg || '',
          heightCm: user.heightCm || '',
          activityLevel: user.activityLevel || 'moderate',
          goal: user.goal || 'maintain',
          dietaryRestrictions: JSON.parse(user.dietaryRestrictions || '[]'),
          allergies: JSON.parse(user.allergies || '[]').join(', '),
          dailyCalorieTarget: user.dailyCalorieTarget || 2000,
          dailyProteinTarget: user.dailyProteinTarget || 50,
          dailyCarbTarget: user.dailyCarbTarget || 250,
          dailyFatTarget: user.dailyFatTarget || 65,
        });
      }
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const userId = localStorage.getItem('nourishai_userId') || 'default-user';
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          name: form.name,
          age: Number(form.age) || null,
          weightKg: Number(form.weightKg) || null,
          heightCm: Number(form.heightCm) || null,
          activityLevel: form.activityLevel,
          goal: form.goal,
          dietaryRestrictions: JSON.stringify(form.dietaryRestrictions),
          allergies: JSON.stringify(form.allergies.split(',').map(a => a.trim()).filter(Boolean)),
          dailyCalorieTarget: Number(form.dailyCalorieTarget) || 2000,
          dailyProteinTarget: Number(form.dailyProteinTarget) || 50,
          dailyCarbTarget: Number(form.dailyCarbTarget) || 250,
          dailyFatTarget: Number(form.dailyFatTarget) || 65,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const restrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Halal', 'Kosher', 'Nut-Free'];
  const toggleRestriction = (r) => {
    setForm(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(r)
        ? prev.dietaryRestrictions.filter(x => x !== r)
        : [...prev.dietaryRestrictions, r],
    }));
  };

  return (
    <main className="page profile-page">
      <h1 className="page-title">Profile & Goals</h1>
      <p className="page-subtitle">Personalize your nutrition plan</p>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3 className="form-section-title">Personal Info</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
            </div>
            <div className="form-field">
              <label htmlFor="age">Age</label>
              <input id="age" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="25" />
            </div>
            <div className="form-field">
              <label htmlFor="weight">Weight (kg)</label>
              <input id="weight" type="number" value={form.weightKg} onChange={e => setForm({...form, weightKg: e.target.value})} placeholder="70" step="0.1" />
            </div>
            <div className="form-field">
              <label htmlFor="height">Height (cm)</label>
              <input id="height" type="number" value={form.heightCm} onChange={e => setForm({...form, heightCm: e.target.value})} placeholder="170" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Goal</h3>
          <div className="goal-selector">
            {['lose', 'maintain', 'gain'].map(g => (
              <button type="button" key={g} className={`goal-btn ${form.goal === g ? 'active' : ''}`} onClick={() => setForm({...form, goal: g})}>
                <span className="goal-emoji">{g === 'lose' ? '📉' : g === 'maintain' ? '⚖️' : '💪'}</span>
                <span className="goal-label">{g === 'lose' ? 'Lose Weight' : g === 'maintain' ? 'Maintain' : 'Gain Muscle'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Activity Level</h3>
          <select id="activity" value={form.activityLevel} onChange={e => setForm({...form, activityLevel: e.target.value})} className="form-select" aria-label="Activity level">
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
            <option value="athlete">Athlete</option>
          </select>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Dietary Restrictions</h3>
          <div className="restriction-chips">
            {restrictions.map(r => (
              <button type="button" key={r} className={`chip ${form.dietaryRestrictions.includes(r) ? 'active' : ''}`} onClick={() => toggleRestriction(r)}>{r}</button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Allergies</h3>
          <input id="allergies" type="text" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} placeholder="e.g., peanuts, shellfish" className="form-input-full" />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Daily Targets</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="cal-target">Calories</label>
              <input id="cal-target" type="number" value={form.dailyCalorieTarget} onChange={e => setForm({...form, dailyCalorieTarget: e.target.value})} />
            </div>
            <div className="form-field">
              <label htmlFor="protein-target">Protein (g)</label>
              <input id="protein-target" type="number" value={form.dailyProteinTarget} onChange={e => setForm({...form, dailyProteinTarget: e.target.value})} />
            </div>
            <div className="form-field">
              <label htmlFor="carb-target">Carbs (g)</label>
              <input id="carb-target" type="number" value={form.dailyCarbTarget} onChange={e => setForm({...form, dailyCarbTarget: e.target.value})} />
            </div>
            <div className="form-field">
              <label htmlFor="fat-target">Fat (g)</label>
              <input id="fat-target" type="number" value={form.dailyFatTarget} onChange={e => setForm({...form, dailyFatTarget: e.target.value})} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Profile'}
        </button>
      </form>
    </main>
  );
}
