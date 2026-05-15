export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  colorCode: string;
  slug: string;
  count?: number;
}