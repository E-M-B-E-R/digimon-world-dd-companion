import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

// Mock the child components
jest.mock('../components/DigimonSearch', () => {
  return function MockDigimonSearch({ onSelect }: { onSelect: (name: string) => void }) {
    return (
      <div data-testid="digimon-search">
        <button onClick={() => onSelect('Agumon')}>Select Agumon</button>
      </div>
    );
  };
});

jest.mock('../components/EvolutionTree', () => {
  return function MockEvolutionTree({ digimonName }: { digimonName: string }) {
    return <div data-testid="evolution-tree">Evolution tree for {digimonName}</div>;
  };
});

describe('Home Page', () => {
  it('should render the title', () => {
    render(<Home />);
    
    expect(screen.getByText('Digimon Evolution Companion')).toBeDefined();
  });

  it('should render the subtitle', () => {
    render(<Home />);
    
    expect(screen.getByText(/Search for any Digimon to view how to obtain it/)).toBeDefined();
  });

  it('should render DigimonSearch component', () => {
    render(<Home />);
    
    expect(screen.getByTestId('digimon-search')).toBeDefined();
  });

  it('should not render EvolutionTree initially', () => {
    render(<Home />);
    
    expect(screen.queryByTestId('evolution-tree')).toBeNull();
  });

  it('should render EvolutionTree when digimon is selected', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const selectButton = screen.getByText('Select Agumon');
    await user.click(selectButton);
    
    expect(screen.getByTestId('evolution-tree')).toBeDefined();
    expect(screen.getByText('Evolution tree for Agumon')).toBeDefined();
  });

  it('should pass selected digimon name to EvolutionTree', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const selectButton = screen.getByText('Select Agumon');
    await user.click(selectButton);
    
    expect(screen.getByText('Evolution tree for Agumon')).toBeDefined();
  });
});
