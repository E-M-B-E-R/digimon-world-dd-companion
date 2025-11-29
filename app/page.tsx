'use client';

import { useState } from 'react';
import DigimonSearch from './components/DigimonSearch';
import EvolutionTree from './components/EvolutionTree';
import styles from './page.module.css';

export default function Home() {
  const [selectedDigimon, setSelectedDigimon] = useState<string | null>(null);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Digimon Evolution Companion</h1>
        <p className={styles.subtitle}>
          Search for any Digimon to view how to obtain it
        </p>
        
        <DigimonSearch onSelect={setSelectedDigimon} />
        
        {selectedDigimon && (
          <EvolutionTree digimonName={selectedDigimon} />
        )}
      </div>
    </main>
  );
}
