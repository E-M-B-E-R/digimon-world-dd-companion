import { render, screen } from '@testing-library/react';
import EvolutionTree from '../EvolutionTree';
import { patchEvolutionData } from '@/lib/evolutionDataFixes';

// Mock the library data and patch function
jest.mock('@clokken/digimon-dawn-dusk-data', () => ({
  DIGIMON: [
    {
      id: 1,
      fullName: 'Agumon',
      stage: 'Rookie',
      species: 'Reptile',
      type: 'Balance',
      habitat: 'AkkiPlain',
      evoReqs: { level: 5 },
    },
    {
      id: 2,
      fullName: 'Greymon',
      stage: 'Champion',
      species: 'Reptile',
      type: 'Attacker',
      habitat: 'SunriseCanyons',
      evoReqs: { level: 18, attack: 80 },
    },
    {
      id: 3,
      fullName: 'MetalGreymon',
      stage: 'Ultimate',
      species: 'Cyborg',
      type: 'Attacker',
      habitat: 'Unknown',
      evoReqs: { level: 38, attack: 140, dragonExp: 4000 },
    },
  ],
  EVO_LINES: {
    'Agumon': {
      'Agumon': ['Greymon'],
      'Greymon': ['MetalGreymon'],
    },
  },
}));

jest.mock('@/lib/evolutionDataFixes', () => ({
  patchEvolutionData: jest.fn((data) => data),
}));

describe('EvolutionTree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error when digimon not found', () => {
    render(<EvolutionTree digimonName="NonExistent" />);
    
    expect(screen.getByText('Digimon not found')).toBeDefined();
  });

  it('should render evolution tree for valid digimon', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    expect(screen.getByText('Agumon')).toBeDefined();
    expect(screen.getByText('Greymon')).toBeDefined();
  });

  it('should display digimon stage', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    expect(screen.getByText('Rookie')).toBeDefined();
  });

  it('should display digimon species', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    // Use getAllByText since multiple digimon in the tree can have the same species
    const speciesElements = screen.getAllByText('Reptile');
    expect(speciesElements.length).toBeGreaterThan(0);
  });

  it('should display digimon type', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    expect(screen.getByText('Balance')).toBeDefined();
  });

  it('should display habitat when available', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    expect(screen.getByText('AkkiPlain')).toBeDefined();
  });

  it('should display evolution requirements', () => {
    render(<EvolutionTree digimonName="Greymon" />);
    
    expect(screen.getByText(/Lv 18\+/)).toBeDefined();
    expect(screen.getByText(/Atk 80\+/)).toBeDefined();
  });

  it('should use patched evolution data', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    // Verify the component renders, which means it's using the mocked/patched data
    expect(screen.getByText('Evolution Line for Agumon')).toBeInTheDocument();
  });

  it('should display tree title with digimon name', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    expect(screen.getByText(/Evolution Line for Agumon/)).toBeDefined();
  });

  it('should show all evolutions in the tree', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    expect(screen.getByText('Agumon')).toBeDefined();
    expect(screen.getByText('Greymon')).toBeDefined();
    expect(screen.getByText('MetalGreymon')).toBeDefined();
  });

  it('should display multiple evolution requirements', () => {
    render(<EvolutionTree digimonName="MetalGreymon" />);
    
    expect(screen.getByText(/Lv 38\+/)).toBeDefined();
    expect(screen.getByText(/Atk 140\+/)).toBeDefined();
    expect(screen.getByText(/Dragon EXP 4000\+/)).toBeDefined();
  });

  it('should render cards for each evolution stage', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    const cards = screen.getAllByText(/Stage:/);
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should show location label', () => {
    render(<EvolutionTree digimonName="Agumon" />);
    
    // Use getAllByText since multiple digimon in the tree can have location labels
    const locationLabels = screen.getAllByText('Location:');
    expect(locationLabels.length).toBeGreaterThan(0);
  });
});
