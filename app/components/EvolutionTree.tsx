'use client';

import { useEffect, useState } from 'react';
import { DIGIMON, EVO_LINES as RAW_EVO_LINES } from '@clokken/digimon-dawn-dusk-data';
import type { Digimon } from '@clokken/digimon-dawn-dusk-data';
import { patchEvolutionData } from '@/lib/evolutionDataFixes';
import styles from './EvolutionTree.module.css';

// Apply fixes to evolution data
const EVO_LINES = patchEvolutionData(RAW_EVO_LINES);

interface EvolutionTreeProps {
  digimonName: string;
}

interface EvolutionPath {
  digimon: Digimon;
  requirement?: string;
  parentName?: string;
  children: EvolutionPath[];
  isCollapsed?: boolean;
}

export default function EvolutionTree({ digimonName }: EvolutionTreeProps) {
  const [evolutionPath, setEvolutionPath] = useState<EvolutionPath | null>(null);
  const [digimonInfo, setDigimonInfo] = useState<Digimon | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const digimon = DIGIMON.find((d) => d.fullName === digimonName);
    if (!digimon) {
      setEvolutionPath(null);
      setDigimonInfo(null);
      return;
    }

    setDigimonInfo(digimon);
    
    // Helper to get name variations for mismatched library data
    const getNameVariations = (name: string): string[] => {
      // Direct mappings from altNames in the library data
      const directMappings: Record<string, string> = {
        'Puttomon': 'Puttimon',
        'Chicomon': 'Chibomon',
        'Chocomon': 'Kokomon',
        'PicoDevimon': 'DemiDevimon',
        'Plotmon': 'Salamon',
        'Penmon': 'Penguinmon',
        'Bearmon': 'Kumamon',
        'Shamanmon': 'Shamamon',
        'SnowGoburimon': 'Snow Goblimon',
        'YukiAgumon': 'SnowAgumon',
        'Raramon': 'Lalamon',
        'Arurarumon': 'Aruraumon',
        'Alraunemon': 'Aruraumon',
        'DotFalcomon': 'Dfalcomon',
        'Candmon': 'Candlemon',
        'Mechanorimon': 'Mekanorimon',
        'Vegiemon': 'Veggiemon',
        'Tailmon': 'Gatomon',
        'XVmon': 'ExVeemon',
        'Chrysalimon': 'Kurisarimon',
        'Saesarmon': 'Seasarmon',
        'Evilmon': 'Vilemon',
        'Gokimon': 'Roachmon',
        'RaptorDramon': 'Reptiledramon',
        'Hanumon': 'Apemon',
        'DarkTyrannomon': 'DKTyrannomon',
        'Minotaurmon': 'Minotarumon',
        'DarkRizamon': 'DarkLizardmon',
        'FlaRizamon': 'Flarerizamon',
        'Gwappamon': 'Gawappamon',
        'Dorimogemon': 'Drimogemon',
        'NiseDorimogemon': 'NiseDrimogemon',
        'Wendimon': 'Wendigomon',
        'Fuugamon': 'Fugamon',
        'MudFrigimon': 'Tsuchidarumon',
        'MudFigimon': 'Tsuchidarumon',
        'Tortomon': 'Tortamon',
        'Yukidarumon': 'Frigimon',
        'ShellNumemon': 'KaratsukiNumemon',
        'Rukamon': 'Dolphmon',
        'Zassoumon': 'Weedmon',
        'Igamon': 'Ninjamon',
        'Kougamon': 'Kogamon',
        'J-Mojyamon': 'Jungle Mojyamon',
        'Revolmon': 'Deputymon',
        'Centaurmon': 'Centarumon',
        'Rekismon': 'Lekismon',
        'Volcamon': 'Volcanomon',
        'Pixiemon': 'Piximon',
        'Piccolomon': 'Piximon',
        'AlturKabuterimon': 'Megakabuterimon(Blue)',
        'Ookuwamon': 'Okuwamon',
        'TonosamaGekomon': 'ShogunGekomon',
        'Anomarokarimon': 'Scorpiomon',
        'WereGarurumonBlack': 'WarGarurumon(Black)',
        'WereGarurumon': 'WarGarurumon(Blue)',
        'WereGarurumonBlue': 'WarGarurumon(Blue)',
        'Vamdemon': 'Myotismon',
        'Lilymon': 'Lillymon',
        'AlturKabuterimonRed': 'MegaKabuterimon(Red)',
        'Nanomon': 'Datamon',
        'HolyAngemon': 'MagnaAngemon',
        'Arachnemon': 'Arukenimon',
        'MegaloGrowmon': 'WarGrowlmon',
        'DORUgremon': 'DoruGreymon',
        'B-Megalogrowmon': 'BlackWarGrowlmon',
        'Owlmon': 'Aurumon',
        'RizeGreymon': 'RiseGreymon',
        'Qilinmon': 'Tyilinmon',
        'Lylamon': 'Lilamon',
        'LucemonFM': 'Lucemon Chaos Mode',
        'CM': 'Lucemon Chaos Mode',
        'Vadermon': 'Vademon',
        'Vermillimon': 'Vermilimon',
        'Vajiramon': 'Vajramon',
        'GrappLeomon': 'Grapleomon',
        'Lynxmon': 'Lanksmon',
        'Shawujinmon': 'Shaujinmon',
        'Prairemon': 'Prairiemon',
        'Argomon Ultimate (ArgomonUT)': 'Argomon Ultimate',
        'HeracleKabuterimon': 'HerculesKabuterimon',
        'Daemon': 'Creepymon',
        'Mugendramon': 'MachineDramon',
        'Machinedramon': 'MachineDramon',
        'VenomVamdemon': 'VenomMyotismon',
        'Omegamon': 'Omnimon',
        'ImperialdramonDM': 'Imperialdramon Dragon Mode',
        'Imperialdramon Dragon Mode (ImperialdramonDM)': 'Imperialdramon Dragon Mode',
        'ImperialdramonFM': 'Imperialdramon Fighter Mode',
        'Imperialdramon Fighter Mode (ImperialdramonFM)': 'Imperialdramon Fighter Mode',
        'Imperialdramon Paladin Mode (ImperialdramonPM)': 'Imperialdramon Paladin Mode',
        'Deathmon': 'Ghoulmon',
        'Cherubimon (Vaccine)': 'Cherubimon (Good)',
        'Cherubimon (Virus)': 'Cherubimon (Evil)',
        'Dukemon': 'Gallantmon',
        'DukemonCM': 'Gallantmon Crimson Mode',
        'GallantmonCM (Crimson Mode)': 'Gallantmon Crimson Mode',
        'SaintGargomon': 'Mega Gargomon',
        'Neptunemon': 'Neptunmon',
        'Gryphomon': 'Gryphonmon',
        'Plesiomon': 'Preciomon',
        'BelialVamdemon': 'MaloMyotismon',
        'Imperialdramon Dragon Black (ImperialdramonDB)': 'Imperialdramon Dragon Mode(Black)',
        'BlackImperialdramon': 'Imperialdramon Dragon Mode(Black)',
        'BlackMegaGargomon': 'Black SaintGargomon',
        'Anubimon': 'Anubismon',
        'SlashAngemon': 'SL Angemon',
        'GuardiAngemon': 'SL Angemon',
        'Crossmon': 'Eaglemon',
        'BanchoLeomon': 'Bantyo Leomon',
        'BanchouLeomon': 'Bantyo Leomon',
        'Goddramon': 'Goldramon',
        'ZeedMilleniumon': 'ZeedMillenniummon',
        'DeathmonBlack': 'Ghoulmon (Black)',
        'ChaosDukemon': 'Chaos Gallantmon',
        'Valkyriemon': 'Valkyrimon',
        'GranKuwagamon': 'GrandisKuwagamon',
        'Holydramon': 'Magna Dramon',
        'Milleniumon': 'Millenniummon',
        'MoonMillenniummon': 'Moon=Millenniummon',
        'MoonMilleniumon': 'Moon=Millenniummon',
        'Megiddramon': 'Megidramon',
        'Chronomon Holy Mode (ChronomonHM)': 'Chronomon Holy Mode',
        'Valdurmon': 'Varodurumon',
        'ShineGreymon Burst Mode (ShineGreymonBM)': 'Shine Greymon Burst Mode',
        'ShineGreymon Ruin mode (ShineGreymonRM)': 'Shine Greymon Ruin Mode',
        'MirageGaogamon Burst Mode (MirageGaogamonBM)': 'MirageGaogamon Burst Mode',
        'Ravemon Burst Mode (RavemonBM)': 'Ravemon Burst Mode',
        'Lotusmon': 'Lotosmon',
        'Beelzemon Blast Mode (BeelzemonBM)': 'Beelzemon Blast Mode',
        'Rosemon Burst Mode (RosemonBM)': 'Rosemon Burst Mode',
        'Argomon Mega (ArgomonMG)': 'Argomon Mega',
        'ArgomonUT': 'Argomon Ultimate',
        'ArgomonMG': 'Argomon Mega',
        'SangLoupmon': 'Sangloupmon',
        'Darkdramon': 'Dark Dramon',
        'JMojyamon': 'Jungle Mojyamon',
        'SkullMammothmon': 'Skull Mammothmon',
        'ToyAgumonB': 'ToyAgumon(Black)',
        'Whamon': 'Whamon (Ultimate)',
        'MarineDevimon': 'Marine Devimon',
        'RedVegiemon': 'Red Vegiemon',
        'SandYanmamon': 'Sand Yanmamon',
        'GhoulmonB': 'Ghoulmon (Black)',
        'PawnChessmonWhite': 'PawnChessmon(White)',
        'PawnChessmonBlack': 'PawnChessmon(Black)',
        'KnightChessmonWhite': 'KnightChessmon(White)',
        'KnightChessmonBlack': 'KnightChessmon(Black)',
        'MegaGargomon': 'Mega Gargomon',
        'Tsumemon:': 'Tsumemon',
      };
      
      if (directMappings[name]) {
        return [name, directMappings[name]];
      }
      
      const allVariations: string[] = [name];
      
      // Step 1: Were/War replacements
      const wereWarVariants = [
        name,
        name.replace('Were', 'War'),
        name.replace('War', 'Were'),
      ];
      
      // Step 2: For each Were/War variant, try color suffix variations
      wereWarVariants.forEach(variant => {
        allVariations.push(variant);
        allVariations.push(variant.replace('Blue', '(Blue)'));
        allVariations.push(variant.replace('Black', '(Black)'));
        allVariations.push(variant.replace('White', '(White)'));
        allVariations.push(variant.replace('Red', '(Red)'));
        allVariations.push(variant.replace('(Blue)', 'Blue'));
        allVariations.push(variant.replace('(Black)', 'Black'));
        allVariations.push(variant.replace('(White)', 'White'));
        allVariations.push(variant.replace('(Red)', 'Red'));
        allVariations.push(variant.replace('(Blue)', ''));
        allVariations.push(variant.replace('(Black)', ''));
        allVariations.push(variant.replace('(White)', ''));
        allVariations.push(variant.replace('(Red)', ''));
        
        // If no parentheses, try adding them
        if (!variant.includes('(')) {
          allVariations.push(variant + '(Blue)');
          allVariations.push(variant + '(Black)');
          allVariations.push(variant + '(White)');
          allVariations.push(variant + '(Red)');
        }
      });
      
      // Step 3: J/Jungle replacements
      allVariations.push(name.replace(/^J([A-Z])/, 'Jungle $1'));
      allVariations.push(name.replace('Jungle ', 'J'));
      
      // Step 4: Nise prefix
      allVariations.push(name.replace(/^Nise/, ''));
      allVariations.push('Nise' + name);
      
      // Step 5: Dot prefix
      allVariations.push(name.replace(/^Dot/, ''));
      
      // Step 6: Space variations for compound names
      allVariations.push(name.replace(/([a-z])([A-Z])/g, '$1 $2')); // Add spaces
      allVariations.push(name.replace(/ /g, '')); // Remove spaces
      
      return [...new Set(allVariations)]; // Remove duplicates
    };
    
    // Find the root of the evolution line (lowest stage)
    const findRoot = (name: string, visited = new Set<string>()): string => {
      if (visited.has(name)) return name;
      visited.add(name);
      
      // Try all name variations to find parents
      const variations = getNameVariations(name);
      
      // Also check reverse mappings (e.g., if searching "Gatomon", also try "Tailmon")
      const directMappings: Record<string, string> = {
        'Puttomon': 'Puttimon',
        'Chicomon': 'Chibomon',
        'Chocomon': 'Kokomon',
        'PicoDevimon': 'DemiDevimon',
        'Plotmon': 'Salamon',
        'Penmon': 'Penguinmon',
        'Bearmon': 'Kumamon',
        'Shamanmon': 'Shamamon',
        'SnowGoburimon': 'Snow Goblimon',
        'YukiAgumon': 'SnowAgumon',
        'Raramon': 'Lalamon',
        'Arurarumon': 'Aruraumon',
        'Alraunemon': 'Aruraumon',
        'DotFalcomon': 'Dfalcomon',
        'Candmon': 'Candlemon',
        'Mechanorimon': 'Mekanorimon',
        'Vegiemon': 'Veggiemon',
        'Tailmon': 'Gatomon',
        'XVmon': 'ExVeemon',
        'Chrysalimon': 'Kurisarimon',
        'Saesarmon': 'Seasarmon',
        'Evilmon': 'Vilemon',
        'Gokimon': 'Roachmon',
        'RaptorDramon': 'Reptiledramon',
        'Hanumon': 'Apemon',
        'DarkTyrannomon': 'DKTyrannomon',
        'Minotaurmon': 'Minotarumon',
        'DarkRizamon': 'DarkLizardmon',
        'FlaRizamon': 'Flarerizamon',
        'Gwappamon': 'Gawappamon',
        'Dorimogemon': 'Drimogemon',
        'NiseDorimogemon': 'NiseDrimogemon',
        'Wendimon': 'Wendigomon',
        'Fuugamon': 'Fugamon',
        'MudFrigimon': 'Tsuchidarumon',
        'MudFigimon': 'Tsuchidarumon',
        'Tortomon': 'Tortamon',
        'Yukidarumon': 'Frigimon',
        'ShellNumemon': 'KaratsukiNumemon',
        'Rukamon': 'Dolphmon',
        'Zassoumon': 'Weedmon',
        'Igamon': 'Ninjamon',
        'Kougamon': 'Kogamon',
        'J-Mojyamon': 'Jungle Mojyamon',
        'Revolmon': 'Deputymon',
        'Centaurmon': 'Centarumon',
        'Rekismon': 'Lekismon',
        'Volcamon': 'Volcanomon',
        'Pixiemon': 'Piximon',
        'Piccolomon': 'Piximon',
        'AlturKabuterimon': 'Megakabuterimon(Blue)',
        'Ookuwamon': 'Okuwamon',
        'TonosamaGekomon': 'ShogunGekomon',
        'Anomarokarimon': 'Scorpiomon',
        'WereGarurumonBlack': 'WarGarurumon(Black)',
        'WereGarurumon': 'WarGarurumon(Blue)',
        'WereGarurumonBlue': 'WarGarurumon(Blue)',
        'Vamdemon': 'Myotismon',
        'Lilymon': 'Lillymon',
        'AlturKabuterimonRed': 'MegaKabuterimon(Red)',
        'Nanomon': 'Datamon',
        'HolyAngemon': 'MagnaAngemon',
        'Arachnemon': 'Arukenimon',
        'MegaloGrowmon': 'WarGrowlmon',
        'DORUgremon': 'DoruGreymon',
        'B-Megalogrowmon': 'BlackWarGrowlmon',
        'Owlmon': 'Aurumon',
        'RizeGreymon': 'RiseGreymon',
        'Qilinmon': 'Tyilinmon',
        'Lylamon': 'Lilamon',
        'LucemonFM': 'Lucemon Chaos Mode',
        'CM': 'Lucemon Chaos Mode',
        'Vadermon': 'Vademon',
        'Vermillimon': 'Vermilimon',
        'Vajiramon': 'Vajramon',
        'GrappLeomon': 'Grapleomon',
        'Lynxmon': 'Lanksmon',
        'Shawujinmon': 'Shaujinmon',
        'Prairemon': 'Prairiemon',
        'Argomon Ultimate (ArgomonUT)': 'Argomon Ultimate',
        'HeracleKabuterimon': 'HerculesKabuterimon',
        'Daemon': 'Creepymon',
        'Mugendramon': 'MachineDramon',
        'Machinedramon': 'MachineDramon',
        'VenomVamdemon': 'VenomMyotismon',
        'Omegamon': 'Omnimon',
        'ImperialdramonDM': 'Imperialdramon Dragon Mode',
        'Imperialdramon Dragon Mode (ImperialdramonDM)': 'Imperialdramon Dragon Mode',
        'ImperialdramonFM': 'Imperialdramon Fighter Mode',
        'Imperialdramon Fighter Mode (ImperialdramonFM)': 'Imperialdramon Fighter Mode',
        'Imperialdramon Paladin Mode (ImperialdramonPM)': 'Imperialdramon Paladin Mode',
        'Deathmon': 'Ghoulmon',
        'Cherubimon (Vaccine)': 'Cherubimon (Good)',
        'Cherubimon (Virus)': 'Cherubimon (Evil)',
        'Dukemon': 'Gallantmon',
        'DukemonCM': 'Gallantmon Crimson Mode',
        'GallantmonCM (Crimson Mode)': 'Gallantmon Crimson Mode',
        'SaintGargomon': 'Mega Gargomon',
        'Neptunemon': 'Neptunmon',
        'Gryphomon': 'Gryphonmon',
        'Plesiomon': 'Preciomon',
        'BelialVamdemon': 'MaloMyotismon',
        'Imperialdramon Dragon Black (ImperialdramonDB)': 'Imperialdramon Dragon Mode(Black)',
        'BlackImperialdramon': 'Imperialdramon Dragon Mode(Black)',
        'BlackMegaGargomon': 'Black SaintGargomon',
        'Anubimon': 'Anubismon',
        'SlashAngemon': 'SL Angemon',
        'GuardiAngemon': 'SL Angemon',
        'Crossmon': 'Eaglemon',
        'BanchoLeomon': 'Bantyo Leomon',
        'BanchouLeomon': 'Bantyo Leomon',
        'Goddramon': 'Goldramon',
        'ZeedMilleniumon': 'ZeedMillenniummon',
        'DeathmonBlack': 'Ghoulmon (Black)',
        'ChaosDukemon': 'Chaos Gallantmon',
        'Valkyriemon': 'Valkyrimon',
        'GranKuwagamon': 'GrandisKuwagamon',
        'Holydramon': 'Magna Dramon',
        'Milleniumon': 'Millenniummon',
        'MoonMillenniummon': 'Moon=Millenniummon',
        'MoonMilleniumon': 'Moon=Millenniummon',
        'Megiddramon': 'Megidramon',
        'Chronomon Holy Mode (ChronomonHM)': 'Chronomon Holy Mode',
        'Valdurmon': 'Varodurumon',
        'ShineGreymon Burst Mode (ShineGreymonBM)': 'Shine Greymon Burst Mode',
        'ShineGreymon Ruin mode (ShineGreymonRM)': 'Shine Greymon Ruin Mode',
        'MirageGaogamon Burst Mode (MirageGaogamonBM)': 'MirageGaogamon Burst Mode',
        'Ravemon Burst Mode (RavemonBM)': 'Ravemon Burst Mode',
        'Lotusmon': 'Lotosmon',
        'Beelzemon Blast Mode (BeelzemonBM)': 'Beelzemon Blast Mode',
        'Rosemon Burst Mode (RosemonBM)': 'Rosemon Burst Mode',
        'Argomon Mega (ArgomonMG)': 'Argomon Mega',
        'ArgomonUT': 'Argomon Ultimate',
        'ArgomonMG': 'Argomon Mega',
        'SangLoupmon': 'Sangloupmon',
        'Darkdramon': 'Dark Dramon',
        'JMojyamon': 'Jungle Mojyamon',
        'SkullMammothmon': 'Skull Mammothmon',
        'ToyAgumonB': 'ToyAgumon(Black)',
        'Whamon': 'Whamon (Ultimate)',
        'MarineDevimon': 'Marine Devimon',
        'RedVegiemon': 'Red Vegiemon',
        'SandYanmamon': 'Sand Yanmamon',
        'GhoulmonB': 'Ghoulmon (Black)',
        'PawnChessmonWhite': 'PawnChessmon(White)',
        'PawnChessmonBlack': 'PawnChessmon(Black)',
        'KnightChessmonWhite': 'KnightChessmon(White)',
        'KnightChessmonBlack': 'KnightChessmon(Black)',
        'MegaGargomon': 'Mega Gargomon',
        'Tsumemon:': 'Tsumemon',
      };
      
      // Create reverse mapping
      const reverseMappings: Record<string, string> = {};
      for (const [key, value] of Object.entries(directMappings)) {
        reverseMappings[value] = key;
      }
      
      // If the name maps to something, also try the original
      if (reverseMappings[name]) {
        variations.push(reverseMappings[name]);
      }
      
      for (const variant of variations) {
        for (const lineKey in EVO_LINES) {
          const line = EVO_LINES[lineKey];
          for (const parentName in line) {
            const evolutions = line[parentName];
            // evolutions is an array of strings
            if (Array.isArray(evolutions) && evolutions.includes(variant)) {
              return findRoot(parentName, visited);
            }
          }
        }
      }
      
      return name;
    };
    
    // Build evolution tree from root (showing forward evolutions only)
    const buildEvolutionTree = (currentName: string, visited = new Set<string>()): EvolutionPath | null => {
      if (visited.has(currentName)) return null;
      visited.add(currentName);

      let current = DIGIMON.find((d) => d.fullName === currentName);
      
      // Handle name mismatches in the library data
      if (!current) {
        const variations = getNameVariations(currentName);
        for (const variant of variations) {
          current = DIGIMON.find((d) => d.fullName === variant);
          if (current) break;
        }
      }
      
      if (!current) {
        console.warn('Could not find Digimon:', currentName);
        return null;
      }

      const children: EvolutionPath[] = [];

      // Find next evolutions using the ORIGINAL name from EVO_LINES
      // We need to check both the current name AND its reverse mapping
      const searchNames = [currentName];
      
      // Add reverse mapping if exists (e.g., "Gatomon" -> also search "Tailmon")
      const directMappings: Record<string, string> = {
        'Puttomon': 'Puttimon',
        'Chicomon': 'Chibomon',
        'Chocomon': 'Kokomon',
        'PicoDevimon': 'DemiDevimon',
        'Plotmon': 'Salamon',
        'Penmon': 'Penguinmon',
        'Bearmon': 'Kumamon',
        'Shamanmon': 'Shamamon',
        'SnowGoburimon': 'Snow Goblimon',
        'YukiAgumon': 'SnowAgumon',
        'Raramon': 'Lalamon',
        'Arurarumon': 'Aruraumon',
        'Alraunemon': 'Aruraumon',
        'DotFalcomon': 'Dfalcomon',
        'Candmon': 'Candlemon',
        'Mechanorimon': 'Mekanorimon',
        'Vegiemon': 'Veggiemon',
        'Tailmon': 'Gatomon',
        'XVmon': 'ExVeemon',
        'Chrysalimon': 'Kurisarimon',
        'Saesarmon': 'Seasarmon',
        'Evilmon': 'Vilemon',
        'Gokimon': 'Roachmon',
        'RaptorDramon': 'Reptiledramon',
        'Hanumon': 'Apemon',
        'DarkTyrannomon': 'DKTyrannomon',
        'Minotaurmon': 'Minotarumon',
        'DarkRizamon': 'DarkLizardmon',
        'FlaRizamon': 'Flarerizamon',
        'Gwappamon': 'Gawappamon',
        'Dorimogemon': 'Drimogemon',
        'NiseDorimogemon': 'NiseDrimogemon',
        'Wendimon': 'Wendigomon',
        'Fuugamon': 'Fugamon',
        'MudFrigimon': 'Tsuchidarumon',
        'MudFigimon': 'Tsuchidarumon',
        'Tortomon': 'Tortamon',
        'Yukidarumon': 'Frigimon',
        'ShellNumemon': 'KaratsukiNumemon',
        'Rukamon': 'Dolphmon',
        'Zassoumon': 'Weedmon',
        'Igamon': 'Ninjamon',
        'Kougamon': 'Kogamon',
        'J-Mojyamon': 'Jungle Mojyamon',
        'Revolmon': 'Deputymon',
        'Centaurmon': 'Centarumon',
        'Rekismon': 'Lekismon',
        'Volcamon': 'Volcanomon',
        'Pixiemon': 'Piximon',
        'Piccolomon': 'Piximon',
        'AlturKabuterimon': 'Megakabuterimon(Blue)',
        'Ookuwamon': 'Okuwamon',
        'TonosamaGekomon': 'ShogunGekomon',
        'Anomarokarimon': 'Scorpiomon',
        'WereGarurumonBlack': 'WarGarurumon(Black)',
        'WereGarurumon': 'WarGarurumon(Blue)',
        'WereGarurumonBlue': 'WarGarurumon(Blue)',
        'Vamdemon': 'Myotismon',
        'Lilymon': 'Lillymon',
        'AlturKabuterimonRed': 'MegaKabuterimon(Red)',
        'Nanomon': 'Datamon',
        'HolyAngemon': 'MagnaAngemon',
        'Arachnemon': 'Arukenimon',
        'MegaloGrowmon': 'WarGrowlmon',
        'DORUgremon': 'DoruGreymon',
        'B-Megalogrowmon': 'BlackWarGrowlmon',
        'Owlmon': 'Aurumon',
        'RizeGreymon': 'RiseGreymon',
        'Qilinmon': 'Tyilinmon',
        'Lylamon': 'Lilamon',
        'LucemonFM': 'Lucemon Chaos Mode',
        'CM': 'Lucemon Chaos Mode',
        'Vadermon': 'Vademon',
        'Vermillimon': 'Vermilimon',
        'Vajiramon': 'Vajramon',
        'GrappLeomon': 'Grapleomon',
        'Lynxmon': 'Lanksmon',
        'Shawujinmon': 'Shaujinmon',
        'Prairemon': 'Prairiemon',
        'Argomon Ultimate (ArgomonUT)': 'Argomon Ultimate',
        'HeracleKabuterimon': 'HerculesKabuterimon',
        'Daemon': 'Creepymon',
        'Mugendramon': 'MachineDramon',
        'Machinedramon': 'MachineDramon',
        'VenomVamdemon': 'VenomMyotismon',
        'Omegamon': 'Omnimon',
        'ImperialdramonDM': 'Imperialdramon Dragon Mode',
        'Imperialdramon Dragon Mode (ImperialdramonDM)': 'Imperialdramon Dragon Mode',
        'ImperialdramonFM': 'Imperialdramon Fighter Mode',
        'Imperialdramon Fighter Mode (ImperialdramonFM)': 'Imperialdramon Fighter Mode',
        'Imperialdramon Paladin Mode (ImperialdramonPM)': 'Imperialdramon Paladin Mode',
        'Deathmon': 'Ghoulmon',
        'Cherubimon (Vaccine)': 'Cherubimon (Good)',
        'Cherubimon (Virus)': 'Cherubimon (Evil)',
        'Dukemon': 'Gallantmon',
        'DukemonCM': 'Gallantmon Crimson Mode',
        'GallantmonCM (Crimson Mode)': 'Gallantmon Crimson Mode',
        'SaintGargomon': 'Mega Gargomon',
        'Neptunemon': 'Neptunmon',
        'Gryphomon': 'Gryphonmon',
        'Plesiomon': 'Preciomon',
        'BelialVamdemon': 'MaloMyotismon',
        'Imperialdramon Dragon Black (ImperialdramonDB)': 'Imperialdramon Dragon Mode(Black)',
        'BlackImperialdramon': 'Imperialdramon Dragon Mode(Black)',
        'BlackMegaGargomon': 'Black SaintGargomon',
        'Anubimon': 'Anubismon',
        'SlashAngemon': 'SL Angemon',
        'GuardiAngemon': 'SL Angemon',
        'Crossmon': 'Eaglemon',
        'BanchoLeomon': 'Bantyo Leomon',
        'BanchouLeomon': 'Bantyo Leomon',
        'Goddramon': 'Goldramon',
        'ZeedMilleniumon': 'ZeedMillenniummon',
        'DeathmonBlack': 'Ghoulmon (Black)',
        'ChaosDukemon': 'Chaos Gallantmon',
        'Valkyriemon': 'Valkyrimon',
        'GranKuwagamon': 'GrandisKuwagamon',
        'Holydramon': 'Magna Dramon',
        'Milleniumon': 'Millenniummon',
        'MoonMillenniummon': 'Moon=Millenniummon',
        'MoonMilleniumon': 'Moon=Millenniummon',
        'Megiddramon': 'Megidramon',
        'Chronomon Holy Mode (ChronomonHM)': 'Chronomon Holy Mode',
        'Valdurmon': 'Varodurumon',
        'ShineGreymon Burst Mode (ShineGreymonBM)': 'Shine Greymon Burst Mode',
        'ShineGreymon Ruin mode (ShineGreymonRM)': 'Shine Greymon Ruin Mode',
        'MirageGaogamon Burst Mode (MirageGaogamonBM)': 'MirageGaogamon Burst Mode',
        'Ravemon Burst Mode (RavemonBM)': 'Ravemon Burst Mode',
        'Lotusmon': 'Lotosmon',
        'Beelzemon Blast Mode (BeelzemonBM)': 'Beelzemon Blast Mode',
        'Rosemon Burst Mode (RosemonBM)': 'Rosemon Burst Mode',
        'Argomon Mega (ArgomonMG)': 'Argomon Mega',
        'ArgomonUT': 'Argomon Ultimate',
        'ArgomonMG': 'Argomon Mega',
        'SangLoupmon': 'Sangloupmon',
        'Darkdramon': 'Dark Dramon',
        'JMojyamon': 'Jungle Mojyamon',
        'SkullMammothmon': 'Skull Mammothmon',
        'ToyAgumonB': 'ToyAgumon(Black)',
        'Whamon': 'Whamon (Ultimate)',
        'MarineDevimon': 'Marine Devimon',
        'RedVegiemon': 'Red Vegiemon',
        'SandYanmamon': 'Sand Yanmamon',
        'GhoulmonB': 'Ghoulmon (Black)',
        'PawnChessmonWhite': 'PawnChessmon(White)',
        'PawnChessmonBlack': 'PawnChessmon(Black)',
        'KnightChessmonWhite': 'KnightChessmon(White)',
        'KnightChessmonBlack': 'KnightChessmon(Black)',
        'MegaGargomon': 'Mega Gargomon',
        'Tsumemon:': 'Tsumemon',
      };
      
      const reverseMappings: Record<string, string> = {};
      for (const [key, value] of Object.entries(directMappings)) {
        reverseMappings[value] = key;
      }
      
      if (reverseMappings[currentName]) {
        searchNames.push(reverseMappings[currentName]);
      }
      
      for (const searchName of searchNames) {
        for (const lineKey in EVO_LINES) {
          const line = EVO_LINES[lineKey];
          if (line[searchName]) {
            const evolutions = line[searchName];
            // evolutions is an array of strings
            if (Array.isArray(evolutions)) {
              for (const targetName of evolutions) {
                const childTree = buildEvolutionTree(targetName, new Set(visited));
                if (childTree) {
                  children.push({
                    ...childTree,
                    parentName: searchName,
                  });
                }
              }
            }
          }
        }
      }

      return {
        digimon: current,
        children,
      };
    };

    const rootName = findRoot(digimonName);
    const tree = buildEvolutionTree(rootName);
    setEvolutionPath(tree);
  }, [digimonName]);

  const toggleCollapse = (digimonName: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(digimonName)) {
        newSet.delete(digimonName);
      } else {
        newSet.add(digimonName);
      }
      return newSet;
    });
  };

  const formatRequirements = (digimonName: string, parentName?: string): string[] => {
    const requirements: string[] = [];
    
    // Evolution requirements are stored in the DIGIMON array's evoReqs field
    const digimon = DIGIMON.find((d) => d.fullName === digimonName);
    if (!digimon || !digimon.evoReqs) {
      return requirements;
    }
    
    const reqs = digimon.evoReqs;
    if (reqs.level) requirements.push(`Lv ${reqs.level}+`);
    if (reqs.attack) requirements.push(`Atk ${reqs.attack}+`);
    if (reqs.defense) requirements.push(`Def ${reqs.defense}+`);
    if (reqs.spirit) requirements.push(`Spr ${reqs.spirit}+`);
    if (reqs.speed) requirements.push(`Spd ${reqs.speed}+`);
    if (reqs.aptitude) requirements.push(`Apt ${reqs.aptitude}+`);
    if (reqs.friendship) requirements.push(`Friendship ${reqs.friendship}%+`);
    if (reqs.holyExp) requirements.push(`Holy EXP ${reqs.holyExp}+`);
    if (reqs.darkExp) requirements.push(`Dark EXP ${reqs.darkExp}+`);
    if (reqs.dragonExp) requirements.push(`Dragon EXP ${reqs.dragonExp}+`);
    if (reqs.beastExp) requirements.push(`Beast EXP ${reqs.beastExp}+`);
    if (reqs.birdExp) requirements.push(`Bird EXP ${reqs.birdExp}+`);
    if (reqs.aquaExp) requirements.push(`Aqua EXP ${reqs.aquaExp}+`);
    if (reqs.machineExp) requirements.push(`Machine EXP ${reqs.machineExp}+`);
    if (reqs.insectPlantExp) requirements.push(`Insect/Plant EXP ${reqs.insectPlantExp}+`);
    if (reqs.befriended && Array.isArray(reqs.befriended) && reqs.befriended.length > 0) {
      requirements.push(`Befriend: ${reqs.befriended.join(', ')}`);
    }

    return requirements;
  };

  const renderTree = (node: EvolutionPath, level: number = 0): JSX.Element => {
    const hasChildren = node.children.length > 0;
    const requirements = formatRequirements(node.digimon.fullName, node.parentName);
    const isSelected = node.digimon.fullName === digimonName;
    const isCollapsed = collapsedNodes.has(node.digimon.fullName);

    return (
      <div key={`${node.digimon.fullName}-${level}`} className={styles.treeNode}>
        <div className={styles.nodeContent}>
          <div 
            className={`${styles.digimonCard} ${isSelected ? styles.selected : ''} ${hasChildren ? styles.hasChildren : ''}`}
            onClick={() => hasChildren && toggleCollapse(node.digimon.fullName)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.placeholderSquare}>
                <span className={styles.placeholderText}>?</span>
              </div>
              <h3 className={styles.digimonName}>
                {node.digimon.fullName}
                {hasChildren && <span className={styles.collapseIcon}>{isCollapsed ? ' ▶' : ' ▼'}</span>}
              </h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Stage:</span>
                <span className={styles.value}>{node.digimon.stage}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Species:</span>
                <span className={styles.value}>{node.digimon.species}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Type:</span>
                <span className={styles.value}>{node.digimon.type}</span>
              </div>
              {node.digimon.habitat && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>Location:</span>
                  <span className={styles.value}>{node.digimon.habitat}</span>
                </div>
              )}
              {requirements.length > 0 && (
                <div className={styles.requirements}>
                  <div className={styles.reqHeader}>Evolution Requirements:</div>
                  <ul className={styles.reqList}>
                    {requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div className={styles.children}>
            {node.children.map((child, idx) => (
              <div key={idx} className={styles.childWrapper}>
                <div className={styles.connector} />
                {renderTree(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!digimonInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Digimon not found</div>
      </div>
    );
  }

  if (!evolutionPath || evolutionPath.children.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noPath}>
          No evolutions found for {digimonName}
        </div>
        {digimonInfo.habitat && (
          <div className={styles.locationInfo}>
            <h3>Alternate Obtainment:</h3>
            <p>Can be found/scanned at: <strong>{digimonInfo.habitat}</strong></p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.treeTitle}>Evolution Line for {digimonName}</h2>
      <div className={styles.tree}>
        {renderTree(evolutionPath)}
      </div>
    </div>
  );
}
