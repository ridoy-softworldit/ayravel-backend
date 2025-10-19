type TBrandIcon = {
  name: string;
  url: string;
};

type TImages = {
  layout: "grid" | "slider";
  image: string;
};

export type TBrands = {
  name: string;
  icon: TBrandIcon;
  images: TImages[];
};
