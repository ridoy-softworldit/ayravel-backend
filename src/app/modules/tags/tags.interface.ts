type TIcon = {
  name?: string;
  url?: string;
};

export type TTag = {
  name: string;
  slug?: string;
  type: string;
  details: string;
  icon?: TIcon;
  image: string;
  deletedImage?: string;
};
