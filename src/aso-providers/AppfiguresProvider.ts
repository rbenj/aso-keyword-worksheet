import type { Provider } from './Provider';

export class AppfiguresProvider implements Provider {
  getLabel() {
    return 'Appfigures';
  }

  getQueryURL(query: string) {
    return `https://appfigures.com/reports/keyword-inspector?keyword=${encodeURIComponent(query)}`;
  }
}
