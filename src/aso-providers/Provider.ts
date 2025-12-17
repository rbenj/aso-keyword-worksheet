export interface Provider {
  getLabel: () => string;
  getQueryURL: (query: string) => string;
}
