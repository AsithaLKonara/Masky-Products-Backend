import prisma from '../src/config/prisma';
import { invalidateCache } from '../src/utils/cache.util';

interface ProductSeed {
  name: string;
  slug: string;
  barcode: string;
  categorySlug: string;
  excerpt: string;
  description: string;
  featuredImage: string;
  variants: {
    name: string;
    sku: string;
    barcode: string;
    price: number;
    salePrice?: number;
    size: string;
    color?: string;
    quantity: number;
    featuredImage: string;
  }[];
}

const CATEGORIES_DATA = [
  {
    name: 'Fresh mushrooms product',
    slug: 'fresh-mushrooms-product',
    description: 'Farm-fresh organic mushrooms harvested daily from pristine climate-controlled growing chambers in Sri Lanka.',
    imageUrl: '/products/fresh-oyster-mushrooms-200g.jpg',
    status: 'Active',
  },
  {
    name: 'Dehydrated product',
    slug: 'dehydrated-product',
    description: 'Gently slow-cured dehydrated mushrooms and botanical powders retaining intense umami, beta-glucans, and extended 12-month pantry longevity.',
    imageUrl: '/products/dehydrated-oyster-mushroom.jpg',
    status: 'Active',
  },
  {
    name: 'Redy to eat product',
    slug: 'redy-to-eat-product',
    description: 'Gourmet Sri Lankan chili pastes, sauces, and culinary condiments prepared from whole fresh oyster mushrooms with zero preservatives.',
    imageUrl: '/products/mushroom-chili-paste-jar-200g.jpg',
    status: 'Active',
  },
  {
    name: 'Frezon product',
    slug: 'frezon-product',
    description: 'Individually quick-frozen (IQF) fresh gourmet mushrooms retaining harvest-morning texture and moisture for culinary kitchens.',
    imageUrl: '/products/frozen-oyster-mushrooms-200g.jpg',
    status: 'Active',
  },
];

const PRODUCTS_DATA: ProductSeed[] = [
  {
    name: 'Fresh Oyster Mushrooms 200g (නැවුම් බිම්මල්)',
    slug: 'fresh-oyster-mushrooms-200g',
    barcode: '793573000001',
    categorySlug: 'fresh-mushrooms-product',
    excerpt: '100% natural, farm-fresh oyster mushrooms harvested daily in Dehiattakandiya, Sri Lanka.',
    description: '<p>Hand-picked daily from our hygienic cultivation chambers in Dehiattakandiya, Sri Lanka. 100% natural and free of chemical pesticides, fertilizers, or growth hormones. Packed with plant-based protein, dietary fiber, potassium, and essential vitamins for clean, wholesome daily nutrition.</p><p><strong>Storage & Care:</strong> Keep refrigerated at 2°C–5°C. Best consumed within 5–7 days of harvest.</p>',
    featuredImage: '/products/fresh-oyster-mushrooms-200g.jpg',
    variants: [
      {
        name: '200g Fresh Pack',
        sku: 'MSK-FSH-OYST-200G',
        barcode: '793573000001-1',
        price: 350,
        size: '200g',
        color: 'Natural',
        quantity: 120,
        featuredImage: '/products/fresh-oyster-mushrooms-200g.jpg',
      },
    ],
  },
  {
    name: 'Dehydrated Oyster Mushroom (වියළි බිම්මල්)',
    slug: 'dehydrated-oyster-mushroom',
    barcode: '793573000002',
    categorySlug: 'dehydrated-product',
    excerpt: 'Artisan low-temperature dried oyster mushrooms in a resealable moisture-barrier kraft pouch.',
    description: '<p>Crafted from premium farm-fresh oyster mushrooms gently dried at controlled low temperatures. This traditional slow cure locks in dense earthy umami, beta-glucans, and protein while achieving an exceptional 12-month ambient shelf life.</p><p><strong>Culinary Use:</strong> Rehydrate in lukewarm water or broth for 10–15 minutes. Use the soaking liquor as concentrated liquid umami stock for soups, gravies, noodles, curries, and risottos.</p><p><strong>Ingredients:</strong> 100% Pure Organic Dehydrated Oyster Mushroom (Pleurotus ostreatus). Zero preservatives or chemicals.</p>',
    featuredImage: '/products/dehydrated-oyster-mushroom.jpg',
    variants: [
      {
        name: '100g Kraft Pouch',
        sku: 'MSK-DHY-OYST-100G',
        barcode: '793573000002-1',
        price: 850,
        salePrice: 790,
        size: '100g',
        color: 'Natural',
        quantity: 150,
        featuredImage: '/products/dehydrated-oyster-mushroom.jpg',
      },
      {
        name: '250g Family Pack',
        sku: 'MSK-DHY-OYST-250G',
        barcode: '793573000002-2',
        price: 1950,
        size: '250g',
        color: 'Natural',
        quantity: 80,
        featuredImage: '/products/dehydrated-oyster-mushroom.jpg',
      },
      {
        name: '500g Culinary Pack',
        sku: 'MSK-DHY-OYST-500G',
        barcode: '793573000002-3',
        price: 3600,
        size: '500g',
        color: 'Natural',
        quantity: 40,
        featuredImage: '/products/dehydrated-oyster-mushroom.jpg',
      },
    ],
  },
  {
    name: 'Dehydrated Abalone Mushroom (විජලනය කළ ඇබලෝන් බිම්මල්)',
    slug: 'dehydrated-abalone-mushroom',
    barcode: '793573000003',
    categorySlug: 'dehydrated-product',
    excerpt: 'Meaty textured dried abalone mushrooms with rich nutty flavor and intense savory profile.',
    description: '<p>Abalone mushrooms (Pleurotus cystidiosus) are celebrated for their remarkably thick, succulent, steak-like texture and deep savory flavor profile. Slowly dehydrated to preserve biological integrity and cellular structure.</p><p><strong>Culinary Pairing:</strong> Outstanding meat alternative for curries, hot-pots, stir-fries, and gourmet slow roasts. Rehydrates into thick, juicy florets within 15 minutes.</p><p><strong>Registration:</strong> MASKY PRODUCT (PVT) LTD — Registered Reg No: DD-1472.</p>',
    featuredImage: '/products/dehydrated-abalone-mushroom.jpg',
    variants: [
      {
        name: '100g Kraft Pouch',
        sku: 'MSK-DHY-ABAL-100G',
        barcode: '793573000003-1',
        price: 950,
        size: '100g',
        color: 'Natural',
        quantity: 110,
        featuredImage: '/products/dehydrated-abalone-mushroom.jpg',
      },
      {
        name: '250g Gourmet Pack',
        sku: 'MSK-DHY-ABAL-250G',
        barcode: '793573000003-2',
        price: 2200,
        size: '250g',
        color: 'Natural',
        quantity: 60,
        featuredImage: '/products/dehydrated-abalone-mushroom.jpg',
      },
    ],
  },
  {
    name: 'Dehydrated Oyster Mushroom Powder (විජලනය කළ ඔයිස්ටර් බිම්මල් පවුඩර්)',
    slug: 'dehydrated-oyster-mushroom-powder',
    barcode: '793573000004',
    categorySlug: 'dehydrated-product',
    excerpt: 'Pure micro-milled organic oyster mushroom powder for natural MSG-free seasoning and wellness drinks.',
    description: '<p>100% whole oyster mushrooms dehydrated and micro-milled into a silky, golden-tan culinary powder. The ultimate natural umami seasoning and nutritional booster with zero artificial flavor enhancers, salt, or fillers.</p><p><strong>How to Enjoy:</strong> Whisk into soups, broths, curry bases, omelettes, and sauces. Add 1 teaspoon to morning smoothies, porridge, or warm water for bio-active beta-glucan immune support.</p>',
    featuredImage: '/products/dehydrated-oyster-mushroom-powder.jpg',
    variants: [
      {
        name: '100g Pouch',
        sku: 'MSK-PWD-OYST-100G',
        barcode: '793573000004-1',
        price: 750,
        size: '100g',
        color: 'Natural',
        quantity: 180,
        featuredImage: '/products/dehydrated-oyster-mushroom-powder.jpg',
      },
      {
        name: '250g Pouch',
        sku: 'MSK-PWD-OYST-250G',
        barcode: '793573000004-2',
        price: 1650,
        size: '250g',
        color: 'Natural',
        quantity: 90,
        featuredImage: '/products/dehydrated-oyster-mushroom-powder.jpg',
      },
    ],
  },
  {
    name: 'Dehydrated Abalone Mushroom Powder (විජලනය කළ ඇබලෝන් බිම්මල් පවුඩර්)',
    slug: 'dehydrated-abalone-mushroom-powder',
    barcode: '793573000005',
    categorySlug: 'dehydrated-product',
    excerpt: 'Dense, savory botanical seasoning powder ground from whole sun-cured abalone mushrooms.',
    description: '<p>Artisan crafted from premium whole abalone mushrooms grown under certified hygienic conditions. Yields a deeply complex, earthy, savory flavor profile designed for gourmet cooking and therapeutic wellness.</p><p><strong>Usage:</strong> Perfect base for mushroom latte, savory broths, gourmet seasonings, and high-protein dietary enrichment.</p>',
    featuredImage: '/products/dehydrated-abalone-mushroom-powder.jpg',
    variants: [
      {
        name: '100g Pouch',
        sku: 'MSK-PWD-ABAL-100G',
        barcode: '793573000005-1',
        price: 850,
        size: '100g',
        color: 'Natural',
        quantity: 130,
        featuredImage: '/products/dehydrated-abalone-mushroom-powder.jpg',
      },
      {
        name: '200g Pouch',
        sku: 'MSK-PWD-ABAL-200G',
        barcode: '793573000005-2',
        price: 1550,
        size: '200g',
        color: 'Natural',
        quantity: 75,
        featuredImage: '/products/dehydrated-abalone-mushroom-powder.jpg',
      },
    ],
  },
  {
    name: 'Mushroom Chili Paste 200g Glass Jar',
    slug: 'mushroom-chili-paste-jar-200g',
    barcode: '793573000006',
    categorySlug: 'redy-to-eat-product',
    excerpt: 'Gourmet Sri Lankan chili paste crafted from fresh oyster mushrooms, slow-simmered in aromatic spices.',
    description: '<p>A masterclass in artisanal condiments. Freshly harvested oyster mushrooms are finely minced and slow-cooked with sun-dried red chilies, crushed garlic, shallots, and fragrant cold-pressed spices. 100% natural, vegetarian, and completely free of artificial preservatives, artificial colors, or MSG.</p><p><strong>Serving Suggestion:</strong> Irresistible with fragrant basmati fried rice, string hoppers, noodles, hot parottas, or as a savory dip.</p><p><strong>Ingredients:</strong> Fresh Oyster Mushrooms, Red Chilli, Shallots, Garlic, Vegetable Oil, Natural Sea Salt, Spice Blend.</p>',
    featuredImage: '/products/mushroom-chili-paste-jar-200g.jpg',
    variants: [
      {
        name: '200g Glass Jar',
        sku: 'MSK-RTE-CHLI-200G',
        barcode: '793573000006-1',
        price: 850,
        salePrice: 750,
        size: '200g',
        color: 'Spicy Red',
        quantity: 140,
        featuredImage: '/products/mushroom-chili-paste-jar-200g.jpg',
      },
    ],
  },
  {
    name: 'Mushroom Chilli Paste 80g Tub (බිම්මල් චිලි පේස්ට්)',
    slug: 'mushroom-chilli-paste-tub-80g',
    barcode: '793573000007',
    categorySlug: 'redy-to-eat-product',
    excerpt: 'Convenient single-serve table tub of homemade-quality mushroom chili paste.',
    description: '<p>All the rich umami and spicy aroma of Masky\'s signature oyster mushroom chili paste in an airtight, portable 80g tub. Perfect for daily family lunchboxes, office dining, and travel.</p><p><strong>Storage:</strong> Keep sealed in a cool place; keep refrigerated after opening.</p>',
    featuredImage: '/products/mushroom-chilli-paste-tub-80g.jpg',
    variants: [
      {
        name: '80g Round Tub',
        sku: 'MSK-RTE-CHLI-80G',
        barcode: '793573000007-1',
        price: 380,
        size: '80g',
        color: 'Spicy Red',
        quantity: 200,
        featuredImage: '/products/mushroom-chilli-paste-tub-80g.jpg',
      },
    ],
  },
  {
    name: 'Gourmet Mushroom Sauce Trio Pack',
    slug: 'mushroom-sauce-trio-pack',
    barcode: '793573000008',
    categorySlug: 'redy-to-eat-product',
    excerpt: 'Gift presentation box featuring Mild, Hot, and Classic artisan mushroom dipping sauces.',
    description: '<p>The ultimate botanical condiment collection from Masky Products. Features three distinct artisan recipes crafted from whole natural mushrooms:</p><ul><li><strong>Mild Mushroom Sauce (Golden Honey Tone):</strong> Smooth, mellow, and child-friendly with subtle earthy sweetness.</li><li><strong>Hot Mushroom Sauce (Spicy Red):</strong> Infused with fiery Ceylon red chilies for barbecue, meats, and devilled dishes.</li><li><strong>Classic Mushroom Sauce (Herbal Green):</strong> Packed with coriander, green chilies, and aromatic herbs for crisp table dipping.</li></ul><p>100% Natural Ingredients. No Artificial Colours. No Preservatives. Proudly Made in Sri Lanka.</p>',
    featuredImage: '/products/mushroom-sauce-trio-pack.jpg',
    variants: [
      {
        name: 'Trio Gift Box (3 x 350ml)',
        sku: 'MSK-RTE-SAUC-TRIO',
        barcode: '793573000008-1',
        price: 2450,
        salePrice: 2250,
        size: 'Trio Pack',
        color: 'Assorted',
        quantity: 65,
        featuredImage: '/products/mushroom-sauce-trio-pack.jpg',
      },
      {
        name: 'Mild Mushroom Sauce (350ml)',
        sku: 'MSK-RTE-SAUC-MILD',
        barcode: '793573000008-2',
        price: 850,
        size: '350ml',
        color: 'Mild Gold',
        quantity: 90,
        featuredImage: '/products/mushroom-sauce-trio-pack.jpg',
      },
      {
        name: 'Hot Mushroom Sauce (350ml)',
        sku: 'MSK-RTE-SAUC-HOT',
        barcode: '793573000008-3',
        price: 850,
        size: '350ml',
        color: 'Spicy Red',
        quantity: 90,
        featuredImage: '/products/mushroom-sauce-trio-pack.jpg',
      },
      {
        name: 'Classic Mushroom Sauce (350ml)',
        sku: 'MSK-RTE-SAUC-CLAS',
        barcode: '793573000008-4',
        price: 850,
        size: '350ml',
        color: 'Herbal Green',
        quantity: 90,
        featuredImage: '/products/mushroom-sauce-trio-pack.jpg',
      },
    ],
  },
  {
    name: 'Frozen Fresh Oyster Mushrooms 200g (IQF)',
    slug: 'frozen-fresh-oyster-mushrooms-200g',
    barcode: '793573000009',
    categorySlug: 'frezon-product',
    excerpt: 'Individually quick-frozen (IQF) fresh oyster mushrooms locking in garden-fresh moisture and texture.',
    description: '<p>Harvested at peak tenderness, cleaned, blanched, and blast-frozen at -40°C using Individually Quick Frozen (IQF) food preservation technology. Defrosts with identical moisture, texture, and flavor as harvest morning without becoming soggy or mushy.</p><p><strong>Storage:</strong> Store frozen at -18°C. Shelf life 6 months from packaging.</p>',
    featuredImage: '/products/frozen-oyster-mushrooms-200g.jpg',
    variants: [
      {
        name: '200g IQF Pack',
        sku: 'MSK-FRZ-OYST-200G',
        barcode: '793573000009-1',
        price: 380,
        size: '200g',
        color: 'Natural',
        quantity: 80,
        featuredImage: '/products/frozen-oyster-mushrooms-200g.jpg',
      },
    ],
  },
];

async function seedProducts() {
  console.log('🌱 Starting Masky Products & Category Images Seed...');

  // 1. Get Main Branch for inventory link
  const mainBranch = await prisma.branch.findFirst({
    where: { OR: [{ code: 'MAIN' }, { name: { contains: 'Main', mode: 'insensitive' } }] },
  });
  const branchId = mainBranch?.id;
  console.log(`📍 Main Branch: ${mainBranch?.name} (${branchId})`);

  // 2. Upsert the 4 Official Categories with their matching real product images
  console.log('📦 Updating Official Product Categories with real product images...');
  const categoryMap = new Map<string, string>();

  for (const cat of CATEGORIES_DATA) {
    const updated = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        status: 'Active',
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        status: 'Active',
      },
    });
    categoryMap.set(cat.slug, updated.id);
    console.log(`  ✓ Category: "${updated.name}" -> Image: ${updated.imageUrl}`);
  }

  // 3. Mark old mock apparel products as ARCHIVED so they are not shown anywhere
  console.log('🧹 Archiving legacy mock apparel products...');
  const oldApparelSlugs = [
    'signature-oversized-heavyweight-tee',
    'relaxed-oxford-linen-button-down',
    'classic-slim-fit-japanese-selvedge-denim',
    'minimalist-french-terry-zip-hoodie',
    'pleated-silk-blend-slip-midi-dress',
    'handcrafted-tuscan-leather-dress-belt',
    'sample-product',
  ];

  await prisma.product.updateMany({
    where: {
      OR: [
        { slug: { in: oldApparelSlugs } },
        { name: { contains: 'Tee', mode: 'insensitive' } },
        { name: { contains: 'Denim', mode: 'insensitive' } },
        { name: { contains: 'Hoodie', mode: 'insensitive' } },
        { name: { contains: 'Dress', mode: 'insensitive' } },
        { name: { contains: 'Belt', mode: 'insensitive' } },
      ],
    },
    data: {
      status: 'ARCHIVED',
      categoryId: null,
    },
  });
  console.log('  ✓ Old mock apparel products archived.');

  // 4. Seed the 9 real mushroom products
  console.log('🍄 Seeding Real Masky Mushroom Products...');
  const createdProductIds: string[] = [];

  for (const p of PRODUCTS_DATA) {
    const categoryId = categoryMap.get(p.categorySlug);

    // Upsert product
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        barcode: p.barcode,
        excerpt: p.excerpt,
        description: p.description,
        categoryId: categoryId || null,
        status: 'ACTIVE',
      },
      create: {
        name: p.name,
        slug: p.slug,
        barcode: p.barcode,
        excerpt: p.excerpt,
        description: p.description,
        categoryId: categoryId || null,
        status: 'ACTIVE',
      },
    });

    createdProductIds.push(product.id);
    console.log(`  ✓ Product created/updated: ${product.name} (${product.slug})`);

    // Create/update variants
    for (const v of p.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          name: v.name,
          price: v.price,
          salePrice: v.salePrice || null,
          size: v.size,
          color: v.color || 'Natural',
          stockStatus: 'instock',
          quantity: v.quantity,
          featuredImage: v.featuredImage,
          gallery: [v.featuredImage],
          barcode: v.barcode,
          productId: product.id,
        },
        create: {
          productId: product.id,
          name: v.name,
          sku: v.sku,
          barcode: v.barcode,
          price: v.price,
          salePrice: v.salePrice || null,
          size: v.size,
          color: v.color || 'Natural',
          stockStatus: 'instock',
          quantity: v.quantity,
          featuredImage: v.featuredImage,
          gallery: [v.featuredImage],
        },
      });

      // Attach inventory item if branch exists
      if (branchId) {
        await prisma.inventoryItem.upsert({
          where: {
            variantId_branchId: {
              variantId: variant.id,
              branchId: branchId,
            },
          },
          update: {
            quantity: v.quantity,
            lowStockThreshold: 10,
          },
          create: {
            variantId: variant.id,
            branchId: branchId,
            quantity: v.quantity,
            reservedQty: 0,
            lowStockThreshold: 10,
          },
        });
      }
    }
  }

  // 5. Update Curated Collections with real mushroom products and real images
  console.log('🌿 Updating Curated Collections...');
  const collections = await prisma.collection.findMany();
  for (const col of collections) {
    if (col.slug === 'new-arrivals-2026') {
      await prisma.collection.update({
        where: { id: col.id },
        data: {
          title: 'Artisan Dehydrated Harvests',
          description: 'Hand-picked organic mushrooms cured with patient low-temperature dehydration.',
          imageUrl: '/products/dehydrated-oyster-mushroom.jpg',
        },
      });
    } else if (col.slug === 'summer-luxury-edit') {
      await prisma.collection.update({
        where: { id: col.id },
        data: {
          title: 'Gourmet Kitchen & Table Series',
          description: 'Ready-to-eat chili pastes, dips, and culinary condiments crafted from fresh mushrooms.',
          imageUrl: '/products/mushroom-chili-paste-jar-200g.jpg',
        },
      });
    } else if (col.slug === 'essential-basics') {
      await prisma.collection.update({
        where: { id: col.id },
        data: {
          title: 'Fresh & Wellness Botanicals',
          description: 'Daily harvest-fresh oyster mushrooms and pure botanical mushroom powders.',
          imageUrl: '/products/fresh-oyster-mushrooms-200g.jpg',
        },
      });
    }

    // Connect top products to collection
    for (const pid of createdProductIds.slice(0, 6)) {
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: {
            collectionId: col.id,
            productId: pid,
          },
        },
        update: {},
        create: {
          collectionId: col.id,
          productId: pid,
        },
      });
    }
  }

  // 6. Invalidate all caches
  console.log('⚡ Invalidating Redis caches...');
  await invalidateCache('*');

  console.log('🎉 Seeding successfully completed! All 9 real products and category images are live.');
}

seedProducts()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error during seeding:', e);
    prisma.$disconnect();
    process.exit(1);
  });

