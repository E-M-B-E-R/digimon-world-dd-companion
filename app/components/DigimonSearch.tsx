'use client';

import { useState, useEffect, useRef } from 'react';
import { DIGIMON } from '@clokken/digimon-dawn-dusk-data';
import type { Digimon } from '@clokken/digimon-dawn-dusk-data';
import styles from './DigimonSearch.module.css';

interface DigimonSearchProps {
  onSelect: (digimonName: string) => void;
}

const STAGE_ORDER = ['In-Training', 'Rookie', 'Champion', 'Ultimate', 'Mega'];

export default function DigimonSearch({ onSelect }: DigimonSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredDigimon, setFilteredDigimon] = useState<Digimon[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [pinnedDigimon, setPinnedDigimon] = useState<Set<string>>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pinnedDigimon');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return new Set(parsed);
        } catch (e) {
          console.error('Failed to load pinned Digimon', e);
        }
      }
    }
    return new Set();
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Save pinned Digimon to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinnedDigimon', JSON.stringify(Array.from(pinnedDigimon)));
    }
  }, [pinnedDigimon]);

  const togglePin = (digimonName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedDigimon(prev => {
      const newSet = new Set(prev);
      if (newSet.has(digimonName)) {
        newSet.delete(digimonName);
      } else {
        newSet.add(digimonName);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = DIGIMON.filter((d) =>
        d.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      ).sort((a, b) => {
        // Pinned items come first
        const aPinned = pinnedDigimon.has(a.fullName);
        const bPinned = pinnedDigimon.has(b.fullName);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        
        // Then sort by stage and name
        const stageCompare = STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage);
        if (stageCompare !== 0) return stageCompare;
        return a.fullName.localeCompare(b.fullName);
      });
      setFilteredDigimon(filtered);
    } else {
      const sorted = [...DIGIMON].sort((a, b) => {
        // Pinned items come first
        const aPinned = pinnedDigimon.has(a.fullName);
        const bPinned = pinnedDigimon.has(b.fullName);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        
        // Then sort by stage and name
        const stageCompare = STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage);
        if (stageCompare !== 0) return stageCompare;
        return a.fullName.localeCompare(b.fullName);
      });
      setFilteredDigimon(sorted);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, pinnedDigimon]);

  const handleSelect = (digimon: Digimon) => {
    setSearchTerm(digimon.fullName);
    setIsOpen(false);
    onSelect(digimon.fullName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredDigimon.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredDigimon.length) {
          handleSelect(filteredDigimon[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const groupedDigimon = filteredDigimon.reduce((acc, digimon) => {
    if (!acc[digimon.stage]) {
      acc[digimon.stage] = [];
    }
    acc[digimon.stage].push(digimon);
    return acc;
  }, {} as Record<string, Digimon[]>);

  // Separate pinned and unpinned Digimon
  const pinnedList = filteredDigimon.filter(d => pinnedDigimon.has(d.fullName));
  const unpinnedGrouped = STAGE_ORDER.reduce((acc, stage) => {
    if (groupedDigimon[stage]) {
      acc[stage] = groupedDigimon[stage].filter(d => !pinnedDigimon.has(d.fullName));
    }
    return acc;
  }, {} as Record<string, Digimon[]>);

  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search for a Digimon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.dropdownButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle dropdown"
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {/* Pinned Section */}
          {pinnedList.length > 0 && (
            <div className={styles.stageGroup}>
              <div className={`${styles.stageHeader} ${styles.pinnedHeader}`}>📌 Pinned</div>
              {pinnedList.map((digimon) => {
                const globalIndex = filteredDigimon.indexOf(digimon);
                const isPinned = true;
                return (
                  <div
                    key={digimon.id}
                    data-index={globalIndex}
                    className={`${styles.dropdownItem} ${
                      globalIndex === highlightedIndex ? styles.highlighted : ''
                    } ${styles.pinned}`}
                    onClick={() => handleSelect(digimon)}
                    onMouseEnter={() => setHighlightedIndex(globalIndex)}
                  >
                    <span className={styles.digimonName}>{digimon.fullName}</span>
                    <button
                      className={`${styles.pinButton} ${styles.pinned}`}
                      onClick={(e) => togglePin(digimon.fullName, e)}
                      aria-label="Unpin"
                      title="Unpin this Digimon"
                    >
                      📌
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stage Groups */}
          {STAGE_ORDER.map((stage) => {
            const digimonInStage = unpinnedGrouped[stage];
            if (!digimonInStage || digimonInStage.length === 0) return null;

            return (
              <div key={stage} className={styles.stageGroup}>
                <div className={styles.stageHeader}>{stage}</div>
                {digimonInStage.map((digimon) => {
                  const globalIndex = filteredDigimon.indexOf(digimon);
                  const isPinned = false;
                  return (
                    <div
                      key={digimon.id}
                      data-index={globalIndex}
                      className={`${styles.dropdownItem} ${
                        globalIndex === highlightedIndex ? styles.highlighted : ''
                      }`}
                      onClick={() => handleSelect(digimon)}
                      onMouseEnter={() => setHighlightedIndex(globalIndex)}
                    >
                      <span className={styles.digimonName}>{digimon.fullName}</span>
                      <button
                        className={styles.pinButton}
                        onClick={(e) => togglePin(digimon.fullName, e)}
                        aria-label="Pin"
                        title="Pin this Digimon"
                      >
                        📍
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {filteredDigimon.length === 0 && (
            <div className={styles.noResults}>No Digimon found</div>
          )}
        </div>
      )}
    </div>
  );
}
