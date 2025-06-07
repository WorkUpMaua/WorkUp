// src/components/Commodities.tsx
import React, { useEffect, useRef, useState } from 'react';

const SUGGESTIONS = [
  "Wi-Fi", "Ar Condicionado", "Cozinha", "Estacionamento", "Cafeteria",
  "Sala de Reuniões", "Projetor", "Lousa", "Varanda", "Limpeza Diária"
];

interface CommoditiesProps {
  selectedQualities: string[];
  setQualities: (quals: string[]) => void;
}

export default function Commodities({
  selectedQualities,
  setQualities
}: CommoditiesProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addQualidade = (valor: string) => {
    const valorFormatado = valor.trim();
    if (
      SUGGESTIONS.includes(valorFormatado) &&
      !selectedQualities.includes(valorFormatado)
    ) {
      setQualities([...selectedQualities, valorFormatado]);
      setInput('');
    }
  };

  const removeQualidade = (valor: string) => {
    setQualities(selectedQualities.filter(q => q !== valor));
  };

  const filteredSuggestions = SUGGESTIONS.filter(
    q =>
      q.toLowerCase().includes(input.toLowerCase()) &&
      !selectedQualities.includes(q)
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addQualidade(input);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ position: 'static' }}>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
        placeholder="Comodidades (ex: Wi-Fi, Ar Condicionado...)"
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="fixed z-[9999] w-[calc(100%-2rem)] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto" style={{
          left: containerRef.current?.getBoundingClientRect().left + 'px',
          top: (containerRef.current?.getBoundingClientRect().bottom || 0) + 8 + 'px',
          width: (containerRef.current?.offsetWidth || 0) + 'px'
        }}>
          {filteredSuggestions.map((sugestao, i) => (
            <li
              key={i}
              onClick={() => {
                addQualidade(sugestao);
                setShowSuggestions(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-text-dark"
            >
              {sugestao}
            </li>
          ))}
        </ul>
      )}

      {selectedQualities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedQualities.map((q, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
            >
              {q}
              <button
                type="button"
                onClick={() => removeQualidade(q)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
);
}
