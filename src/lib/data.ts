import { MenuItem } from "@/types";

export const MENU_DATA: MenuItem[] = [
  {
    id: "1",
    name: "Signature Wagyu Burger",
    description: "200g Wagyu beef, truffle aioli, melted brie, and caramelized onions on a brioche bun.",
    price: 850,
    image: "/images/hero_burger.png",
    category: "Burgers",
    tags: ["Best Seller", "Premium"],
    isFeatured: true,
  },
  {
    id: "2",
    name: "Classic Cheese Burger",
    description: "Angus beef patty, cheddar cheese, pickles, and our secret sauce.",
    price: 450,
    image: "/images/hero_burger.png",
    category: "Burgers",
  },
  {
    id: "3",
    name: "Truffle Mushroom Pizza",
    description: "Wild mushrooms, truffle oil, mozzarella, and fresh thyme.",
    price: 950,
    image: "/images/hero_burger.png",
    category: "Pizza",
    tags: ["New"],
  },
  {
    id: "4",
    name: "Peri Peri Chicken",
    description: "Flame-grilled chicken breast with spicy peri-peri marinade.",
    price: 650,
    image: "/images/hero_burger.png",
    category: "Grill",
    tags: ["Spicy"],
  },
  {
    id: "5",
    name: "Artisan Garlic Bread",
    description: "Hand-kneaded bread with roasted garlic butter and herbs.",
    price: 220,
    image: "/images/hero_burger.png",
    category: "Sides",
  },
];

export const CATEGORIES = ["All", "Burgers", "Pizza", "Grill", "Sides"];
