# Test Suite Documentation

## Overview
This test suite provides comprehensive coverage for the Digimon Evolution Companion app.

## Test Files

### 1. `lib/__tests__/evolutionDataFixes.test.ts`
Tests for the evolution data patching utility that fixes known issues in the library data.

**Coverage:**
- Kiwimon evolution line fix (removing incorrect Phoenixmon direct evolution)
- Adding Phoenixmon to Deramon's evolutions
- Renaming WereGarurumon → WarGarurumon(Blue)
- Renaming WereGarurumonBlack → WarGarurumon(Black)
- Deep cloning to prevent mutations
- Edge cases (empty data, duplicate entries)

### 2. `app/components/__tests__/DigimonSearch.test.tsx`
Tests for the DigimonSearch component that handles search and pin functionality.

**Coverage:**
- Rendering search input
- Filtering digimon by name (case-insensitive)
- Grouping digimon by stage
- Selecting digimon
- Pinning/unpinning functionality
- localStorage persistence
- Empty search results

### 3. `app/components/__tests__/EvolutionTree.test.tsx`
Tests for the EvolutionTree component that displays evolution chains.

**Coverage:**
- Rendering evolution tree
- Displaying digimon information (stage, species, type, habitat)
- Showing evolution requirements
- Handling non-existent digimon
- Applying evolution data patches
- Multi-stage evolution chains

### 4. `app/__tests__/page.test.tsx`
Tests for the main Home page component.

**Coverage:**
- Rendering title and subtitle
- Component integration
- Digimon selection flow
- Conditional EvolutionTree rendering

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Generate coverage report
```bash
pnpm test:coverage
```

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM

## Mock Strategy

The test suite uses Jest mocks for:
- `@clokken/digimon-dawn-dusk-data`: Mocked with minimal test data
- `localStorage`: Automatically mocked by Jest in jsdom environment
- Child components in integration tests

## Coverage Goals

The test suite aims for:
- ✅ 80%+ line coverage
- ✅ 80%+ branch coverage
- ✅ 80%+ function coverage
- ✅ All critical user paths tested

## Adding New Tests

When adding new features:
1. Create test file in `__tests__` directory adjacent to the component/utility
2. Follow existing naming conventions (`ComponentName.test.tsx`)
3. Use descriptive test names starting with "should"
4. Mock external dependencies
5. Test both happy paths and edge cases
6. Update this documentation

## Known Issues

- TypeScript errors with `toBeInTheDocument()` matcher - these are type-only errors and don't affect test execution
- Some integration tests use simplified mocks - consider adding more detailed mocks for complex scenarios
