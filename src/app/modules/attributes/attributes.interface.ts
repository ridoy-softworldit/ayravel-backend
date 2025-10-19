
export type TAttributesArr = {
  value: string;
  meta: string; 
};


export type TAttributes = {
  name: string;
  slug?: string; 
  attributes: TAttributesArr[];
  type?: 'dropdown' | 'color' | 'text' | 'number';
  category?: string;
  required?: boolean; 
  usageCount?: number; 
  createdAt?: string; 
  updatedAt?: string; 
};
