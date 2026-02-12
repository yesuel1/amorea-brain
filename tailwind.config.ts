import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // 바이탈뷰티 브랜드 컬러
        vb: {
          // 메인 브랜드
          black: '#1A1A1A',
          charcoal: '#2D2D2D',
          silver: '#C0C0C0',
          lightsilver: '#E8E8E8',
          // 프리미엄 웰니스 톤
          navy: '#1A1A2E',
          deepnavy: '#0C0A08',
          // 제품별 악센트 컬러
          coral: '#E8625C',
          teal: '#3AAFA9',
          pink: '#E89DB1',
          green: '#5D8A6B',
          gold: '#C8956C',
          blue: '#5C6BC0',
          // UI 시맨틱
          bg: '#FAFAF7',
          card: '#FFFFFF',
          subtle: '#F5F3EE',
          muted: '#718096',
        },
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'var(--font-noto-sans-kr)', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-noto-sans-kr)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
      },
      maxWidth: {
        'mobile': '430px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
