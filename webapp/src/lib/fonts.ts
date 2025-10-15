import { Inter, Roboto, Poppins, Source_Sans_3, Montserrat, Nunito } from 'next/font/google'

// Primary Font Family - Inter (Modern, Clean)
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

// Secondary Font Family - Poppins (Friendly, Rounded)
export const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})

// Body Text Font - Source Sans 3 (Highly Readable)
export const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})

// Display Font - Montserrat (Bold, Impact)
export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

// Code Font - Roboto Mono (Monospace)
export const robotoMono = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
  preload: true,
})

// Thai-Friendly Font - Nunito (Supports Thai well)
export const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

// Font Configuration Object
export const fontConfig = {
  // Primary fonts for main content
  primary: {
    sans: inter,
    display: montserrat,
    body: sourceSans,
  },
  
  // Secondary fonts for special use cases
  secondary: {
    friendly: poppins,
    thai: nunito,
    mono: robotoMono,
  },
  
  // Font combinations for different contexts
  combinations: {
    modern: [inter.variable, montserrat.variable],
    friendly: [poppins.variable, nunito.variable],
    professional: [sourceSans.variable, inter.variable],
    creative: [montserrat.variable, poppins.variable],
  }
} as const

// Font class utilities
export const fontClasses = {
  // Primary font classes
  primarySans: 'font-sans',
  primaryDisplay: 'font-display',
  primaryBody: 'font-body',
  
  // Secondary font classes
  secondaryFriendly: 'font-friendly',
  secondaryThai: 'font-thai',
  secondaryMono: 'font-mono',
  
  // Font weight utilities
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
  
  // Font size utilities (using Tailwind's text sizes)
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
} as const

// Helper function to get font variable classes
export function getFontVariables(combination: keyof typeof fontConfig.combinations): string {
  return fontConfig.combinations[combination].join(' ')
}

// Helper function to get all font variables
export function getAllFontVariables(): string {
  return [
    inter.variable,
    poppins.variable,
    sourceSans.variable,
    montserrat.variable,
    robotoMono.variable,
    nunito.variable,
  ].join(' ')
}
