
// Common types and constants for the application

// Product categories with labels and values
export const CATEGORIES = [
  { label: "Grains", value: "Grains" },
  { label: "Vegetables", value: "Vegetables" },
  { label: "Fruits", value: "Fruits" },
  { label: "Pulses", value: "Pulses" },
  { label: "Spices", value: "Spices" },
  { label: "Other", value: "Other" }
];

// Units for products
export const UNITS = [
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Quintal", value: "quintal" },
  { label: "Ton", value: "ton" },
  { label: "Piece", value: "piece" }
];

// Map of varieties by category
const VARIETIES_MAP = {
  "Grains": [
    { label: "Basmati Rice", value: "Basmati Rice" },
    { label: "Wheat", value: "Wheat" },
    { label: "Maize", value: "Maize" },
    { label: "Millet", value: "Millet" },
    { label: "Barley", value: "Barley" }
  ],
  "Vegetables": [
    { label: "Tomato", value: "Tomato" },
    { label: "Potato", value: "Potato" },
    { label: "Onion", value: "Onion" },
    { label: "Brinjal", value: "Brinjal" },
    { label: "Cauliflower", value: "Cauliflower" },
    { label: "Cabbage", value: "Cabbage" }
  ],
  "Fruits": [
    { label: "Apple", value: "Apple" },
    { label: "Banana", value: "Banana" },
    { label: "Mango", value: "Mango" },
    { label: "Orange", value: "Orange" },
    { label: "Grapes", value: "Grapes" }
  ],
  "Pulses": [
    { label: "Moong Dal", value: "Moong Dal" },
    { label: "Toor Dal", value: "Toor Dal" },
    { label: "Urad Dal", value: "Urad Dal" },
    { label: "Chana Dal", value: "Chana Dal" }
  ],
  "Spices": [
    { label: "Turmeric", value: "Turmeric" },
    { label: "Red Chilli", value: "Red Chilli" },
    { label: "Black Pepper", value: "Black Pepper" },
    { label: "Cardamom", value: "Cardamom" },
    { label: "Cumin", value: "Cumin" }
  ],
  "Other": [
    { label: "Jaggery", value: "Jaggery" },
    { label: "Honey", value: "Honey" },
    { label: "Ghee", value: "Ghee" }
  ]
};

// Function to get varieties for a specific category
export function getVarietiesByCategory(category: string) {
  return VARIETIES_MAP[category as keyof typeof VARIETIES_MAP] || [];
}

// User roles
export const USER_ROLES = ["farmer", "trader", "admin"];
