# App #3: Digimon Evolution Companion

Week 3 out of 4 on testing out Github Copilot tools.
A Next.js application that helps players of Digimon Dawn/Dusk find evolution paths for their Digimon.

## Features

- 🔍 **Smart Search**: Type-ahead search with autocomplete suggestions
- 📊 **Grouped by Stage**: Browse all Digimon sorted by evolution level (In-Training, Rookie, Champion, Ultimate, Mega)
- 🌳 **Evolution Trees**: Visual tree display showing all evolution paths from the selected Digimon
- 📍 **Location Info**: Shows where to find/scan Digimon as alternate obtainment methods
- 🧬 **Multiple Evolution Types**: Supports normal, DNA, and armor evolutions
- 📋 **Detailed Requirements**: Displays all stats, experience, and friendship requirements for each evolution
- 🖼️ **Placeholder Squares**: Visual placeholders for Digimon images above each name

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd digimon-world-dd-companion
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Search for a Digimon**: Start typing in the search box to see suggestions
2. **Browse All Digimon**: Click the dropdown arrow to see all Digimon grouped by stage
3. **View Evolution Path**: Select a Digimon to see its complete evolution tree
4. **Check Requirements**: Each evolution shows the specific requirements needed

## Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [@clokken/digimon-dawn-dusk-data](https://github.com/clokken/digimon-dawn-dusk-data) - Game data library

## Build for Production

```bash
npm run build
npm start
```

## License

This project is for educational purposes. Digimon is a trademark of Bandai Namco Entertainment Inc.
