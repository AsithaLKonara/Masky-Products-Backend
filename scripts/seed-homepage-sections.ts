import prisma from '../src/config/prisma';

const canonicalSections = [
  {
    name: 'CollectionsSection',
    description: 'Category grid showcasing Fresh, Dehydrated, Ready-to-Eat, and Frozen mushroom selections',
    visible: true,
    order: 1,
    type: 'CATEGORY_GRID',
  },
  {
    name: 'NewArrivalsSection',
    description: 'Latest small-batch mushroom harvests and seasonal arrivals with direct cart action',
    visible: true,
    order: 2,
    type: 'NEW_ARRIVALS',
  },
  {
    name: 'CuratedCollectionsSection',
    description: 'Curated gourmet bundles, gift packs, and chef reserves showcase',
    visible: true,
    order: 3,
    type: 'FEATURED_PRODUCTS',
  },
  {
    name: 'OfferCollectionSection',
    description: 'Promotional product grid with special reserve pricing and limited badges',
    visible: true,
    order: 4,
    type: 'FEATURED_PRODUCTS',
  },
  {
    name: 'AdBannerSection',
    description: 'High-impact brand banner highlighting sustainable cultivation and farm heritage',
    visible: true,
    order: 5,
    type: 'STATIC',
  },
  {
    name: 'BrandStorySection',
    description: 'In-depth brand narrative, botanical wellness philosophy, and highland heritage',
    visible: true,
    order: 6,
    type: 'STATIC',
  },
  {
    name: 'TestimonialSection',
    description: 'Verified customer testimonials, executive chef reviews, and culinary praise',
    visible: true,
    order: 7,
    type: 'STATIC',
  },
];

async function main() {
  console.log('Seeding homepage sections...');
  
  for (const sec of canonicalSections) {
    const existing = await prisma.homepageSection.findFirst({
      where: { name: sec.name },
    });

    if (existing) {
      console.log(`Updating existing section: ${sec.name}`);
      await prisma.homepageSection.update({
        where: { id: existing.id },
        data: {
          description: sec.description,
          order: sec.order,
          type: sec.type,
          visible: existing.visible ?? true,
        },
      });
    } else {
      console.log(`Creating new section: ${sec.name}`);
      await prisma.homepageSection.create({
        data: sec,
      });
    }
  }

  const all = await prisma.homepageSection.findMany({
    orderBy: { order: 'asc' },
  });
  console.log(`Successfully configured ${all.length} homepage sections:`);
  all.forEach((s) => console.log(` [${s.order}] ${s.name} (visible: ${s.visible})`));
}

main()
  .catch((e) => {
    console.error('Failed to seed homepage sections:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
