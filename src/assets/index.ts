
// This file exports constants for our placeholder images

export const IMAGE_PATHS = {
  farmer: "/assets/farmer-avatar.jpg",
  trader: "/assets/trader-avatar.jpg",
  admin: "/assets/admin-avatar.jpg",
  rice: "/assets/rice.jpg",
  wheat: "/assets/wheat.jpg",
  tomatoes: "/assets/tomatoes.jpg",
  potatoes: "/assets/potatoes.jpg",
  onions: "/assets/onions.jpg",
  cotton: "/assets/cotton.jpg",
  sugarcane: "/assets/sugarcane.jpg",
  soybeans: "/assets/soybeans.jpg",
  corn: "/assets/corn.jpg",
  user: "/assets/user-placeholder.jpg",
  product: "/assets/product-placeholder.jpg",
  auctionBanner: "/assets/auction-banner.jpg",
  marketplace: "/assets/marketplace-banner.jpg",
  logo: "/assets/mandi-connect-logo.svg",
};

// Fallback placeholder for when image fails to load
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Cpath d='M50,30 C43.373,30 38,35.373 38,42 C38,48.627 43.373,54 50,54 C56.627,54 62,48.627 62,42 C62,35.373 56.627,30 50,30 ZM50,64 C35.038,64 25,74.013 25,84.997 L25,90 L75,90 L75,84.997 C75,74.013 64.962,64 50,64 Z' fill='%23d1d5db'/%3E%3C/svg%3E";

// Product categories and crops
export const CROP_CATEGORIES = [
  "Grains",
  "Pulses",
  "Oilseeds",
  "Vegetables",
  "Fruits",
  "Cash Crops",
  "Spices",
  "Fibers",
  "Other"
];

export const COMMON_CROPS = {
  "Grains": ["Rice", "Wheat", "Maize", "Jowar", "Bajra"],
  "Pulses": ["Chickpeas", "Lentils", "Black Gram", "Pigeon Peas", "Green Gram"],
  "Oilseeds": ["Groundnut", "Mustard", "Soybean", "Sunflower", "Sesame"],
  "Vegetables": ["Potato", "Onion", "Tomato", "Lady Finger", "Brinjal"],
  "Fruits": ["Mango", "Banana", "Guava", "Apple", "Orange"],
  "Cash Crops": ["Cotton", "Sugarcane", "Tea", "Coffee", "Jute"],
  "Spices": ["Turmeric", "Chilli", "Ginger", "Black Pepper", "Cardamom"],
  "Fibers": ["Cotton", "Jute", "Hemp", "Silk", "Flax"],
  "Other": ["Tobacco", "Rubber", "Coconut", "Arecanut", "Cashew"]
};

// Units for product quantity
export const QUANTITY_UNITS = [
  "KG",
  "Quintal",
  "Ton",
  "Dozen"
];

// Quality grades
export const QUALITY_GRADES = [
  {
    grade: "A",
    description: "Premium quality, meets all standards"
  },
  {
    grade: "B",
    description: "Good quality with minor defects"
  },
  {
    grade: "C",
    description: "Average quality with some defects"
  }
];

// States in India for address form
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];
