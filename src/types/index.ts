export interface Artwork {
  id: string;
  filename: string;
  descriptionKey: string;
}

export interface ImageData {
  url: string;
  description: string;
}

export interface PriceItem {
  name: string;
  price: string;
  note?: string;
  additional?: string;
  deliveryTime?: string;
}

export interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}