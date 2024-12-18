export type Product = {
  id: string;
  title: string;
  sku: string;
  category: string;
  subcategory: string;
  segment: string;
  brand: string;
  // Stored in cents, displayed in dollars
  globalWholesalePrice: number; 
};