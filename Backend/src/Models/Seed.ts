import mongoose from "mongoose";
import { Product } from "./schema.products.ts";

export const ProductCategory = {
  GAME: "Game",
  ACCESSORY: "Accessories",
} as const;

// Create a type from the object values
export type ProductCategoryType = typeof ProductCategory[keyof typeof ProductCategory];

export interface IProduct {
  title: string;
  description: string;
  image: string;
  price: number;
  isAvailable: boolean;
  category: ProductCategoryType;
  stock: number;
  details: [
    {
      gameType: string;
      preOrder: boolean;
      preOrderReleaseDate?: Date | null;
      platform: string;
      brand: string;
    }
  ];
}

// Seed data array based on provided images
export const seedProducts: Partial<IProduct>[] = [
  {
    title: "Uncharted 5 (Rumored)",
    description: "The next highly anticipated installment in the acclaimed action-adventure franchise.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439171/UNCHARTED_5_cuvrdt.jpg",
    price: 69.99,
    isAvailable: false,
    category: ProductCategory.GAME,
    stock: 0,
    details: [
      {
        gameType: "Action-Adventure",
        preOrder: true,
        preOrderReleaseDate: new Date("2026-11-15T00:00:00.000Z"),
        platform: "PlayStation 5",
        brand: "Naughty Dog",
      },
    ],
  },
  {
    title: "The Witcher 3: Wild Hunt - Complete Edition",
    description: "Experience the epic RPG masterpiece, now fully enhanced for the next generation.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439170/The_Witcher_3__Wild_Hunt_Complete_Edition_Playstation_5_pjtbus.jpg",
    price: 39.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 50,
    details: [
      {
        gameType: "RPG",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "CD Projekt Red",
      },
    ],
  },
  {
    title: "The Last of Us Part I",
    description: "Revisit the beloved classic, completely rebuilt from the ground up for the PS5 console.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439169/The_Last_of_Us_Part_1_PS5_nfbgvj.jpg",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 25,
    details: [
      {
        gameType: "Action-Adventure",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Naughty Dog",
      },
    ],
  },
  {
    title: "Tekken 8",
    description: "The legendary fighting game franchise returns with stunning new graphics and fierce battles.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439168/tekken_8_zaxbkl.jpg",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 40,
    details: [
      {
        gameType: "Fighting",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Bandai Namco",
      },
    ],
  },
  {
    title: "Marvel's Spider-Man 2",
    description: "Swing through Marvel's New York as both Peter Parker and Miles Morales in this epic sequel.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439167/Spider-Man_2_PS5_k3pobv.jpg",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 60,
    details: [
      {
        gameType: "Action-Adventure",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Insomniac Games",
      },
    ],
  },
  {
    title: "Resident Evil: Requiem",
    description: "Face new horrors in the latest chilling entry of the iconic survival horror series.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439165/RESIDENT_EVIL_REQUIEM_2026_PLAYSTATION_5_gtgmc5.jpg",
    price: 69.99,
    isAvailable: false,
    category: ProductCategory.GAME,
    stock: 0,
    details: [
      {
        gameType: "Survival Horror",
        preOrder: true,
        preOrderReleaseDate: new Date("2026-10-31T00:00:00.000Z"),
        platform: "PlayStation 5",
        brand: "Capcom",
      },
    ],
  },
  {
    title: "Astro Bot",
    description: "Join Astro on a massive new, super-sized space adventure.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439163/PlayStation_Astro_Bot_Adventure_Game_-_PlayStation_5_-_Walmart_com_avht9v.jpg",
    price: 59.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 35,
    details: [
      {
        gameType: "Platformer",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Team Asobi",
      },
    ],
  },
  {
    title: "Mortal Kombat 1 - Premium Edition",
    description: "It's In Our Blood. Discover a reborn Mortal Kombat Universe created by the Fire God Liu Kang.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439162/Mortal_Kombat_1_Premium_Edition_PlayStation5___Must_Play_oi126q.jpg",
    price: 109.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 15,
    details: [
      {
        gameType: "Fighting",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "NetherRealm Studios",
      },
    ],
  },
  {
    title: "Minecraft (PS5 Compatible)",
    description: "Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439161/Minecraft_-_Compatible_for_PS5_-_UK_PAL_qdlion.jpg",
    price: 29.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 100,
    details: [
      {
        gameType: "Sandbox/Survival",
        preOrder: false,
        platform: "PlayStation 4 / PlayStation 5",
        brand: "Mojang Studios",
      },
    ],
  },
  {
    title: "It Takes Two",
    description: "Embark on the craziest journey of your life in It Takes Two, a genre-bending platform adventure created purely for co-op.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439160/IT_TAKES_TWO_-_inkl__kostenloser_Update_auf_PS5_Version_-_Playstation_4_-_Import_allemand_lflzaa.jpg",
    price: 39.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 45,
    details: [
      {
        gameType: "Co-op Action-Adventure",
        preOrder: false,
        platform: "PlayStation 4 / PlayStation 5",
        brand: "Hazelight Studios",
      },
    ],
  },
  {
    title: "Hogwarts Legacy - Amazon Exclusive",
    description: "Experience Hogwarts in the 1800s. Your character is a student who holds the key to an ancient secret.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439159/Hogwarts_Legacy_PS5_Amazon_Exclusive_oxczxj.jpg",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 30,
    details: [
      {
        gameType: "Action RPG",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Avalanche Software",
      },
    ],
  },
  {
    title: "Grand Theft Auto VI",
    description: "Welcome to Leonida. The highly anticipated next chapter in the Grand Theft Auto series.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439158/GTA6_ffyimt.jpg",
    price: 79.99,
    isAvailable: false,
    category: ProductCategory.GAME,
    stock: 0,
    details: [
      {
        gameType: "Action-Adventure",
        preOrder: true,
        preOrderReleaseDate: new Date("2025-11-01T00:00:00.000Z"),
        platform: "PlayStation 5",
        brand: "Rockstar Games",
      },
    ],
  },
  {
    title: "Ghost of Tsushima Director's Cut",
    description: "Uncover the hidden wonders of Tsushima in this open-world action adventure.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439157/ghost_cvkexp.jpg",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 40,
    details: [
      {
        gameType: "Action-Adventure",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Sucker Punch Productions",
      },
    ],
  },
  {
    title: "Fortnite (Physical Bundle)",
    description: "The action building game where you team up with other players to build massive forts and battle against hordes of monsters.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439156/fortnite_qquxh8.jpg",
    price: 19.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 80,
    details: [
      {
        gameType: "Battle Royale",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Epic Games",
      },
    ],
  },
  {
    title: "Elden Ring",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439155/eldenring_fmzk9s.jpg",
    price: 59.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 55,
    details: [
      {
        gameType: "Action RPG",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "FromSoftware",
      },
    ],
  },
  {
    title: "EA SPORTS F1 24 - Standard Edition",
    description: "Get closer to the grid like never before with EA SPORTS F1 24, the official videogame of the 2024 FIA Formula One World Championship.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439154/EA_SPORTS_F1_24_Standard_Edition_PS5___VideoGame_pttcux.jpg",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 20,
    details: [
      {
        gameType: "Racing Simulator",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "EA Sports",
      },
    ],
  },
  {
    title: "Cyberpunk 2077",
    description: "An open-world, action-adventure RPG set in the dark future of Night City.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439153/Cyberpunk_2077_is_second_biggest_retail_launch_of_2020_Games_charts_12_December_hb5aqs.jpg",
    price: 29.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 65,
    details: [
      {
        gameType: "Action RPG",
        preOrder: false,
        platform: "PlayStation 4 / PlayStation 5",
        brand: "CD Projekt Red",
      },
    ],
  },
  {
    title: "Call of Duty: Modern Warfare III",
    description: "Captain Price and Task Force 141 face off against the ultimate threat.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439152/Call_of_Duty___Modern_Warfare_III_-PS5_etb11o.jpg",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 40,
    details: [
      {
        gameType: "First-Person Shooter",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Activision",
      },
    ],
  },
  {
    title: "Call of Duty: Modern Warfare II",
    description: "Welcome to the new era of Call of Duty.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439151/Call_of_Duty__Modern_Warfare_II_-_PS5_-_Playstation_5_-_Import_Region_Free_luipa4.jpg",
    price: 49.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 30,
    details: [
      {
        gameType: "First-Person Shooter",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Activision",
      },
    ],
  },
  {
    title: "Black Myth: Wukong",
    description: "An action RPG rooted in Chinese mythology. The story is based on Journey to the West, one of the Four Great Classical Novels of Chinese literature.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439150/Black_Myth_j6lwq9.jpg",
    price: 59.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 50,
    details: [
      {
        gameType: "Action RPG",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Game Science",
      },
    ],
  },
  {
    title: "Battlefield 2042",
    description: "A first-person shooter that marks the return to the iconic all-out warfare of the franchise.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439150/Battlefield_c3nm3g.jpg",
    price: 19.99,
    isAvailable: true,
    category: ProductCategory.GAME,
    stock: 25,
    details: [
      {
        gameType: "First-Person Shooter",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Electronic Arts",
      },
    ],
  },

  // --- ACCESSORIES ---
  {
    title: "Xbox Series X Console",
    description: "The fastest, most powerful Xbox ever.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439327/XBOX_Series_X___XBOX_jhzwma.jpg",
    price: 499.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 15,
    details: [
      {
        gameType: "Hardware",
        preOrder: false,
        platform: "Xbox Series X",
        brand: "Microsoft",
      },
    ],
  },
  {
    title: "Pre-Owned Xbox 360 4GB Slim Console",
    description: "Classic gaming console, tested and working.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439326/Pre-Owned_Microsoft_Xbox_360_4GB_Slim_Console_Good_-_Walmart_com_nrewyf.jpg",
    price: 89.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 5,
    details: [
      {
        gameType: "Hardware",
        preOrder: false,
        platform: "Xbox 360",
        brand: "Microsoft",
      },
    ],
  },
  {
    title: "Xbox Wireless Controller - Carbon Black",
    description: "Experience the modernized design of the Xbox Wireless Controller, featuring sculpted surfaces and refined geometry for enhanced comfort during gameplay.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439325/https___amzn_to_3Vcviqc_xbox_xboxgames_b7m2qv.jpg",
    price: 59.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 45,
    details: [
      {
        gameType: "Peripheral",
        preOrder: false,
        platform: "Xbox Series X|S, PC",
        brand: "Microsoft",
      },
    ],
  },
  {
    title: "PlayStation 5 Console - Black Edition (Custom Shell)",
    description: "Customized matte black faceplates for your PS5 console.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439302/PS5_BLACK_EDITION_not_real_ubz4ly.jpg",
    price: 54.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 20,
    details: [
      {
        gameType: "Hardware Accessory",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Third Party",
      },
    ],
  },
  {
    title: "DualSense Wireless Controller - White",
    description: "Discover a deeper, highly immersive gaming experience that brings the action to life in the palms of your hands.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439300/controller_ouri14.png",
    price: 69.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 60,
    details: [
      {
        gameType: "Peripheral",
        preOrder: false,
        platform: "PlayStation 5",
        brand: "Sony",
      },
    ],
  },
  {
    title: "Custom Pro Gaming Controller",
    description: "Professional grade controller with customizable back paddles and trigger stops.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439299/587579082681733104_n95dev.jpg",
    price: 149.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 10,
    details: [
      {
        gameType: "Peripheral",
        preOrder: false,
        platform: "Multi-platform",
        brand: "Custom",
      },
    ],
  },
  {
    title: "MSI GTX 1050 Ti GAMING X 4GB",
    description: "Entry-level graphics card for budget PC builds.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439271/The_gtx_1050_ti_gaming_X_4gb_Factory_overclocked_dnkygw.jpg",
    price: 129.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 8,
    details: [
      {
        gameType: "PC Component",
        preOrder: false,
        platform: "PC",
        brand: "MSI",
      },
    ],
  },
  {
    title: "Gigabyte RTX 3050 WINDFORCE OC V2 8GB",
    description: "Solid 1080p gaming performance with ray tracing capabilities.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439270/Gigabyte_Rtx3050_Windforce_Oc_V2_8gb_Gddr6_Hdmi_Dp_Dvi_mfiv7t.jpg",
    price: 249.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 12,
    details: [
      {
        gameType: "PC Component",
        preOrder: false,
        platform: "PC",
        brand: "Gigabyte",
      },
    ],
  },
  {
    title: "ASUS Radeon RX 9070 XT TUF GAMING OC",
    description: "High-end AMD graphics card for ultimate 4K gaming.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439268/ASUS_Radeon_RX_9070_XT_TUF_GAMING_OC_Grafikkarte_grau_RDNA4_GDDR6_3x_DisplayPort_1x_HDMI_2_1_wpjshb.jpg",
    price: 899.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 5,
    details: [
      {
        gameType: "PC Component",
        preOrder: false,
        platform: "PC",
        brand: "ASUS",
      },
    ],
  },
  {
    title: "ASUS NVIDIA GeForce RTX 5090 (Rumored/Concept)",
    description: "The next generation of flagship PC graphics.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439267/ASUS_NVIDIA_GeForce_RTX_5090_xaj4yb.jpg",
    price: 1999.99,
    isAvailable: false,
    category: ProductCategory.ACCESSORY,
    stock: 0,
    details: [
      {
        gameType: "PC Component",
        preOrder: true,
        preOrderReleaseDate: new Date("2026-12-01T00:00:00.000Z"),
        platform: "PC",
        brand: "ASUS / NVIDIA",
      },
    ],
  },
  {
    title: "G9000 Stereo Gaming Headset",
    description: "Comfortable over-ear headset with noise-canceling mic and LED lights.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439220/Spbpqy_G9000_Stereo_Gaming_Headsets_for_PC_P4_P5_Controller_Noise_Cancelling_Over_Ear_Headphones_with_Mic_LED_Light_Bass_Surround_Soft_Memory_Earmuffs_Blue_Size_2_in_Black_oajcrf.jpg",
    price: 29.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 50,
    details: [
      {
        gameType: "Peripheral",
        preOrder: false,
        platform: "Multi-platform",
        brand: "Generic",
      },
    ],
  },
  {
    title: "CORSAIR Vengeance RGB DDR5 RAM 64GB (2x32GB)",
    description: "High-performance memory for your next PC build.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439219/CORSAIR_Vengeance_RGB_DDR5_RAM_64GB_2x32GB_Up_to_6000MHz_CL30_AMD_EXPO_iCUE_Compatible_Computer_Memory_-_Gray_CMH64GX5M2B6000Z30_nix5ev.jpg",
    price: 219.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 20,
    details: [
      {
        gameType: "PC Component",
        preOrder: false,
        platform: "PC",
        brand: "Corsair",
      },
    ],
  },
  {
    title: "ASUS ROG Cetra True Wireless Gaming Headphones",
    description: "Low-latency wireless audio designed for gaming on the go.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439218/ASUS_ROG_Cetra_True_Wireless_Gaming_Headphones_iizj0u.jpg",
    price: 99.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 30,
    details: [
      {
        gameType: "Peripheral",
        preOrder: false,
        platform: "Mobile / PC / Switch",
        brand: "ASUS ROG",
      },
    ],
  },
  {
    title: "RGB Gaming Microphone Kit",
    description: "Professional audio setup for streaming and podcasting with vibrant RGB lighting.",
    image: "https://res.cloudinary.com/dvxvnu3pk/image/upload/v1784439215/_RGB_Gaming_Mic_Kit__Streaming_Podcasting_Pro_Audio_____Joystick_Junkies_qgtkpf.jpg",
    price: 79.99,
    isAvailable: true,
    category: ProductCategory.ACCESSORY,
    stock: 25,
    details: [
      {
        gameType: "Streaming Gear",
        preOrder: false,
        platform: "PC / Mac",
        brand: "Joystick Junkies",
      },
    ],
  },
];

// Function to seed the database
export const seedDatabase = async () => {
  try {
    // Check if we have a connection URI
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/GameVault";
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
       console.log("Connecting to MongoDB...");
       await mongoose.connect(MONGODB_URI);
       console.log("Connected to MongoDB.");
    }

    console.log("Clearing existing products...");
    await Product.deleteMany({});
    
    console.log(`Seeding ${seedProducts.length} products...`);
    await Product.insertMany(seedProducts);
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
     if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
     }
  }
};

  seedDatabase();