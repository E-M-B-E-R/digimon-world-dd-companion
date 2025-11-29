import { patchEvolutionData } from '../evolutionDataFixes';

describe('evolutionDataFixes', () => {
  describe('patchEvolutionData', () => {
    it('should fix Kiwimon evolution line by removing Phoenixmon as direct evolution', () => {
      const mockEvoLines = {
        'Chicchimon': {
          'Chicchimon': ['Penguinmon', 'Muchomon'],
          'Penmon': ['Kiwimon', 'Kokatorimon'],
          'Kiwimon': ['Deramon', 'Phoenixmon'],
          'Muchomon': ['Diatrymon', 'Akatorimon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      expect(result['Chicchimon']['Kiwimon']).toEqual(['Deramon']);
      expect(result['Chicchimon']['Kiwimon']).not.toContain('Phoenixmon');
    });

    it('should add Phoenixmon to Deramon evolutions', () => {
      const mockEvoLines = {
        'Chicchimon': {
          'Kiwimon': ['Deramon', 'Phoenixmon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      expect(result['Chicchimon']['Deramon']).toContain('Phoenixmon');
    });

    it('should rename WereGarurumon to WarGarurumon(Blue) in Tsunomon line', () => {
      const mockEvoLines = {
        'Tsunomon': {
          'Garurumon': ['WarGarurumon(Blue)'],
          'WereGarurumon': ['MetalGarurumon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      expect(result['Tsunomon']['WarGarurumon(Blue)']).toEqual(['MetalGarurumon']);
      expect(result['Tsunomon']['WereGarurumon']).toBeUndefined();
    });

    it('should rename WereGarurumonBlack to WarGarurumon(Black) in Tsunomon line', () => {
      const mockEvoLines = {
        'Tsunomon': {
          'Ogremon': ['WarGarurumon(Black)'],
          'WereGarurumonBlack': ['Gulfmon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      expect(result['Tsunomon']['WarGarurumon(Black)']).toEqual(['Gulfmon']);
      expect(result['Tsunomon']['WereGarurumonBlack']).toBeUndefined();
    });

    it('should not modify other evolution lines', () => {
      const mockEvoLines = {
        'Botamon': {
          'Botamon': ['Koromon'],
          'Koromon': ['Agumon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      expect(result['Botamon']).toEqual(mockEvoLines['Botamon']);
    });

    it('should deep clone the input to avoid mutations', () => {
      const mockEvoLines = {
        'Chicchimon': {
          'Kiwimon': ['Deramon', 'Phoenixmon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      // Modify result
      result['Chicchimon']['Kiwimon'].push('TestMon');

      // Original should be unchanged
      expect(mockEvoLines['Chicchimon']['Kiwimon']).toEqual(['Deramon', 'Phoenixmon']);
    });

    it('should handle empty evolution lines', () => {
      const mockEvoLines = {};

      const result = patchEvolutionData(mockEvoLines);

      expect(result).toEqual({});
    });

    it('should handle Deramon already having evolutions', () => {
      const mockEvoLines = {
        'Chicchimon': {
          'Kiwimon': ['Deramon', 'Phoenixmon'],
          'Deramon': ['Eaglemon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      expect(result['Chicchimon']['Deramon']).toContain('Eaglemon');
      expect(result['Chicchimon']['Deramon']).toContain('Phoenixmon');
    });

    it('should not add Phoenixmon twice if already in Deramon evolutions', () => {
      const mockEvoLines = {
        'Chicchimon': {
          'Kiwimon': ['Deramon', 'Phoenixmon'],
          'Deramon': ['Phoenixmon'],
        }
      };

      const result = patchEvolutionData(mockEvoLines);

      const phoenixmonCount = result['Chicchimon']['Deramon'].filter(
        (name: string) => name === 'Phoenixmon'
      ).length;
      expect(phoenixmonCount).toBe(1);
    });
  });
});
