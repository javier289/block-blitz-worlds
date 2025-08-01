import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Game world colors
				wood: {
					primary: 'hsl(var(--wood-primary))',
					secondary: 'hsl(var(--wood-secondary))',
					accent: 'hsl(var(--wood-accent))',
					bg: 'hsl(var(--wood-bg))'
				},
				brick: {
					primary: 'hsl(var(--brick-primary))',
					secondary: 'hsl(var(--brick-secondary))',
					accent: 'hsl(var(--brick-accent))',
					bg: 'hsl(var(--brick-bg))'
				},
				water: {
					primary: 'hsl(var(--water-primary))',
					secondary: 'hsl(var(--water-secondary))',
					accent: 'hsl(var(--water-accent))',
					bg: 'hsl(var(--water-bg))'
				},
				fire: {
					primary: 'hsl(var(--fire-primary))',
					secondary: 'hsl(var(--fire-secondary))',
					accent: 'hsl(var(--fire-accent))',
					bg: 'hsl(var(--fire-bg))'
				},
				ice: {
					primary: 'hsl(var(--ice-primary))',
					secondary: 'hsl(var(--ice-secondary))',
					accent: 'hsl(var(--ice-accent))',
					bg: 'hsl(var(--ice-bg))'
				}
			},
			backgroundImage: {
				'gradient-wood': 'var(--gradient-wood)',
				'gradient-brick': 'var(--gradient-brick)',
				'gradient-water': 'var(--gradient-water)',
				'gradient-fire': 'var(--gradient-fire)',
				'gradient-ice': 'var(--gradient-ice)',
			},
			boxShadow: {
				'glow': 'var(--glow-effect)',
				'block': 'var(--block-shadow)',
			},
			transitionProperty: {
				'smooth': 'var(--transition-smooth)',
				'fast': 'var(--transition-fast)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
