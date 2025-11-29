import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DigimonSearch from '../DigimonSearch';

// Mock the library data
jest.mock('@clokken/digimon-dawn-dusk-data', () => ({
  DIGIMON: [
    {
      id: 1,
      fullName: 'Agumon',
      stage: 'Rookie',
      species: 'Reptile',
      type: 'Balance',
    },
    {
      id: 2,
      fullName: 'Gabumon',
      stage: 'Rookie',
      species: 'Beast',
      type: 'Balance',
    },
    {
      id: 3,
      fullName: 'Greymon',
      stage: 'Champion',
      species: 'Reptile',
      type: 'Attacker',
    },
  ],
}));

describe('DigimonSearch', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render search input', () => {
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should filter digimon based on search input', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);    
    // Open dropdown first
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
        await user.type(searchInput, 'Agu');
    
    expect(screen.getByText('Agumon')).toBeInTheDocument();
    expect(screen.queryByText('Gabumon')).not.toBeInTheDocument();
  });

  it('should call onSelect when clicking a digimon', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'Agu');
    
    const agumonButton = screen.getByText('Agumon');
    await user.click(agumonButton);
    
    expect(mockOnSelect).toHaveBeenCalledWith('Agumon');
  });

  it('should display digimon grouped by stage', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    // Open dropdown to see stage groups
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
    
    expect(screen.getByText('Rookie')).toBeInTheDocument();
    expect(screen.getByText('Champion')).toBeInTheDocument();
  });

  it('should show pin button for each digimon', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    // Open dropdown
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'Agu');
    
    // Unpinned items show 📍
    const pinButtons = screen.getAllByText('📍');
    expect(pinButtons.length).toBeGreaterThan(0);
  });

  it('should pin a digimon when clicking pin button', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    // Open dropdown
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'Agu');
    
    // Unpinned items show 📍
    const pinButton = screen.getAllByText('📍')[0];
    await user.click(pinButton);
    
    // Clear search to see pinned section
    await user.clear(searchInput);
    
    expect(screen.getByText(/pinned/i)).toBeInTheDocument();
  });

  it('should persist pinned digimon to localStorage', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    // Open dropdown
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'Agu');
    
    // Unpinned items show 📍
    const pinButton = screen.getAllByText('📍')[0];
    await user.click(pinButton);
    
    const storedPins = JSON.parse(localStorage.getItem('pinnedDigimon') || '[]');
    expect(storedPins).toContain('Agumon');
  });

  it('should unpin a digimon when clicking unpin button', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    // Open dropdown
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'Agu');
    
    // Pin (unpinned items show 📍)
    const pinButton = screen.getAllByText('📍')[0];
    await user.click(pinButton);
    
    // Unpin (pinned items show 📌)
    const unpinButton = screen.getAllByText('📌')[0];
    await user.click(unpinButton);
    
    const storedPins = JSON.parse(localStorage.getItem('pinnedDigimon') || '[]');
    expect(storedPins).not.toContain('Agumon');
  });

  it('should load pinned digimon from localStorage on mount', async () => {
    localStorage.setItem('pinnedDigimon', JSON.stringify(['Gabumon']));
    
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    // Open dropdown to see pinned section
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
    
    expect(screen.getByText(/pinned/i)).toBeInTheDocument();
    expect(screen.getByText('Gabumon')).toBeInTheDocument();
  });

  it('should filter by stage when searching', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    // Open dropdown
    const dropdownButton = screen.getByLabelText('Toggle dropdown');
    await user.click(dropdownButton);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'Grey');
    
    expect(screen.getByText('Greymon')).toBeInTheDocument();
    expect(screen.queryByText('Agumon')).not.toBeInTheDocument();
  });

  it('should be case-insensitive when searching', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'AGUMON');
    
    expect(screen.getByText('Agumon')).toBeInTheDocument();
  });

  it('should show message when no results found', async () => {
    const user = userEvent.setup();
    render(<DigimonSearch onSelect={mockOnSelect} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a digimon/i);
    await user.type(searchInput, 'NonExistentMon');
    
    expect(screen.getByText(/no digimon found/i)).toBeInTheDocument();
  });
});
