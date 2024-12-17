export type Product = {
  id: number;
  title: string;
  sku: string;
  category: string;
  subcategory: string;
  basePrice: number;
  selected?: boolean;
  newPrice?: string; 

};