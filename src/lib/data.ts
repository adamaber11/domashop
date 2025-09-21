
import type { Product } from './types';

export const specialCategories = [
    { name: "Offers (العروض)", slug: "offers" },
];

export const mainCategories = [
    { name: "Makeup (مكياج)", slug: "makeup" },
    { name: "Skincare (عناية بالبشرة)", slug: "skincare" },
    { name: "Accessories (إكسسوارات)", slug: "accessories" },
    { name: "Clothing (ملابس)", slug: "clothing" },
    { name: "Bags (شنط)", slug: "bags" },
    { name: "Shoes (أحذية)", slug: "shoes" },
    { name: "Handmade (هاند ميد)", slug: "handmade" },
];


export const allCategories = [...mainCategories.map(c => c.name), ...specialCategories.map(c => c.name)].sort();


// This is mock data for seeding the database.
// The `imageUrls` and `imageHint` properties will be ignored here,
// as they are now sourced from `placeholder-images.json` in the seed script.
export const products: Omit<Product, 'reviewCount' | 'averageRating' | 'imageUrls' | 'imageHint'>[] = [
  {
    id: 'prod_001',
    name: 'Vintage Film Camera',
    description: 'Capture timeless moments with this classic 35mm film camera. Features manual controls for a truly authentic photography experience. Perfect for both beginners and seasoned photographers.',
    price: 175.00,
    category: 'Accessories (إكسسوارات)',
    stock: 10,
    reviews: [
      { id: 'rev_001', author: 'Alex D.', rating: 5, text: 'Absolutely love the nostalgic feel of the photos!', date: '2023-05-20' },
      { id: 'rev_002', author: 'Ben C.', rating: 4, text: 'A bit of a learning curve, but worth it for the quality.', date: '2023-06-11' },
    ],
  },
  {
    id: 'prod_002',
    name: 'Bliss Wireless Headphones',
    description: 'Immerse yourself in crystal-clear audio with these noise-cancelling wireless headphones. Boasting a 30-hour battery life and plush earcups for all-day comfort.',
    price: 129.99,
    onSale: true,
    salePrice: 99.99,
    category: 'Accessories (إكسسوارات)',
    stock: 25,
    reviews: [
      { id: 'rev_003', author: 'Chloe M.', rating: 5, text: 'The noise cancellation is a game changer for my commute.', date: '2023-07-01' },
      { id: 'rev_004', author: 'David S.', rating: 4, text: 'Great sound, but the fit is a little snug.', date: '2023-07-05' },
      { id: 'rev_005', author: 'Emily F.', rating: 5, text: 'Battery lasts forever! Highly recommend.', date: '2023-08-15' },
    ],
  },
  {
    id: 'prod_003',
    name: 'Handcrafted Ceramic Mug',
    description: 'Enjoy your favorite beverage in this unique, handcrafted ceramic mug. Each mug is one-of-a-kind, featuring a beautiful glaze and a comfortable, sturdy handle.',
    price: 28.50,
    category: 'Handmade (هاند ميد)',
    stock: 50,
    reviews: [
      { id: 'rev_006', author: 'Frank G.', rating: 5, text: 'My new favorite mug for morning coffee. It\'s a work of art.', date: '2023-09-10' },
    ],
  },
  {
    id: 'prod_004',
    name: 'Classic Leather Journal',
    description: 'A beautiful, rustic leather-bound journal for your thoughts, sketches, and notes. Contains 200 pages of high-quality, acid-free paper that\'s perfect for any pen.',
    price: 35.00,
    category: 'Handmade (هاند ميد)',
    stock: 0,
    reviews: [
      { id: 'rev_007', author: 'Grace H.', rating: 5, text: 'The leather is so soft and smells amazing. A joy to write in.', date: '2023-03-12' },
      { id: 'rev_008', author: 'Henry I.', rating: 3, text: 'Paper is a bit thin for fountain pens, but otherwise nice.', date: '2023-04-02' },
    ],
  },
  {
    id: 'prod_005',
    name: 'Aura Smart Watch',
    description: 'Stay connected and track your fitness goals with the Aura Smart Watch. Features a vibrant AMOLED display, heart rate monitoring, and seamless smartphone integration.',
    price: 249.00,
    onSale: true,
    salePrice: 199.00,
    category: 'Accessories (إكسسوارات)',
    stock: 18,
    reviews: [
      { id: 'rev_009', author: 'Ivy J.', rating: 4, text: 'Does everything I need it to. Wish the battery life was a bit longer.', date: '2023-10-22' },
      { id: 'rev_010', author: 'Jack K.', rating: 5, text: 'Sleek design and the fitness tracking is very accurate.', date: '2023-11-01' },
    ],
  },
  {
    id: 'prod_006',
    name: 'Eco-Friendly Yoga Mat',
    description: 'Find your zen on this eco-friendly yoga mat, made from natural tree rubber. Provides excellent grip and cushioning for your practice, while being kind to the planet.',
    price: 65.00,
    category: 'Skincare (عناية بالبشرة)',
    stock: 30,
    reviews: [
      { id: 'rev_011', author: 'Karen L.', rating: 5, text: 'No slipping at all, even in hot yoga. Fantastic mat!', date: '2023-08-30' },
      { id: 'rev_012', author: 'Leo M.', rating: 2, text: 'Has a strong rubber smell that won\'t go away.', date: '2023-09-05' },
    ],
  },
  {
    id: 'prod_007',
    name: 'Gourmet Morning Coffee',
    description: 'Start your day with this medium-roast gourmet coffee. A balanced blend of beans from South America with notes of chocolate and citrus. Whole bean, 12oz bag.',
    price: 18.99,
    category: 'Handmade (هاند ميد)',
    stock: 100,
    reviews: [
      { id: 'rev_013', author: 'Mia N.', rating: 5, text: 'Smooth, rich, and not bitter. My new go-to coffee.', date: '2024-01-15' },
      { id: 'rev_014', author: 'Noah O.', rating: 5, text: 'The best coffee I have ever made at home.', date: '2024-01-20' },
    ],
  },
  {
    id: 'prod_008',
    name: 'Momentum Running Shoes',
    description: 'Lightweight and responsive, the Momentum running shoes are built for speed and comfort. The breathable mesh upper and cushioned sole make them ideal for road running.',
    price: 130.00,
    onSale: true,
    salePrice: 109.99,
    category: 'Shoes (أحذية)',
    stock: 40,
    reviews: [
      { id: 'rev_015', author: 'Olivia P.', rating: 4, text: 'Very comfortable, but they run a half size small.', date: '2023-12-10' },
      { id: 'rev_016', author: 'Peter Q.', rating: 5, text: 'Like running on clouds. Great support for my long runs.', date: '2023-12-18' },
    ],
  },
  {
    id: 'prod_009',
    name: 'Minimalist Succulent Plant',
    description: 'Add a touch of green to your space with this easy-to-care-for succulent. Comes in a stylish, minimalist ceramic pot that fits any decor.',
    price: 22.00,
    category: 'Handmade (هاند ميد)',
    stock: 8,
    reviews: [
        { id: 'rev_017', author: 'Quinn R.', rating: 5, text: 'Arrived in perfect condition and looks great on my desk.', date: '2024-02-01' },
    ]
  },
  {
    id: 'prod_010',
    name: 'Elegant Fountain Pen',
    description: 'Experience the art of writing with this elegant fountain pen. Features a smooth-writing gold nib and a balanced body for comfortable use. A timeless gift for any writer.',
    price: 85.00,
    category: 'Handmade (هاند ميد)',
    stock: 12,
    reviews: [
        { id: 'rev_018', author: 'Rachel S.', rating: 1, text: 'It leaked ink all over my bag. Very disappointed.', date: '2023-11-11' },
        { id: 'rev_019', author: 'Sam T.', rating: 5, text: 'A beautiful and functional pen. Writing with it is a dream.', date: '2023-11-25' },
    ]
  },
  {
    id: 'prod_011',
    name: 'Cozy Wool Scarf',
    description: 'Stay warm in style with this incredibly soft and cozy wool scarf. The classic plaid pattern and high-quality fabric make it a winter essential.',
    price: 45.00,
    category: 'Clothing (ملابس)',
    stock: 60,
    reviews: [
        { id: 'rev_020', author: 'Tina U.', rating: 5, text: 'So warm and not itchy at all! I\'ve worn it every day.', date: '2023-12-01' },
    ]
  },
  {
    id: 'prod_012',
    name: 'Sonic Portable Speaker',
    description: 'Take your music anywhere with the Sonic portable Bluetooth speaker. Delivers impressive sound from a compact, water-resistant design. 15-hour battery life.',
    price: 59.99,
    category: 'Accessories (إكسسوارات)',
    stock: 3,
    reviews: [
        { id: 'rev_021', author: 'Uma V.', rating: 3, text: 'Sound quality is just okay. Good for the price, I guess.', date: '2024-01-05' },
        { id: 'rev_022', author: 'Victor W.', rating: 5, text: 'Surprisingly powerful for its size. The battery is great.', date: '2024-01-10' },
    ]
  }
].map(p => ({ ...p, reviews: p.reviews || [] }));

    