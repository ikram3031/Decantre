// src/utils/theme.js

export const themes = {
  dark: {
    name: 'Luxury Dark',
    bg: 'bg-[#050505]',
    containerBg: 'bg-[#0a0a0a]',
    text: 'text-[#f5f5f5]',
    textMuted: 'text-[#a0a0a0]',
    primaryGold: '#C5A059',
    secondaryColor: '#1A1A1A',
    borderColor: 'border-[#C5A059]/25',
    button: {
      primary: 'bg-[#C5A059] text-[#050505] hover:bg-[#b59049] border border-[#C5A059]',
      secondary: 'bg-[#1a1a1a] text-[#C5A059] hover:bg-[#2a2a2a] border border-[#C5A059]/20',
      outline: 'bg-transparent text-[#C5A059] border border-[#C5A059] hover:bg-[#C5A059]/10',
      ghost: 'bg-transparent text-[#C5A059] hover:bg-[#C5A059]/5 border border-transparent'
    }
  },
  light: {
    name: 'Luxury Light',
    bg: 'bg-[#ffffff]',
    containerBg: 'bg-[#ffffff]',
    text: 'text-[#050505]',
    textMuted: 'text-[#050505]',
    primaryGold: '#C5A059',
    secondaryColor: '#050505',
    borderColor: 'border-[#C5A059]/40',
    button: {
      primary: 'bg-[#C5A059] text-[#050505] hover:bg-[#b59049] border border-[#C5A059]',
      secondary: 'bg-[#050505] text-[#ffffff] hover:bg-[#1a1a1a] border border-[#050505]',
      outline: 'bg-transparent text-[#050505] border border-[#050505] hover:bg-[#050505]/10',
      ghost: 'bg-transparent text-[#050505] hover:bg-[#050505]/10 border border-transparent'
    }
  }
};
