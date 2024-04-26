type PersonLD = {
  "@type": "Person";
  name: string;
};

export type ImageLD = {
  "@type": "ImageObject";
  url: string;
  height?: number;
  width?: number;
};

type PublisherLD = {
  "@type": "Organization";
  name: string;
  url: string;
  logo: ImageLD;
  image: ImageLD | [ImageLD];
  brand: string;
  publishingPrinciples: string;
  sameAs: string[];
};

type RatingLD = {
  "@type": "AggregateRating";
  ratingValue: number | string;
  ratingCount?: number | string;
  reviewCount?: number | string;
};

type NutritionLD = {
  "@type": "NutritionInformation";
  calories: string;
  carbohydrateContent: string;
  cholesterolContent: string;
  fiberContent: string;
  proteinContent: string;
  saturatedFatContent: string;
  sodiumContent: string;
  sugarContent: string;
  fatContent: string;
  unsaturatedFatContent: string;
};

export type HowToSectionLD = {
  "@type": "HowToSection";
  name: string;
  itemListElement: HowToLD[];
};

export type HowToLD = {
  "@type": "HowToStep";
  text: string;
  image?: ImageLD | ImageLD[];
};

type ReviewLD = {
  "@type": "Review";
  reviewRating: {
    "@type": "Rating";
    ratingValue: string;
  };
  author: PersonLD;
  reviewBody: string;
  datePublished?: string;
};

export type RecipeLD = {
  "@context": "http://schema.org";
  "@type": string | string[];
  headline?: string;
  datePublished?: string;
  dateModified?: string;
  author: string | PersonLD | PersonLD[];
  description: string;
  image: string | ImageLD | string[];
  video?: any;
  publisher?: PublisherLD;
  name: string;
  aggregateRating: RatingLD;
  cookTime: string;
  prepTime: string;
  totalTime: string;
  nutrition?: NutritionLD;
  recipeCategory: string | string[];
  recipeCuisine: string | string[];
  recipeIngredient: string | string[];
  recipeInstructions: string[] | HowToLD[] | HowToSectionLD[];
  recipeYield?: number | string | string[];
  review?: ReviewLD[];
  mainEntityOfPage?: any;
  url: string;
};

export type StoredRecipe = {
  id: string;
  recipe: RecipeLD;
  dateAdded: Date;
  favorite: boolean;
  storedUrl?: string;
};

export enum SortOption {
  LAST_ADDED = "Newest",
  NAME_AZ = "Name: A to Z",
  NAME_ZA = "Name: Z to A",
}
