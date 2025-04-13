
export type Category = 
  | 'Grains'
  | 'Pulses'
  | 'Fruits'
  | 'Vegetables'
  | 'Spices'
  | 'Oils'
  | 'Cotton'
  | 'Dairy'
  | 'Other';

export interface SelectOption {
  label: string;
  value: string;
}

export const CATEGORIES: SelectOption[] = [
  { label: 'Grains', value: 'Grains' },
  { label: 'Pulses', value: 'Pulses' },
  { label: 'Fruits', value: 'Fruits' },
  { label: 'Vegetables', value: 'Vegetables' },
  { label: 'Spices', value: 'Spices' },
  { label: 'Oils', value: 'Oils' },
  { label: 'Cotton', value: 'Cotton' },
  { label: 'Dairy', value: 'Dairy' },
  { label: 'Other', value: 'Other' },
];

export const UNITS: SelectOption[] = [
  { label: 'Kilograms (kg)', value: 'kg' },
  { label: 'Tonnes', value: 'tonne' },
  { label: 'Quintals', value: 'quintal' },
  { label: 'Pieces', value: 'piece' },
  { label: 'Bags', value: 'bag' },
  { label: 'Boxes', value: 'box' },
  { label: 'Dozen', value: 'dozen' },
  { label: 'Litres', value: 'litre' }
];

export const APPOINTMENT_TYPES: SelectOption[] = [
  { label: 'Inspection', value: 'inspection' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'Other', value: 'other' },
];

export const GRAIN_VARIETIES: SelectOption[] = [
  { label: 'Rice - Basmati', value: 'Basmati' },
  { label: 'Rice - Sona Masoori', value: 'Sona Masoori' },
  { label: 'Rice - Ponni', value: 'Ponni' },
  { label: 'Wheat - Sharbati', value: 'Sharbati' },
  { label: 'Wheat - Lokwan', value: 'Lokwan' },
  { label: 'Maize', value: 'Maize' },
  { label: 'Barley', value: 'Barley' },
  { label: 'Millets', value: 'Millets' },
  { label: 'Jowar', value: 'Jowar' },
  { label: 'Bajra', value: 'Bajra' },
  { label: 'Ragi', value: 'Ragi' },
];

export const PULSE_VARIETIES: SelectOption[] = [
  { label: 'Toor Dal (Arhar)', value: 'Toor Dal' },
  { label: 'Moong Dal', value: 'Moong Dal' },
  { label: 'Urad Dal', value: 'Urad Dal' },
  { label: 'Chana Dal', value: 'Chana Dal' },
  { label: 'Masoor Dal', value: 'Masoor Dal' },
  { label: 'Rajma', value: 'Rajma' },
  { label: 'Black Gram', value: 'Black Gram' },
  { label: 'Green Gram', value: 'Green Gram' },
  { label: 'Chickpeas', value: 'Chickpeas' },
];

export const FRUIT_VARIETIES: SelectOption[] = [
  { label: 'Mango', value: 'Mango' },
  { label: 'Banana', value: 'Banana' },
  { label: 'Apple', value: 'Apple' },
  { label: 'Orange', value: 'Orange' },
  { label: 'Grapes', value: 'Grapes' },
  { label: 'Pomegranate', value: 'Pomegranate' },
  { label: 'Papaya', value: 'Papaya' },
  { label: 'Watermelon', value: 'Watermelon' },
  { label: 'Pineapple', value: 'Pineapple' },
  { label: 'Guava', value: 'Guava' },
];

export const VEGETABLE_VARIETIES: SelectOption[] = [
  { label: 'Potato', value: 'Potato' },
  { label: 'Tomato', value: 'Tomato' },
  { label: 'Onion', value: 'Onion' },
  { label: 'Cauliflower', value: 'Cauliflower' },
  { label: 'Cabbage', value: 'Cabbage' },
  { label: 'Carrot', value: 'Carrot' },
  { label: 'Lady Finger (Okra)', value: 'Lady Finger' },
  { label: 'Peas', value: 'Peas' },
  { label: 'Brinjal (Eggplant)', value: 'Brinjal' },
  { label: 'Spinach', value: 'Spinach' },
  { label: 'Bottle Gourd', value: 'Bottle Gourd' },
  { label: 'Bitter Gourd', value: 'Bitter Gourd' },
];

export const SPICE_VARIETIES: SelectOption[] = [
  { label: 'Turmeric', value: 'Turmeric' },
  { label: 'Red Chilli', value: 'Red Chilli' },
  { label: 'Coriander', value: 'Coriander' },
  { label: 'Cumin', value: 'Cumin' },
  { label: 'Mustard Seeds', value: 'Mustard Seeds' },
  { label: 'Black Pepper', value: 'Black Pepper' },
  { label: 'Cardamom', value: 'Cardamom' },
  { label: 'Cinnamon', value: 'Cinnamon' },
  { label: 'Cloves', value: 'Cloves' },
  { label: 'Ginger', value: 'Ginger' },
  { label: 'Garlic', value: 'Garlic' },
];

export const OIL_VARIETIES: SelectOption[] = [
  { label: 'Mustard Oil', value: 'Mustard Oil' },
  { label: 'Groundnut Oil', value: 'Groundnut Oil' },
  { label: 'Sesame Oil', value: 'Sesame Oil' },
  { label: 'Coconut Oil', value: 'Coconut Oil' },
  { label: 'Sunflower Oil', value: 'Sunflower Oil' },
  { label: 'Rice Bran Oil', value: 'Rice Bran Oil' },
  { label: 'Soybean Oil', value: 'Soybean Oil' },
  { label: 'Olive Oil', value: 'Olive Oil' },
];

export const COTTON_VARIETIES: SelectOption[] = [
  { label: 'Long Staple', value: 'Long Staple' },
  { label: 'Medium Staple', value: 'Medium Staple' },
  { label: 'Short Staple', value: 'Short Staple' },
  { label: 'Raw Cotton', value: 'Raw Cotton' },
  { label: 'Processed Cotton', value: 'Processed Cotton' },
];

export const DAIRY_VARIETIES: SelectOption[] = [
  { label: 'Milk', value: 'Milk' },
  { label: 'Paneer', value: 'Paneer' },
  { label: 'Ghee', value: 'Ghee' },
  { label: 'Butter', value: 'Butter' },
  { label: 'Yogurt', value: 'Yogurt' },
  { label: 'Cheese', value: 'Cheese' },
];

export const getVarietiesByCategory = (category: Category | string): SelectOption[] => {
  switch (category) {
    case 'Grains':
      return GRAIN_VARIETIES;
    case 'Pulses':
      return PULSE_VARIETIES;
    case 'Fruits':
      return FRUIT_VARIETIES;
    case 'Vegetables':
      return VEGETABLE_VARIETIES;
    case 'Spices':
      return SPICE_VARIETIES;
    case 'Oils':
      return OIL_VARIETIES;
    case 'Cotton':
      return COTTON_VARIETIES;
    case 'Dairy':
      return DAIRY_VARIETIES;
    default:
      return [{ label: 'Other', value: 'Other' }];
  }
};

export const STATES: SelectOption[] = [
  { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
  { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
  { label: 'Assam', value: 'Assam' },
  { label: 'Bihar', value: 'Bihar' },
  { label: 'Chhattisgarh', value: 'Chhattisgarh' },
  { label: 'Goa', value: 'Goa' },
  { label: 'Gujarat', value: 'Gujarat' },
  { label: 'Haryana', value: 'Haryana' },
  { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
  { label: 'Jharkhand', value: 'Jharkhand' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
  { label: 'Maharashtra', value: 'Maharashtra' },
  { label: 'Manipur', value: 'Manipur' },
  { label: 'Meghalaya', value: 'Meghalaya' },
  { label: 'Mizoram', value: 'Mizoram' },
  { label: 'Nagaland', value: 'Nagaland' },
  { label: 'Odisha', value: 'Odisha' },
  { label: 'Punjab', value: 'Punjab' },
  { label: 'Rajasthan', value: 'Rajasthan' },
  { label: 'Sikkim', value: 'Sikkim' },
  { label: 'Tamil Nadu', value: 'Tamil Nadu' },
  { label: 'Telangana', value: 'Telangana' },
  { label: 'Tripura', value: 'Tripura' },
  { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
  { label: 'Uttarakhand', value: 'Uttarakhand' },
  { label: 'West Bengal', value: 'West Bengal' },
];
