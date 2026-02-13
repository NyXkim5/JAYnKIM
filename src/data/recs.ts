export interface Rec {
  id: string;
  name: string;
  note: string;
  location: string;
  price: string;
  tag?: string;
  starred?: boolean;
  color: "yellow" | "pink" | "blue" | "green" | "orange" | "purple";
  size: "small" | "medium" | "large";
}

export const cafeRecs: Rec[] = [
  { id: "c1", name: "Ippodo Tea", note: "ceremonial grade matcha from kyoto. the real deal.", location: "Costa Mesa", price: "$$", tag: "matcha", starred: true, color: "green", size: "large" },
  { id: "c2", name: "Daydream", note: "aesthetic matcha bar, hojicha is underrated", location: "Irvine", price: "$$", tag: "matcha", color: "green", size: "medium" },
  { id: "c3", name: "Portola Coffee Lab", note: "third wave everything. pour-overs are insane", location: "Costa Mesa", price: "$$", tag: "coffee", starred: true, color: "orange", size: "large" },
  { id: "c4", name: "Archive", note: "minimalist gallery vibes. matcha is clean", location: "Los Angeles", price: "$$", tag: "matcha", starred: true, color: "green", size: "medium" },
  { id: "c5", name: "Hidden House Coffee", note: "hidden gem in san juan. worth the drive", location: "San Juan Cap.", price: "$", tag: "coffee", starred: true, color: "yellow", size: "large" },
  { id: "c6", name: "Cafe Kindred", note: "cozy spot, oat matcha latte is the move", location: "Laguna Beach", price: "$", tag: "matcha", color: "blue", size: "small" },
  { id: "c7", name: "Vitality & Mischief", note: "experimental single-origins. nerdy", location: "Newport Beach", price: "$$", tag: "coffee", color: "orange", size: "medium" },
  { id: "c8", name: "Sidecar Doughnuts", note: "matcha latte + huckleberry donut", location: "Costa Mesa", price: "$", tag: "bakery", color: "pink", size: "small" },
  { id: "c9", name: "Kit Coffee", note: "surf vibes, solid espresso", location: "Costa Mesa", price: "$", tag: "coffee", color: "yellow", size: "small" },
  { id: "c10", name: "Neat Coffee", note: "minimalist. espresso is dialed.", location: "Corona del Mar", price: "$", tag: "coffee", color: "orange", size: "medium" },
  { id: "c11", name: "Kei Concepts", note: "vietnamese-inspired drinks", location: "Santa Ana", price: "$", tag: "fusion", color: "purple", size: "small" },
  { id: "c12", name: "Daydrift", note: "chill vibes, matcha is solid", location: "Los Angeles", price: "$$", tag: "matcha", color: "blue", size: "medium" },
];

export const foodRecs: Rec[] = [
  { id: "f1", name: "Taco Maria", note: "elevated mexican. michelin recognized", location: "Costa Mesa", price: "$$$", tag: "fine dining", starred: true, color: "orange", size: "large" },
  { id: "f2", name: "MOSU", note: "korean kaiseki. art on a plate", location: "Irvine", price: "$$$", tag: "korean", starred: true, color: "purple", size: "large" },
  { id: "f3", name: "Marufuku Ramen", note: "hakata-style tonkotsu. perfect", location: "Irvine", price: "$$", tag: "ramen", starred: true, color: "yellow", size: "medium" },
  { id: "f4", name: "Brodard", note: "nem nuong cuon. legendary", location: "Garden Grove", price: "$", tag: "vietnamese", starred: true, color: "green", size: "large" },
  { id: "f5", name: "Nep Cafe", note: "modern viet. plating is gorgeous", location: "Fountain Valley", price: "$$", tag: "vietnamese", color: "green", size: "medium" },
  { id: "f6", name: "Ospi", note: "italian coastal. handmade pasta", location: "Newport Beach", price: "$$$", tag: "italian", color: "pink", size: "medium" },
  { id: "f7", name: "Chubby Cattle", note: "hot pot + wagyu. always a move", location: "Irvine", price: "$$$", tag: "hot pot", color: "orange", size: "small" },
  { id: "f8", name: "Bear Flag Fish Co", note: "fresh poke, fish tacos", location: "Newport Beach", price: "$", tag: "seafood", color: "blue", size: "small" },
  { id: "f9", name: "85C Bakery", note: "taiwanese bakery. sea salt coffee", location: "Irvine", price: "$", tag: "bakery", color: "pink", size: "small" },
  { id: "f10", name: "Din Tai Fung", note: "soup dumplings. consistently perfect", location: "Costa Mesa", price: "$$", tag: "taiwanese", color: "yellow", size: "medium" },
];
