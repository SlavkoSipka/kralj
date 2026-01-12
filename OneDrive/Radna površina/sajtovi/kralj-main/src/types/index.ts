// Common types used across components
export interface Apartment {
  id: number;
  name: string;
  number: number;
  image: string;
  size: number | string;
  rooms: number;
  floor: string;
  status: string;
  hasBalcony: boolean;
}

export interface ScrollProps {
  scrolled: boolean;
  showScrollIndicator: boolean;
  scrollPosition: number;
}

export interface ParallaxProps {
  calculateScale: () => number;
  calculateTextOpacity: () => number;
  calculateTextTransform: () => string;
}