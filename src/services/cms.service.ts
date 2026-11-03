import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

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
}

export const cmsService = new CmsService();
