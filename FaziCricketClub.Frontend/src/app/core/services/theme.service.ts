import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'fazi-cricket-theme';

  readonly currentTheme = signal<Theme>(this.getInitialTheme());
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    // Initialize dark mode state
    this.isDarkMode.set(this.currentTheme() === 'dark');

    // Apply theme on changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return 'light';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }

    this.isDarkMode.set(theme === 'dark');
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
}
