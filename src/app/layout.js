import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'NourishAI — AI Food Intelligence',
  description: 'Make smarter food choices with AI-powered nutrition analysis, personalized meal recommendations, and an intelligent nutritionist chatbot. Built with Google Gemini.',
  keywords: 'nutrition, AI, food analysis, meal tracking, health, diet, Gemini',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#050508" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥗</text></svg>" />
      </head>
      <body>
        <div className="app-layout">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
