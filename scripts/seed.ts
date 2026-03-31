import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MENU_DATA = [
  {
    id: "1",
    name: "Signature Wagyu Burger",
    description: "200g Wagyu beef, truffle aioli, melted brie, and caramelized onions on a brioche bun.",
    price: 850,
    image: "/images/hero_burger.png",
    category: "Burgers",
    tags: ["Best Seller", "Premium"],
    is_featured: true,
    is_available: true,
  },
  {
    id: "2",
    name: "Classic Cheese Burger",
    description: "Angus beef patty, cheddar cheese, pickles, and our secret sauce.",
    price: 450,
    image: "/images/hero_burger.png",
    category: "Burgers",
    is_available: true,
  },
  {
    id: "3",
    name: "Truffle Mushroom Pizza",
    description: "Wild mushrooms, truffle oil, mozzarella, and fresh thyme.",
    price: 950,
    image: "/images/hero_burger.png",
    category: "Pizza",
    tags: ["New"],
    is_available: true,
  },
  {
    id: "4",
    name: "Peri Peri Chicken",
    description: "Flame-grilled chicken breast with spicy peri-peri marinade.",
    price: 650,
    image: "/images/hero_burger.png",
    category: "Grill",
    tags: ["Spicy"],
    is_available: true,
  },
  {
    id: "5",
    name: "Artisan Garlic Bread",
    description: "Hand-kneaded bread with roasted garlic butter and herbs.",
    price: 220,
    image: "/images/hero_burger.png",
    category: "Sides",
    is_available: true,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  const { error } = await supabase
    .from("menu_items")
    .upsert(MENU_DATA);

  if (error) {
    console.error("❌ Error seeding menu_items:", error);
    return;
  }

  console.log("✅ Seeding complete!");
}

seed();
