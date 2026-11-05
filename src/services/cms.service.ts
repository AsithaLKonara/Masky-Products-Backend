import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';
import { EmailService } from './email.service';
import { logger } from '../utils/logger';

export interface HeroConfig {
  mode: 'slider' | 'video' | 'photo';
  videoConfig?: {
    videoUrl?: string;
    posterUrl?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
  };
  photoConfig?: {
    imageUrl?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    badgeText?: string;
    badgeSubtext?: string;
    ctaText?: string;
    ctaLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
  };
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  mode: 'slider',
  videoConfig: {
    videoUrl: '',
    posterUrl: '/hero-image/Product1.png',
    eyebrow: "NATURE'S FINEST SELECTION",
    title: 'Gourmet Dehydrated Mushrooms',
    subtitle: 'Artisan Harvested • Peak Umami • 100% Organic',
    description: 'Slowly dried at low temperatures to lock in intense aroma, exquisite flavor, and natural nutrients for gourmet cuisine.',
    ctaText: 'Shop Collection',
    ctaLink: '/shop',
    ctaSecondaryText: 'Our Story',
    ctaSecondaryLink: '/about',
  },
  photoConfig: {
    imageUrl: '/hero-image/Product1.png',
    eyebrow: '100% ORGANIC HIGHLAND HARVEST',
    title: 'Pure Artisanal Mushrooms',
    subtitle: 'Dehydrated & Fresh Gourmet Fungi',
    description: 'Carefully selected and handcrafted in Sri Lanka. Bringing rich umami, wholesome nutrition, and earthy perfection to every dish.',
    badgeText: 'Sun-Kissed & Dehydrated',
    badgeSubtext: 'Sustainably grown in Sri Lanka',
    ctaText: 'Explore Products',
    ctaLink: '/shop',
    ctaSecondaryText: 'Learn More',
    ctaSecondaryLink: '/about',
  },
};

export const DEFAULT_HOMEPAGE_SECTIONS = [
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

export class CmsService {
  // Hero Config
  async getHeroConfig(): Promise<HeroConfig> {
    const setting = await prisma.setting.findUnique({
      where: { key: 'cms_hero_config' },
    });
    if (!setting || !setting.value) {
      return DEFAULT_HERO_CONFIG;
    }
    try {
      const parsed = JSON.parse(setting.value);
      return {
        ...DEFAULT_HERO_CONFIG,
        ...parsed,
        videoConfig: { ...DEFAULT_HERO_CONFIG.videoConfig, ...(parsed.videoConfig || {}) },
        photoConfig: { ...DEFAULT_HERO_CONFIG.photoConfig, ...(parsed.photoConfig || {}) },
      };
    } catch {
      return DEFAULT_HERO_CONFIG;
    }
  }

  async updateHeroConfig(data: Partial<HeroConfig>): Promise<HeroConfig> {
    const current = await this.getHeroConfig();
    const updated: HeroConfig = {
      ...current,
      ...data,
      videoConfig: { ...current.videoConfig, ...(data.videoConfig || {}) },
      photoConfig: { ...current.photoConfig, ...(data.photoConfig || {}) },
    };

    await prisma.setting.upsert({
      where: { key: 'cms_hero_config' },
      update: {
        value: JSON.stringify(updated),
        updatedAt: new Date(),
      },
      create: {
        key: 'cms_hero_config',
        value: JSON.stringify(updated),
        type: 'json',
        group: 'cms',
        description: 'CMS Hero Section Configuration (Slider, Video, Photo)',
        isPublic: true,
      },
    });

    return updated;
  }

  // Hero Slides
  async getHeroSlides() {
    return prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
  }

  async getActiveHeroSlides() {
    return prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  async createHeroSlide(data: Prisma.HeroSlideCreateInput) {
    return prisma.heroSlide.create({ data });
  }

  async updateHeroSlide(id: string, data: Prisma.HeroSlideUpdateInput) {
    return prisma.heroSlide.update({ where: { id }, data });
  }

  async deleteHeroSlide(id: string) {
    return prisma.heroSlide.delete({ where: { id } });
  }

  // Banners
  async getBanners() {
    return prisma.banner.findMany();
  }

  async getActiveBanner() {
    return prisma.banner.findFirst({ where: { active: true } });
  }

  async createBanner(data: Prisma.BannerCreateInput) {
    return prisma.banner.create({ data });
  }

  async updateBanner(id: string, data: Prisma.BannerUpdateInput) {
    return prisma.banner.update({ where: { id }, data });
  }

  async deleteBanner(id: string) {
    return prisma.banner.delete({ where: { id } });
  }

  // Homepage Sections
  async getHomepageSections() {
    const count = await prisma.homepageSection.count();
    if (count === 0) {
      await prisma.homepageSection.createMany({
        data: DEFAULT_HOMEPAGE_SECTIONS,
      });
    }
    return prisma.homepageSection.findMany({ orderBy: { order: 'asc' } });
  }

  async reorderHomepageSections(orders: { id: string; order: number }[]) {
    return prisma.$transaction(
      orders.map((item) =>
        prisma.homepageSection.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }

  async resetHomepageSections() {
    await prisma.homepageSection.deleteMany({});
    await prisma.homepageSection.createMany({
      data: DEFAULT_HOMEPAGE_SECTIONS,
    });
    return prisma.homepageSection.findMany({ orderBy: { order: 'asc' } });
  }

  async createHomepageSection(data: Prisma.HomepageSectionCreateInput) {
    return prisma.homepageSection.create({ data });
  }

  async updateHomepageSection(id: string, data: Prisma.HomepageSectionUpdateInput) {
    return prisma.homepageSection.update({ where: { id }, data });
  }

  async deleteHomepageSection(id: string) {
    return prisma.homepageSection.delete({ where: { id } });
  }

  // Static Pages
  async getStaticPages() {
    return prisma.staticPage.findMany();
  }

  async getStaticPageBySlug(slug: string) {
    return prisma.staticPage.findUnique({ where: { slug } });
  }

  async createStaticPage(data: Prisma.StaticPageCreateInput) {
    return prisma.staticPage.create({ data });
  }

  async updateStaticPage(id: string, data: Prisma.StaticPageUpdateInput) {
    return prisma.staticPage.update({
      where: { id },
      data: { ...data, lastEdited: new Date() }
    });
  }

  async deleteStaticPage(id: string) {
    return prisma.staticPage.delete({ where: { id } });
  }

  // ==========================================
  // Private Gazette System
  // ==========================================

  async subscribeGazette(email: string, source: string = 'FOOTER') {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please provide a valid email address');
    }

    const existing = await prisma.gazetteSubscriber.findUnique({
      where: { email: cleanEmail }
    });

    if (existing && existing.status === 'ACTIVE') {
      return { subscriber: existing, alreadySubscribed: true };
    }

    let subscriber;
    if (existing) {
      subscriber = await prisma.gazetteSubscriber.update({
        where: { id: existing.id },
        data: { status: 'ACTIVE', source, updatedAt: new Date() }
      });
    } else {
      subscriber = await prisma.gazetteSubscriber.create({
        data: { email: cleanEmail, status: 'ACTIVE', source }
      });
    }

    // Send Welcome Email asynchronously
    try {
      const template = EmailService.templates.gazetteWelcome(cleanEmail);
      await EmailService.sendEmail({
        to: cleanEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      logger.info(`[PrivateGazette] Dispatched welcome dispatch to ${cleanEmail}`);
    } catch (err: any) {
      logger.warn(`[PrivateGazette] Welcome email dispatch warning: ${err.message}`);
    }

    return { subscriber, alreadySubscribed: false };
  }

  async unsubscribeGazette(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.gazetteSubscriber.findUnique({
      where: { email: cleanEmail }
    });
    if (!existing) {
      return { success: false, message: 'Subscriber record not found' };
    }
    await prisma.gazetteSubscriber.update({
      where: { id: existing.id },
      data: { status: 'UNSUBSCRIBED', updatedAt: new Date() }
    });
    return { success: true, message: 'Successfully unsubscribed from the Private Gazette' };
  }

  async getGazetteSubscribers(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.status && params.status !== 'ALL') {
      where.status = params.status;
    }
    if (params?.search) {
      where.email = { contains: params.search.trim().toLowerCase(), mode: 'insensitive' };
    }

    const [subscribers, total, activeCount] = await Promise.all([
      prisma.gazetteSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gazetteSubscriber.count({ where }),
      prisma.gazetteSubscriber.count({ where: { status: 'ACTIVE' } }),
    ]);

    return {
      subscribers,
      total,
      activeCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  async deleteGazetteSubscriber(id: string) {
    return prisma.gazetteSubscriber.delete({ where: { id } });
  }

  async getGazetteBroadcasts() {
    return prisma.gazetteBroadcast.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async broadcastGazette(data: {
    subject: string;
    previewText?: string;
    contentHtml: string;
    testEmail?: string;
    sendToAll?: boolean;
  }) {
    if (!data.subject || !data.contentHtml) {
      throw new Error('Subject and content are required for gazette broadcast');
    }

    const template = EmailService.templates.gazetteBroadcast({
      subject: data.subject,
      previewText: data.previewText,
      contentHtml: data.contentHtml,
    });

    // 1. If Test Email mode
    if (data.testEmail) {
      const cleanTest = data.testEmail.trim().toLowerCase();
      await EmailService.sendEmail({
        to: cleanTest,
        subject: `[TEST PREVIEW] ${data.subject}`,
        html: template.html,
        text: template.text,
      });
      return { success: true, testMode: true, recipient: cleanTest };
    }

    // 2. Broadcast to all active subscribers
    const activeSubscribers = await prisma.gazetteSubscriber.findMany({
      where: { status: 'ACTIVE' },
      select: { email: true }
    });

    const recipientEmails = activeSubscribers.map(s => s.email);
    let sentSuccess = 0;

    for (const email of recipientEmails) {
      try {
        await EmailService.sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
        sentSuccess++;
      } catch (err: any) {
        logger.error(`[GazetteBroadcast] Failed sending to ${email}: ${err.message}`);
      }
    }

    const record = await prisma.gazetteBroadcast.create({
      data: {
        subject: data.subject,
        previewText: data.previewText,
        contentHtml: data.contentHtml,
        sentCount: sentSuccess,
        status: 'SENT',
        sentAt: new Date(),
      }
    });

    return {
      success: true,
      broadcastId: record.id,
      recipientsCount: recipientEmails.length,
      sentCount: sentSuccess,
    };
  }
}

export const cmsService = new CmsService();
