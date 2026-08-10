import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Mirrors --font-sans in base.css so Tailwind utilities and plain CSS
    // resolve to the same local typeface.
    fontFamily: {
      sans: ['var(--font-sst)', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        soft: '0 14px 44px color-mix(in srgb, var(--j-ink) 14%, transparent)',
      },
      colors: {
        canvas: 'var(--paper)',
        ink: 'var(--ink)',
        ink2: 'var(--ink2)',
        ink3: 'var(--ink3)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        onAccent: 'var(--text-on-accent)',
        green: 'rgb(var(--green-ch) / <alpha-value>)',
        greenDark: 'var(--green-dark)',
        ochre: 'var(--ochre)',
        clay: 'var(--clay)',
        blue: 'var(--ratio-10-b)',
        blueLight: 'var(--ratio-10-c)',
        status: {
          green: 'var(--status-green)',
          yellow: 'var(--status-yellow)',
          red: 'var(--status-red)',
        },
        jadarat: {
          tealDeep: 'var(--j-teal-deep)',
          teal: 'var(--j-teal)',
          mist: 'var(--j-teal-mist)',
          charcoal: 'var(--j-charcoal)',
          bronze: 'var(--j-bronze)',
          sand: 'var(--j-sand)',
          beige: 'var(--j-beige)',
          cream: 'var(--j-cream)',
          tan: 'var(--j-tan)',
          grey: 'var(--j-grey)',
          ink: 'var(--j-ink)',
          slate: 'var(--j-slate)',
          cloud: 'var(--j-cloud)',
          accent: 'var(--j-accent)',
          jade: 'var(--j-jade)',
          gold: 'var(--j-gold)',
          green: 'var(--j-green)',
          forest: 'var(--j-forest)',
          pine: 'var(--j-pine)',
          greenDeep: 'var(--j-green-deep)',
          greenMid: 'var(--j-green-mid)',
        },
      },
      backgroundImage: {
        'ambient-light':
          'radial-gradient(620px 520px at 92% -8%, rgba(52, 132, 134, 0.14), transparent 60%), radial-gradient(560px 480px at -6% 10%, rgba(211, 177, 109, 0.14), transparent 58%), radial-gradient(720px 700px at 50% 122%, rgba(10, 61, 46, 0.08), transparent 60%)',
        'ambient-dark':
          'radial-gradient(620px 520px at 92% -8%, rgba(64, 190, 163, 0.16), transparent 60%), radial-gradient(560px 480px at -6% 10%, rgba(44, 124, 136, 0.2), transparent 58%), radial-gradient(720px 700px at 50% 122%, rgba(10, 61, 46, 0.22), transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
