import { Request, Response } from 'express';
import { cmsService } from '../services/cms.service';

export const getHeroConfig = async (req: Request, res: Response) => {
  try {
    const config = await cmsService.getHeroConfig();
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHeroConfig = async (req: Request, res: Response) => {
  try {
    const updated = await cmsService.updateHeroConfig(req.body);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHeroSlides = async (req: Request, res: Response) => {
  try {
    const slides = await cmsService.getHeroSlides();
    res.json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActiveHeroSlides = async (req: Request, res: Response) => {
  try {
    const slides = await cmsService.getActiveHeroSlides();
    res.json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createHeroSlide = async (req: Request, res: Response) => {
  try {
    const slide = await cmsService.createHeroSlide(req.body);
    res.status(201).json(slide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHeroSlide = async (req: Request, res: Response) => {
  try {
    const slide = await cmsService.updateHeroSlide(req.params.id as string, req.body);
    res.json(slide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response) => {
  try {
    await cmsService.deleteHeroSlide(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await cmsService.getBanners();
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActiveBanner = async (req: Request, res: Response) => {
  try {
    const banner = await cmsService.getActiveBanner();
    res.json(banner || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = await cmsService.createBanner(req.body);
    res.status(201).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const banner = await cmsService.updateBanner(req.params.id as string, req.body);
    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    await cmsService.deleteBanner(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHomepageSections = async (req: Request, res: Response) => {
  try {
    const sections = await cmsService.getHomepageSections();
    res.json(sections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reorderHomepageSections = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'orders array is required' });
    }
    const result = await cmsService.reorderHomepageSections(orders);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetHomepageSections = async (req: Request, res: Response) => {
  try {
    const sections = await cmsService.resetHomepageSections();
    res.json(sections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createHomepageSection = async (req: Request, res: Response) => {
  try {
    const section = await cmsService.createHomepageSection(req.body);
    res.status(201).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHomepageSection = async (req: Request, res: Response) => {
  try {
    const section = await cmsService.updateHomepageSection(req.params.id as string, req.body);
    res.json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHomepageSection = async (req: Request, res: Response) => {
  try {
    await cmsService.deleteHomepageSection(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStaticPages = async (req: Request, res: Response) => {
  try {
    const pages = await cmsService.getStaticPages();
    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStaticPageBySlug = async (req: Request, res: Response) => {
  try {
    const page = await cmsService.getStaticPageBySlug(req.params.slug as string);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createStaticPage = async (req: Request, res: Response) => {
  try {
    const page = await cmsService.createStaticPage(req.body);
    res.status(201).json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStaticPage = async (req: Request, res: Response) => {
  try {
    const page = await cmsService.updateStaticPage(req.params.id as string, req.body);
    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStaticPage = async (req: Request, res: Response) => {
  try {
    await cmsService.deleteStaticPage(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==========================================
// Private Gazette System Controllers
// ==========================================

export const subscribeGazette = async (req: Request, res: Response) => {
  try {
    const { email, source } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    const result = await cmsService.subscribeGazette(email, source);
    res.status(200).json({
      success: true,
      message: result.alreadySubscribed
        ? 'You are already an esteemed member of our Private Gazette.'
        : 'Welcome to the Masky Private Gazette. Your exclusive membership confirmation has been dispatched.',
      alreadySubscribed: result.alreadySubscribed,
      subscriber: result.subscriber,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Subscription failed' });
  }
};

export const unsubscribeGazette = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    const result = await cmsService.unsubscribeGazette(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Unsubscribe failed' });
  }
};

export const getGazetteSubscribers = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, status } = req.query;
    const result = await cmsService.getGazetteSubscribers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      status: status as string,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch subscribers' });
  }
};

export const deleteGazetteSubscriber = async (req: Request, res: Response) => {
  try {
    await cmsService.deleteGazetteSubscriber(req.params.id as string);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete subscriber' });
  }
};

export const getGazetteBroadcasts = async (req: Request, res: Response) => {
  try {
    const broadcasts = await cmsService.getGazetteBroadcasts();
    res.json(broadcasts);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch broadcasts' });
  }
};

export const broadcastGazette = async (req: Request, res: Response) => {
  try {
    const { subject, previewText, contentHtml, testEmail, sendToAll } = req.body;
    const result = await cmsService.broadcastGazette({
      subject,
      previewText,
      contentHtml,
      testEmail,
      sendToAll,
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Broadcast failed' });
  }
};

