export interface Ingredient {
  id: string;
  name: string;
  description: string;
  icon?: string;
  number?: number;
}

export interface HowToUseStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface VideoThumbnail {
  url: string;
  alt: string;
  duration?: string;
}

export interface HowToUse {
  steps: HowToUseStep[];
  videoThumbnail: VideoThumbnail;
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  authorName: string;
  avatar: string;
  verified: boolean;
  date: string;
}

export interface ProductDetails {
  ingredients?: Ingredient[];
  howToUse?: HowToUse;
  reviews?: Review[];
  fullIngredientsList?: string[];
}
