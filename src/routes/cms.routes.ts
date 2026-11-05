import { Router } from 'express';
import * as cmsController from '../controllers/cms.controller';
import { authenticateJWT, requirePermission } from '../middlewares/auth.middleware';
import { auditLog } from '../middlewares/audit.middleware';

const router = Router();

// Hero Configuration (Mode: Slider / Video / Photo Split)
router.get('/hero/config', cmsController.getHeroConfig);
router.put('/hero/config', authenticateJWT, requirePermission("cms:edit_hero"), auditLog('CmsHeroConfig', 'UPDATE'), cmsController.updateHeroConfig);

// Hero Slides
router.get('/hero', cmsController.getHeroSlides);
router.get('/hero/active', cmsController.getActiveHeroSlides);
router.post('/hero', authenticateJWT, requirePermission("cms:edit_hero"), auditLog('CmsHero', 'CREATE'), cmsController.createHeroSlide);
router.put('/hero/:id', authenticateJWT, requirePermission("cms:edit_hero"), auditLog('CmsHero', 'UPDATE'), cmsController.updateHeroSlide);
router.delete('/hero/:id', authenticateJWT, requirePermission("cms:edit_hero"), auditLog('CmsHero', 'DELETE'), cmsController.deleteHeroSlide);

// Banners
router.get('/banners', cmsController.getBanners);
router.get('/banners/active', cmsController.getActiveBanner);
router.post('/banners', authenticateJWT, requirePermission("cms:edit_promo"), auditLog('CmsBanner', 'CREATE'), cmsController.createBanner);
router.put('/banners/:id', authenticateJWT, requirePermission("cms:edit_promo"), auditLog('CmsBanner', 'UPDATE'), cmsController.updateBanner);
router.delete('/banners/:id', authenticateJWT, requirePermission("cms:edit_promo"), auditLog('CmsBanner', 'DELETE'), cmsController.deleteBanner);

// Homepage Sections
router.get('/sections', cmsController.getHomepageSections);
router.put('/sections/reorder', authenticateJWT, requirePermission("cms:edit_homepage"), auditLog('CmsSection', 'REORDER'), cmsController.reorderHomepageSections);
router.post('/sections/reset', authenticateJWT, requirePermission("cms:edit_homepage"), auditLog('CmsSection', 'RESET'), cmsController.resetHomepageSections);
router.post('/sections', authenticateJWT, requirePermission("cms:edit_homepage"), auditLog('CmsSection', 'CREATE'), cmsController.createHomepageSection);
router.put('/sections/:id', authenticateJWT, requirePermission("cms:edit_homepage"), auditLog('CmsSection', 'UPDATE'), cmsController.updateHomepageSection);
router.delete('/sections/:id', authenticateJWT, requirePermission("cms:edit_homepage"), auditLog('CmsSection', 'DELETE'), cmsController.deleteHomepageSection);

// Static Pages
router.get('/pages', cmsController.getStaticPages);
router.get('/pages/slug/:slug', cmsController.getStaticPageBySlug);
router.post('/pages', authenticateJWT, requirePermission("cms:edit_static"), auditLog('CmsPage', 'CREATE'), cmsController.createStaticPage);
router.put('/pages/:id', authenticateJWT, requirePermission("cms:edit_static"), auditLog('CmsPage', 'UPDATE'), cmsController.updateStaticPage);
router.delete('/pages/:id', authenticateJWT, requirePermission("cms:edit_static"), auditLog('CmsPage', 'DELETE'), cmsController.deleteStaticPage);

// Private Gazette System
router.post('/gazette/subscribe', cmsController.subscribeGazette);
router.post('/gazette/unsubscribe', cmsController.unsubscribeGazette);
router.get('/gazette/subscribers', authenticateJWT, cmsController.getGazetteSubscribers);
router.delete('/gazette/subscribers/:id', authenticateJWT, auditLog('GazetteSubscriber', 'DELETE'), cmsController.deleteGazetteSubscriber);
router.get('/gazette/broadcasts', authenticateJWT, cmsController.getGazetteBroadcasts);
router.post('/gazette/broadcast', authenticateJWT, auditLog('GazetteBroadcast', 'CREATE'), cmsController.broadcastGazette);

export default router;
