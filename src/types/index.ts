export interface Artwork {
  id: string;
  filename: string;
  descriptionKey: string;
  width: number;
  height: number;
}

export interface ImageData {
  url: string;
  thumbnailSrcSet: string;
  fullUrl: string;
  description: string;
  width: number;
  height: number;
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
