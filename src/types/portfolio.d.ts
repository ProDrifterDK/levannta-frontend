export interface PortfolioItem {
  name: string;
  mrr: number;
  churnRate: number;
}

export interface PortfolioRow {
  clientId: string;
  amount: number;
  year: number;
  month: number;
  churnRate?: number;
}
