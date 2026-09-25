import React, { useState } from 'react';
import { X, Sparkles, Send, ChefHat, MessageSquare, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export default function ChefAssistantModal({ recipe, isOpen, onClose }) {
  const [question, setQuestion] = useState('');
  const greeting = recipe?.title
    ? `Hello! I'm your AI Executive Chef. How can I help you cook "${recipe.title}"? Ask me about substitutions, timing, sauce consistency, or flavor tweaks!`
    : `Hello! I'm your AI Executive Chef. Ask me anything — what to cook with your ingredients, substitutions, techniques, or meal ideas!`;
  const [messages, setMessages] = useState([{ sender: 'chef', text: greeting }]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQ = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { sender: 'user', text: userQ }]);
    setIsLoading(true);

    try {
      const data = await api.post('/api/recipes/chef-assistant', { question: userQ, recipeContext: recipe }, { auth: false });
      if (data.success) {
        setMessages(prev => [...prev, { sender: 'chef', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { sender: 'chef', text: 'Sorry, I could not process that right now. Try another question!' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'chef', text: 'Culinary network hiccup. Please ask again!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'What can I substitute for heavy cream?',
    'How do I ensure the salmon skin is extra crispy?',
    'Can I make this dairy-free?',
    'Can I store leftovers in the freezer?'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card chef-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChefHat size={22} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>Chef's Culinary Assistant</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Powered by Google Gemini</span>
          </div>
        </div>

        {/* Message stream */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 6, marginBottom: 14 }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? 'var(--color-primary)' : '#F5EFE7',
                color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                padding: '12px 16px',
                borderRadius: 18,
                fontSize: '0.92rem',
                lineHeight: 1.5
              }}
            >
              {m.text}
            </div>
          ))}

          {isLoading && (
            <div style={{ alignSelf: 'flex-start', background: '#F5EFE7', padding: '10px 16px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              Chef is thinking...
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuestion(q)}
              style={{
                background: '#FAF6F0',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAsk} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask chef about substitutions or tips..."
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !question.trim() || isLoading ? 0.6 : 1
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
