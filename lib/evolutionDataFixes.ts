/**
 * Patches for evolution data that fix known issues in the library
 */
export function patchEvolutionData(evoLines: any): any {
  const patched = JSON.parse(JSON.stringify(evoLines)); // Deep clone
  
  // Fix Kiwimon evolution line
  // Issue: In library 2.2.0, Kiwimon lists both Deramon and Phoenixmon as direct evolutions
  // Correct: Kiwimon → Deramon → Phoenixmon
  if (patched['Chicchimon']) {
    const chicchimonLine = patched['Chicchimon'];
    
    // Remove Phoenixmon from Kiwimon's direct evolutions (if it's an array)
    if (Array.isArray(chicchimonLine['Kiwimon'])) {
      chicchimonLine['Kiwimon'] = chicchimonLine['Kiwimon'].filter(
        (name: string) => name !== 'Phoenixmon'
      );
    }
    
    // Add Phoenixmon to Deramon's evolutions
    if (!chicchimonLine['Deramon']) {
      chicchimonLine['Deramon'] = [];
    }
    if (Array.isArray(chicchimonLine['Deramon']) && !chicchimonLine['Deramon'].includes('Phoenixmon')) {
      chicchimonLine['Deramon'].push('Phoenixmon');
    }
  }
  
  // Fix Tsunomon/Garurumon evolution line
  // Issue: EVO_LINES uses "WereGarurumon" as key but DIGIMON has "WarGarurumon(Blue)"
  // This causes MetalGarurumon to be disconnected
  if (patched['Tsunomon']) {
    const tsunomonLine = patched['Tsunomon'];
    
    // If "WereGarurumon" exists, rename it to "WarGarurumon(Blue)"
    if (tsunomonLine['WereGarurumon']) {
      tsunomonLine['WarGarurumon(Blue)'] = tsunomonLine['WereGarurumon'];
      delete tsunomonLine['WereGarurumon'];
    }
    
    // Similarly for Black variant
    if (tsunomonLine['WereGarurumonBlack']) {
      tsunomonLine['WarGarurumon(Black)'] = tsunomonLine['WereGarurumonBlack'];
      delete tsunomonLine['WereGarurumonBlack'];
    }
  }
  
  return patched;
}
