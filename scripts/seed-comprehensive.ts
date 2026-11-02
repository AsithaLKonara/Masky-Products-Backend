import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';

const MODULE_GROUPS = [
  {
    group: "Orders & Fulfillment",
    modules: [
      { label: "Orders — View", code: "orders:view", action: "View" },
      { label: "Orders — Create", code: "orders:create", action: "Create" },
      { label: "Orders — Edit Status", code: "orders:edit_status", action: "Edit" },
      { label: "Orders — Cancel / Refund", code: "orders:cancel_refund", action: "Delete" },
      { label: "Returns & RMA — View", code: "returns:view", action: "View" },
      { label: "Returns & RMA — Approve / Reject", code: "returns:approve_reject", action: "Edit" },
      { label: "Returns & RMA — Issue Refund", code: "returns:issue_refund", action: "Edit" },
      { label: "Shipping — View Queue", code: "shipping:view_queue", action: "View" },
      { label: "Shipping — Dispatch (Fardar)", code: "shipping:dispatch_fardar", action: "Create" },
      { label: "Shipping — Print Labels", code: "shipping:print_labels", action: "View" },
    ],
  },
  {
    group: "Point of Sale (POS)",
    modules: [
      { label: "POS — Open / Close Shift", code: "pos:shift_open_close", action: "Edit" },
      { label: "POS — Sales Mode", code: "pos:sales_mode", action: "Create" },
      { label: "POS — Returns Mode", code: "pos:returns_mode", action: "Create" },
      { label: "POS — Exchange Mode", code: "pos:exchange_mode", action: "Create" },
      { label: "POS — Dispatch Mode", code: "pos:dispatch_mode", action: "Create" },
      { label: "POS — Hold & Resume Sale", code: "pos:hold_resume", action: "Edit" },
      { label: "POS — Apply Discounts", code: "pos:apply_discounts", action: "Edit" },
      { label: "POS — View Sales History", code: "pos:view_sales_history", action: "View" },
    ],
  },
  {
    group: "Catalog & Products",
    modules: [
      { label: "Products — View", code: "products:view", action: "View" },
      { label: "Products — Create", code: "products:create", action: "Create" },
      { label: "Products — Edit", code: "products:edit", action: "Edit" },
      { label: "Products — Delete", code: "products:delete", action: "Delete" },
      { label: "Categories — Manage", code: "categories:manage", action: "Edit" },
      { label: "Collections — Manage", code: "collections:manage", action: "Edit" },
    ],
  },
  {
    group: "Inventory",
    modules: [
      { label: "Inventory — View Stock Levels", code: "inventory:view_stock", action: "View" },
      { label: "Inventory — Receive Stock (PO)", code: "inventory:receive_po", action: "Create" },
      { label: "Inventory — Stock Transfers", code: "inventory:stock_transfers", action: "Edit" },
      { label: "Inventory — Report Damage / Loss", code: "inventory:report_damage", action: "Create" },
      { label: "Inventory — Adjust Stock", code: "inventory:adjust_stock", action: "Edit" },
    ],
  },
  {
    group: "Payments",
    modules: [
      { label: "Payments — View Transactions", code: "payments:view_transactions", action: "View" },
      { label: "Payments — Process Refund", code: "payments:process_refund", action: "Edit" },
      { label: "Payments — Retry Failed Payment", code: "payments:retry_failed", action: "Edit" },
      { label: "Payments — View Gateway Reports", code: "payments:view_gateway_reports", action: "View" },
    ],
  },
  {
    group: "Customers & Loyalty",
    modules: [
      { label: "Customers — View", code: "customers:view", action: "View" },
      { label: "Customers — Edit", code: "customers:edit", action: "Edit" },
      { label: "Customers — Suspend", code: "customers:suspend", action: "Delete" },
      { label: "Loyalty — View Points", code: "loyalty:view_points", action: "View" },
      { label: "Loyalty — Adjust Points", code: "loyalty:adjust_points", action: "Edit" },
      { label: "Loyalty — Manage Tiers", code: "loyalty:manage_tiers", action: "Edit" },
    ],
  },
  {
    group: "Promotions & Marketing",
    modules: [
      { label: "Promotions — View", code: "promotions:view", action: "View" },
      { label: "Promotions — Create Coupon", code: "promotions:create_coupon", action: "Create" },
      { label: "Promotions — Create Campaign", code: "promotions:create_campaign", action: "Create" },
      { label: "Promotions — Deactivate", code: "promotions:deactivate", action: "Delete" },
    ],
  },
  {
    group: "Reviews",
    modules: [
      { label: "Reviews — View", code: "reviews:view", action: "View" },
      { label: "Reviews — Approve", code: "reviews:approve", action: "Edit" },
      { label: "Reviews — Reject", code: "reviews:reject", action: "Delete" },
      { label: "Reviews — Reply", code: "reviews:reply", action: "Create" },
    ],
  },
  {
    group: "Reports & Analytics",
    modules: [
      { label: "Reports — View Dashboard", code: "reports:view_dashboard", action: "View" },
      { label: "Reports — Export Data", code: "reports:export_data", action: "View" },
      { label: "Reports — View Financial", code: "reports:view_financial", action: "View" },
    ],
  },
  {
    group: "Content Management (CMS)",
    modules: [
      { label: "CMS — View", code: "cms:view", action: "View" },
      { label: "CMS — Edit Hero Slides", code: "cms:edit_hero", action: "Edit" },
      { label: "CMS — Edit Promo Banners", code: "cms:edit_promo", action: "Edit" },
      { label: "CMS — Edit Homepage Layout", code: "cms:edit_homepage", action: "Edit" },
      { label: "CMS — Edit Static Pages", code: "cms:edit_static", action: "Edit" },
    ],
  },
  {
    group: "Branches",
    modules: [
      { label: "Branches — View", code: "branches:view", action: "View" },
      { label: "Branches — Create", code: "branches:create", action: "Create" },
      { label: "Branches — Edit", code: "branches:edit", action: "Edit" },
      { label: "Branches — Delete", code: "branches:delete", action: "Delete" },
    ],
  },
  {
    group: "System Administration",
    modules: [
      { label: "System — View Audit Logs", code: "system:view_audit_logs", action: "View" },
      { label: "System — Manage Users", code: "system:manage_users", action: "Edit" },
      { label: "System — Manage Roles", code: "system:manage_roles", action: "Edit" },
      { label: "System — Platform Settings", code: "system:platform_settings", action: "Edit" },
    ],
  },
];

async function seedComprehensive() {
  console.log("🌱 Starting Comprehensive Database Seed...");

  // 1. Seed Permissions
  console.log("👉 Seeding Permissions...");
  for (const group of MODULE_GROUPS) {
    for (const mod of group.modules) {
      await prisma.permission.upsert({
        where: { code: mod.code },
        update: {
          module: group.group,
          action: mod.action,
          description: mod.label,
        },
        create: {
          code: mod.code,
          module: group.group,
          action: mod.action,
          description: mod.label,
        },
      });
    }
  }

  // 2. Define and Seed Roles
  console.log("👉 Seeding Roles...");
  const allPermCodes = MODULE_GROUPS.flatMap((g) => g.modules.map((m) => m.code));

  const roleDefinitions = [
    {
      name: "Super Admin",
      description: "Full system owner with unrestricted access across all modules.",
      isSystem: true,
      permissions: allPermCodes,
    },
    {
      name: "Branch Admin",
      description: "Admin access for branch management, catalog, inventory, and orders.",
      isSystem: true,
      permissions: [
        "orders:view", "orders:create", "orders:edit_status", "orders:cancel_refund",
        "returns:view", "returns:approve_reject", "returns:issue_refund",
        "pos:shift_open_close", "pos:sales_mode", "pos:returns_mode", "pos:exchange_mode", "pos:dispatch_mode", "pos:hold_resume", "pos:apply_discounts", "pos:view_sales_history",
        "customers:view", "customers:edit",
        "loyalty:view_points", "loyalty:adjust_points",
        "products:view", "products:create", "products:edit",
        "categories:manage", "collections:manage",
        "inventory:view_stock", "inventory:receive_po", "inventory:stock_transfers", "inventory:report_damage", "inventory:adjust_stock",
        "reports:view_dashboard", "reports:export_data", "reports:view_financial",
        "branches:view",
      ],
    },
    {
      name: "Branch Manager",
      description: "Manages store operations, shifts, POS, inventory, and staff.",
      isSystem: true,
      permissions: [
        "orders:view", "orders:create", "orders:edit_status",
        "returns:view", "returns:approve_reject",
        "pos:shift_open_close", "pos:sales_mode", "pos:returns_mode", "pos:exchange_mode", "pos:dispatch_mode", "pos:hold_resume", "pos:apply_discounts", "pos:view_sales_history",
        "customers:view", "customers:edit",
        "loyalty:view_points",
        "products:view",
        "inventory:view_stock", "inventory:stock_transfers", "inventory:adjust_stock",
        "reports:view_dashboard",
        "branches:view",
      ],
    },
    {
      name: "Branch Cashier",
      description: "Handles POS registers, shift logs, customer sales and receipts.",
      isSystem: true,
      permissions: [
        "pos:shift_open_close", "pos:sales_mode", "pos:returns_mode", "pos:exchange_mode", "pos:dispatch_mode", "pos:hold_resume", "pos:view_sales_history",
        "customers:view",
        "loyalty:view_points",
        "orders:view",
      ],
    },
    {
      name: "Online Sales",
      description: "Ecommerce fulfillment, courier dispatch, and promotions manager.",
      isSystem: true,
      permissions: [
        "orders:view", "orders:edit_status", "orders:cancel_refund",
        "returns:view", "returns:approve_reject", "returns:issue_refund",
        "shipping:view_queue", "shipping:dispatch_fardar", "shipping:print_labels",
        "customers:view", "customers:edit",
        "loyalty:view_points", "loyalty:adjust_points",
        "promotions:view", "promotions:create_coupon", "promotions:create_campaign",
        "products:view",
        "reports:view_dashboard",
      ],
    },
    {
      name: "PUBLIC_USER",
      description: "Storefront registered customer.",
      isSystem: true,
      permissions: [],
    },
  ];

  const roleMap: Record<string, string> = {};

  for (const rDef of roleDefinitions) {
    let role = await prisma.role.findUnique({ where: { name: rDef.name } });
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: rDef.name,
          description: rDef.description,
          isSystem: rDef.isSystem,
          status: "Active",
        },
      });
    } else {
      await prisma.role.update({
        where: { id: role.id },
        data: {
          description: rDef.description,
          isSystem: rDef.isSystem,
          status: "Active",
        },
      });
    }
    roleMap[role.name] = role.id;

    // Link permissions
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    if (rDef.permissions.length > 0) {
      const perms = await prisma.permission.findMany({
        where: { code: { in: rDef.permissions } },
      });
      if (perms.length > 0) {
        await prisma.rolePermission.createMany({
          data: perms.map((p) => ({
            roleId: role!.id,
            permissionId: p.id,
          })),
          skipDuplicates: true,
        });
      }
    }
  }

  // 3. Seed Branches
  console.log("👉 Seeding Branches & POS Terminals...");
  const branches = [
    {
      code: "MAIN",
      name: "Main Flagship Store (Colombo 03)",
      address: "123 Galle Road, Colombo 03, Sri Lanka",
      phone: "+94 11 234 5678",
      type: "RETAIL",
      isActive: true,
    },
    {
      code: "GAN",
      name: "Ganemulla Branch",
      address: "45 Station Road, Ganemulla, Sri Lanka",
      phone: "+94 33 226 7890",
      type: "RETAIL",
      isActive: true,
    },
    {
      code: "KAN",
      name: "Kandy City Centre Branch",
      address: "Level 2, KCC, Dalada Veediya, Kandy",
      phone: "+94 81 220 1234",
      type: "RETAIL",
      isActive: true,
    },
  ];

  const branchMap: Record<string, string> = {};
  for (const b of branches) {
    const branch = await prisma.branch.upsert({
      where: { code: b.code },
      update: {
        name: b.name,
        address: b.address,
        phone: b.phone,
        type: b.type,
        isActive: b.isActive,
      },
      create: b,
    });
    branchMap[b.code] = branch.id;
  }

  const mainBranchId = branchMap["MAIN"]!;
  const ganBranchId = branchMap["GAN"]!;
  const kanBranchId = branchMap["KAN"]!;

  // Seed POS Terminals
  const terminals = [
    { name: "Flagship Counter 01", branchId: mainBranchId, status: "ACTIVE" },
    { name: "Flagship Express Register", branchId: mainBranchId, status: "ACTIVE" },
    { name: "Ganemulla Front Register", branchId: ganBranchId, status: "ACTIVE" },
    { name: "KCC Main Terminal", branchId: kanBranchId, status: "ACTIVE" },
  ];

  const terminalList: any[] = [];
  for (const term of terminals) {
    const existing = await prisma.posTerminal.findFirst({
      where: { name: term.name, branchId: term.branchId },
    });
    if (!existing) {
      const created = await prisma.posTerminal.create({
        data: {
          name: term.name,
          status: term.status,
          branch: { connect: { id: term.branchId } },
        },
      });
      terminalList.push(created);
    } else {
      terminalList.push(existing);
    }
  }

  // 4. Seed Users
  console.log("👉 Seeding Users with Dev Credentials...");
  const defaultPassword = await bcrypt.hash("Password123!", 10);

  const usersToSeed = [
    {
      name: "Super Admin",
      email: "superadmin@masky.space",
      role: "Super Admin",
      branchCode: "MAIN",
    },
    {
      name: "System Superadmin",
      email: "superadmin@seramaaduwen.lk",
      role: "Super Admin",
      branchCode: "MAIN",
    },
    {
      name: "Admin User",
      email: "admin@masky.space",
      role: "Branch Admin",
      branchCode: "MAIN",
    },
    {
      name: "Branch Manager",
      email: "manager@masky.space",
      role: "Branch Manager",
      branchCode: "MAIN",
    },
    {
      name: "Cashier One",
      email: "cashier@masky.space",
      role: "Branch Cashier",
      branchCode: "MAIN",
    },
    {
      name: "Online Store Coordinator",
      email: "onlinesales@masky.space",
      role: "Online Sales",
      branchCode: "MAIN",
    },
    {
      name: "Dev Shopper",
      email: "customer@masky.space",
      role: "PUBLIC_USER",
      branchCode: undefined,
    },
  ];

  const userMap: Record<string, string> = {};

  for (const u of usersToSeed) {
    const branchId = u.branchCode ? branchMap[u.branchCode] : undefined;
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        password: defaultPassword,
        branchId,
        status: "ACTIVE",
      },
      create: {
        name: u.name,
        email: u.email,
        password: defaultPassword,
        branchId,
        status: "ACTIVE",
      },
    });
    userMap[u.email] = user.id;

    // Assign Role
    const roleId = roleMap[u.role];
    if (roleId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId } },
        update: {},
        create: { userId: user.id, roleId },
      });
    }
  }

  // Update Branch Manager relation for Main Branch
  if (userMap["manager@masky.space"]) {
    await prisma.branch.update({
      where: { code: "MAIN" },
      data: { managerId: userMap["manager@masky.space"] },
    });
  }

  // 5. Seed Categories
  console.log("👉 Seeding Categories...");
  const categories = [
    {
      name: "T-Shirts",
      slug: "t-shirts",
      description: "Heavyweight oversized tees, premium pima cotton basics, and graphic prints.",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
    },
    {
      name: "Casual Shirts",
      slug: "shirts",
      description: "Refined Oxford linen, crisp poplin button-downs, and relaxed resort shirts.",
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    },
    {
      name: "Denim & Trousers",
      slug: "jeans",
      description: "Japanese selvedge denim, tailored pleat trousers, and relaxed chinos.",
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    },
    {
      name: "Hoodies & Outerwear",
      slug: "hoodies",
      description: "Brushed fleece zip hoodies, minimal knitwear, and structured overshirts.",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
    },
    {
      name: "Dresses & Skirts",
      slug: "dresses",
      description: "Contemporary silk-blend evening slips, tailored linen wraps, and midi cuts.",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Handcrafted full-grain leather belts, structured totes, and luxury accessories.",
      imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800",
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = c.id;
  }

  // 6. Seed Collections
  console.log("👉 Seeding Collections...");
  const collections = [
    {
      title: "New Arrivals 2026",
      slug: "new-arrivals-2026",
      description: "The latest seasonal drops featuring understated silhouettes and artisan fabrics.",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    },
    {
      title: "Summer Luxury Edit",
      slug: "summer-luxury-edit",
      description: "Airy linens, breathable silks, and minimalist tailoring designed for warmth.",
      imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
    },
    {
      title: "Essential Basics",
      slug: "essential-basics",
      description: "Permanent wardrobe foundation pieces engineered for longevity.",
      imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
    },
  ];

  const collectionMap: Record<string, string> = {};
  for (const col of collections) {
    const c = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
    collectionMap[col.slug] = c.id;
  }

  // 7. Seed Products with Variants and Inventory
  console.log("👉 Seeding Products, Variants & Inventory Items...");
  const productsData = [
    {
      name: "Signature Oversized Heavyweight Tee",
      slug: "signature-oversized-heavyweight-tee",
      barcode: "89012340001",
      description: "Crafted from 280 GSM combed organic cotton with dropped shoulders and a dense ribbed collar.",
      excerpt: "Luxurious heavyweight organic tee with a relaxed modern drape.",
      categorySlug: "t-shirts",
      collectionSlugs: ["new-arrivals-2026", "essential-basics"],
      variants: [
        { name: "Vintage Black / S", sku: "TSH-BLK-S", barcode: "89012340001-S", price: 28.00, salePrice: null, size: "S", color: "Vintage Black", qty: 25 },
        { name: "Vintage Black / M", sku: "TSH-BLK-M", barcode: "89012340001-M", price: 28.00, salePrice: null, size: "M", color: "Vintage Black", qty: 40 },
        { name: "Vintage Black / L", sku: "TSH-BLK-L", barcode: "89012340001-L", price: 28.00, salePrice: null, size: "L", color: "Vintage Black", qty: 35 },
        { name: "Crisp White / M", sku: "TSH-WHT-M", barcode: "89012340002-M", price: 28.00, salePrice: null, size: "M", color: "Crisp White", qty: 30 },
        { name: "Crisp White / L", sku: "TSH-WHT-L", barcode: "89012340002-L", price: 28.00, salePrice: null, size: "L", color: "Crisp White", qty: 20 },
      ],
    },
    {
      name: "Relaxed Oxford Linen Button-Down",
      slug: "relaxed-oxford-linen-button-down",
      barcode: "89012340002",
      description: "Pure French flax linen pre-washed for velvety softness. Features mother-of-pearl buttons.",
      excerpt: "Breezy pure linen shirt tailored for relaxed formal or casual wear.",
      categorySlug: "shirts",
      collectionSlugs: ["summer-luxury-edit", "new-arrivals-2026"],
      variants: [
        { name: "Sky Blue / M", sku: "SHR-BLU-M", barcode: "89012340003-M", price: 54.00, salePrice: 48.00, size: "M", color: "Sky Blue", qty: 20 },
        { name: "Sky Blue / L", sku: "SHR-BLU-L", barcode: "89012340003-L", price: 54.00, salePrice: 48.00, size: "L", color: "Sky Blue", qty: 15 },
        { name: "Pristine White / M", sku: "SHR-WHT-M", barcode: "89012340004-M", price: 54.00, salePrice: null, size: "M", color: "Pristine White", qty: 25 },
        { name: "Pristine White / L", sku: "SHR-WHT-L", barcode: "89012340004-L", price: 54.00, salePrice: null, size: "L", color: "Pristine White", qty: 18 },
      ],
    },
    {
      name: "Classic Slim-Fit Japanese Selvedge Denim",
      slug: "classic-slim-fit-japanese-selvedge-denim",
      barcode: "89012340003",
      description: "13.5 oz Kurabo selvedge raw denim woven on vintage shuttle looms in Okayama.",
      excerpt: "Authentic Japanese selvedge denim built to patina beautifully over time.",
      categorySlug: "jeans",
      collectionSlugs: ["essential-basics"],
      variants: [
        { name: "Deep Indigo / 30", sku: "JNS-IND-30", barcode: "89012340005-30", price: 78.00, salePrice: null, size: "30", color: "Deep Indigo", qty: 15 },
        { name: "Deep Indigo / 32", sku: "JNS-IND-32", barcode: "89012340005-32", price: 78.00, salePrice: null, size: "32", color: "Deep Indigo", qty: 30 },
        { name: "Deep Indigo / 34", sku: "JNS-IND-34", barcode: "89012340005-34", price: 78.00, salePrice: null, size: "34", color: "Deep Indigo", qty: 20 },
        { name: "Washed Charcoal / 32", sku: "JNS-CHR-32", barcode: "89012340006-32", price: 78.00, salePrice: null, size: "32", color: "Washed Charcoal", qty: 12 },
      ],
    },
    {
      name: "Minimalist French Terry Zip Hoodie",
      slug: "minimalist-french-terry-zip-hoodie",
      barcode: "89012340004",
      description: "Double-knit 450 GSM French terry with heavy-duty two-way YKK silver zipper.",
      excerpt: "Substantial heavyweight zip hoodie with clean architectural lines.",
      categorySlug: "hoodies",
      collectionSlugs: ["new-arrivals-2026", "essential-basics"],
      variants: [
        { name: "Heather Grey / M", sku: "HOD-GRY-M", barcode: "89012340007-M", price: 65.00, salePrice: null, size: "M", color: "Heather Grey", qty: 18 },
        { name: "Heather Grey / L", sku: "HOD-GRY-L", barcode: "89012340007-L", price: 65.00, salePrice: null, size: "L", color: "Heather Grey", qty: 22 },
        { name: "Pitch Black / M", sku: "HOD-BLK-M", barcode: "89012340008-M", price: 65.00, salePrice: 58.00, size: "M", color: "Pitch Black", qty: 25 },
        { name: "Pitch Black / L", sku: "HOD-BLK-L", barcode: "89012340008-L", price: 65.00, salePrice: 58.00, size: "L", color: "Pitch Black", qty: 20 },
      ],
    },
    {
      name: "Pleated Silk-Blend Slip Midi Dress",
      slug: "pleated-silk-blend-slip-midi-dress",
      barcode: "89012340005",
      description: "Bias-cut silk-blend midi with delicate adjustable strapwork and accordion pleats.",
      excerpt: "Fluid evening silhouette that shimmers delicately with natural movement.",
      categorySlug: "dresses",
      collectionSlugs: ["summer-luxury-edit"],
      variants: [
        { name: "Emerald Green / S", sku: "DRS-EMR-S", barcode: "89012340009-S", price: 92.00, salePrice: null, size: "S", color: "Emerald Green", qty: 14 },
        { name: "Emerald Green / M", sku: "DRS-EMR-M", barcode: "89012340009-M", price: 92.00, salePrice: null, size: "M", color: "Emerald Green", qty: 18 },
        { name: "Champagne / S", sku: "DRS-CMP-S", barcode: "89012340010-S", price: 92.00, salePrice: null, size: "S", color: "Champagne", qty: 12 },
        { name: "Champagne / M", sku: "DRS-CMP-M", barcode: "89012340010-M", price: 92.00, salePrice: null, size: "M", color: "Champagne", qty: 16 },
      ],
    },
    {
      name: "Handcrafted Tuscan Leather Dress Belt",
      slug: "handcrafted-tuscan-leather-dress-belt",
      barcode: "89012340006",
      description: "Full-grain vegetable-tanned Italian leather with hand-burnished edges and solid brass buckle.",
      excerpt: "Timeless handcrafted leather belt finished with subtle debossed logo.",
      categorySlug: "accessories",
      collectionSlugs: ["essential-basics"],
      variants: [
        { name: "Cognac Brown / 32", sku: "BLT-CGN-32", barcode: "89012340011-32", price: 38.00, salePrice: null, size: "32", color: "Cognac Brown", qty: 20 },
        { name: "Cognac Brown / 34", sku: "BLT-CGN-34", barcode: "89012340011-34", price: 38.00, salePrice: null, size: "34", color: "Cognac Brown", qty: 25 },
        { name: "Matte Black / 32", sku: "BLT-BLK-32", barcode: "89012340012-32", price: 38.00, salePrice: null, size: "32", color: "Matte Black", qty: 18 },
        { name: "Matte Black / 34", sku: "BLT-BLK-34", barcode: "89012340012-34", price: 38.00, salePrice: null, size: "34", color: "Matte Black", qty: 22 },
      ],
    },
  ];

  const variantList: any[] = [];

  for (const pData of productsData) {
    const categoryId = categoryMap[pData.categorySlug];

    const product = await prisma.product.upsert({
      where: { slug: pData.slug },
      update: {
        name: pData.name,
        barcode: pData.barcode,
        description: pData.description,
        excerpt: pData.excerpt,
        categoryId,
        status: "ACTIVE",
      },
      create: {
        name: pData.name,
        slug: pData.slug,
        barcode: pData.barcode,
        description: pData.description,
        excerpt: pData.excerpt,
        categoryId,
        status: "ACTIVE",
      },
    });

    // Link Collections
    for (const cSlug of pData.collectionSlugs) {
      const colId = collectionMap[cSlug];
      if (colId) {
        await prisma.collectionProduct.upsert({
          where: {
            collectionId_productId: {
              collectionId: colId,
              productId: product.id,
            },
          },
          update: {},
          create: {
            collectionId: colId,
            productId: product.id,
          },
        });
      }
    }

    // Seed Variants
    for (const vData of pData.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: vData.sku },
        update: {
          name: vData.name,
          barcode: vData.barcode,
          price: vData.price,
          salePrice: vData.salePrice,
          stockStatus: "instock",
          quantity: vData.qty,
          size: vData.size,
          color: vData.color,
        },
        create: {
          productId: product.id,
          name: vData.name,
          sku: vData.sku,
          barcode: vData.barcode,
          price: vData.price,
          salePrice: vData.salePrice,
          stockStatus: "instock",
          quantity: vData.qty,
          size: vData.size,
          color: vData.color,
        },
      });
      variantList.push(variant);

      // Seed Inventory for Main Branch (primary stock)
      await prisma.inventoryItem.upsert({
        where: {
          variantId_branchId: {
            variantId: variant.id,
            branchId: mainBranchId,
          },
        },
        update: {
          quantity: Math.floor(vData.qty * 0.6),
          lowStockThreshold: 5,
        },
        create: {
          variantId: variant.id,
          branchId: mainBranchId,
          quantity: Math.floor(vData.qty * 0.6),
          lowStockThreshold: 5,
        },
      });

      // Seed Inventory for Ganemulla Branch
      await prisma.inventoryItem.upsert({
        where: {
          variantId_branchId: {
            variantId: variant.id,
            branchId: ganBranchId,
          },
        },
        update: {
          quantity: Math.floor(vData.qty * 0.25),
          lowStockThreshold: 3,
        },
        create: {
          variantId: variant.id,
          branchId: ganBranchId,
          quantity: Math.floor(vData.qty * 0.25),
          lowStockThreshold: 3,
        },
      });

      // Seed Inventory for Kandy Branch
      await prisma.inventoryItem.upsert({
        where: {
          variantId_branchId: {
            variantId: variant.id,
            branchId: kanBranchId,
          },
        },
        update: {
          quantity: Math.floor(vData.qty * 0.15),
          lowStockThreshold: 3,
        },
        create: {
          variantId: variant.id,
          branchId: kanBranchId,
          quantity: Math.floor(vData.qty * 0.15),
          lowStockThreshold: 3,
        },
      });
    }
  }

  // 8. Seed Customers and Loyalty
  console.log("👉 Seeding Customers and Loyalty Accounts...");
  const customersData = [
    {
      phone: "0771234567",
      email: "customer@masky.space",
      firstName: "Dev",
      lastName: "Shopper",
      isGuest: false,
      tier: "Platinum",
      points: 1250,
      address: {
        type: "SHIPPING",
        firstName: "Dev",
        lastName: "Shopper",
        addressLine1: "Suite 4B, Astoria Residences",
        addressLine2: "R. A. De Mel Mawatha",
        city: "Colombo",
        district: "Colombo",
        postalCode: "00300",
        nearestCity: "Kollupitiya",
        phone: "0771234567",
        isDefault: true,
      },
    },
    {
      phone: "0712345678",
      email: "sarah.fernando@example.com",
      firstName: "Sarah",
      lastName: "Fernando",
      isGuest: false,
      tier: "Gold",
      points: 820,
      address: {
        type: "SHIPPING",
        firstName: "Sarah",
        lastName: "Fernando",
        addressLine1: "18/2 Temple Road",
        city: "Nugegoda",
        district: "Colombo",
        postalCode: "10250",
        nearestCity: "Nugegoda",
        phone: "0712345678",
        isDefault: true,
      },
    },
    {
      phone: "0789876543",
      email: "kasun.perera@example.com",
      firstName: "Kasun",
      lastName: "Perera",
      isGuest: false,
      tier: "Silver",
      points: 450,
      address: {
        type: "SHIPPING",
        firstName: "Kasun",
        lastName: "Perera",
        addressLine1: "72 Kandy Road",
        city: "Kiribathgoda",
        district: "Gampaha",
        postalCode: "11600",
        nearestCity: "Kiribathgoda",
        phone: "0789876543",
        isDefault: true,
      },
    },
    {
      phone: "0765432109",
      email: "dilani.wick@example.com",
      firstName: "Dilani",
      lastName: "Wickramasinghe",
      isGuest: false,
      tier: "Bronze",
      points: 120,
      address: {
        type: "SHIPPING",
        firstName: "Dilani",
        lastName: "Wickramasinghe",
        addressLine1: "54 Lake View Drive",
        city: "Kandy",
        district: "Kandy",
        postalCode: "20000",
        nearestCity: "Kandy",
        phone: "0765432109",
        isDefault: true,
      },
    },
  ];

  const customerList: any[] = [];
  for (const cData of customersData) {
    const customer = await prisma.customer.upsert({
      where: { phone: cData.phone },
      update: {
        email: cData.email,
        firstName: cData.firstName,
        lastName: cData.lastName,
        isGuest: cData.isGuest,
      },
      create: {
        phone: cData.phone,
        email: cData.email,
        firstName: cData.firstName,
        lastName: cData.lastName,
        isGuest: cData.isGuest,
      },
    });
    customerList.push(customer);

    // Seed Address
    const existingAddress = await prisma.address.findFirst({
      where: { customerId: customer.id },
    });
    if (!existingAddress) {
      await prisma.address.create({
        data: {
          ...cData.address,
          customerId: customer.id,
        },
      });
    }

    // Seed Loyalty
    await prisma.loyaltyAccount.upsert({
      where: { customerId: customer.id },
      update: {
        points: cData.points,
        lifetimePoints: cData.points + 200,
        tier: cData.tier,
      },
      create: {
        customerId: customer.id,
        points: cData.points,
        lifetimePoints: cData.points + 200,
        tier: cData.tier,
      },
    });
  }

  // 9. Seed Orders, Order Items, and Transactions
  console.log("👉 Seeding Realistic Orders & Financial Transactions...");
  const devCust = customerList[0];
  const sarahCust = customerList[1];
  const kasunCust = customerList[2];

  const sampleOrders = [
    {
      orderNumber: "ORD-2026-001",
      customerId: devCust.id,
      branchId: branchMap["MAIN"],
      type: "POS",
      status: "COMPLETED",
      paymentMethod: "CASH",
      paymentStatus: "PAID",
      subtotal: 56.00,
      shippingFee: 0,
      discount: 0,
      total: 56.00,
      items: [
        { variantIndex: 0, qty: 2, price: 28.00 },
      ],
      payment: {
        gateway: "CASH_DRAWER",
        method: "CASH",
        amount: 56.00,
        status: "COMPLETED",
      },
    },
    {
      orderNumber: "ORD-2026-002",
      customerId: devCust.id,
      branchId: branchMap["MAIN"],
      type: "ECOMMERCE",
      status: "COMPLETED",
      paymentMethod: "ONEPAY",
      paymentStatus: "PAID",
      subtotal: 108.00,
      shippingFee: 3.50,
      discount: 10.00,
      total: 101.50,
      items: [
        { variantIndex: 1, qty: 1, price: 28.00 },
        { variantIndex: 5, qty: 1, price: 48.00 },
        { variantIndex: 14, qty: 1, price: 32.00 },
      ],
      payment: {
        gateway: "ONEPAY",
        method: "VISA",
        amount: 101.50,
        status: "COMPLETED",
      },
    },
    {
      orderNumber: "ORD-2026-003",
      customerId: sarahCust.id,
      branchId: branchMap["MAIN"],
      type: "ECOMMERCE",
      status: "PROCESSING",
      paymentMethod: "KOKO",
      paymentStatus: "PAID",
      subtotal: 92.00,
      shippingFee: 3.50,
      discount: 0,
      total: 95.50,
      items: [
        { variantIndex: 12, qty: 1, price: 92.00 },
      ],
      payment: {
        gateway: "KOKO",
        method: "BNPL_3X",
        amount: 95.50,
        status: "COMPLETED",
      },
    },
    {
      orderNumber: "ORD-2026-004",
      customerId: kasunCust.id,
      branchId: branchMap["GAN"],
      type: "ECOMMERCE",
      status: "SHIPPED",
      paymentMethod: "MINTPAY",
      paymentStatus: "PAID",
      subtotal: 78.00,
      shippingFee: 3.50,
      discount: 5.00,
      total: 76.50,
      items: [
        { variantIndex: 8, qty: 1, price: 78.00 },
      ],
      payment: {
        gateway: "MINTPAY",
        method: "BNPL_3X",
        amount: 76.50,
        status: "COMPLETED",
      },
    },
    {
      orderNumber: "ORD-2026-005",
      customerId: devCust.id,
      branchId: branchMap["MAIN"],
      type: "ECOMMERCE",
      status: "PENDING",
      paymentMethod: "COD",
      paymentStatus: "UNPAID",
      subtotal: 65.00,
      shippingFee: 3.50,
      discount: 0,
      total: 68.50,
      items: [
        { variantIndex: 10, qty: 1, price: 65.00 },
      ],
      payment: {
        gateway: "COD",
        method: "CASH_ON_DELIVERY",
        amount: 68.50,
        status: "PENDING",
      },
    },
  ];

  for (const oData of sampleOrders) {
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: oData.orderNumber },
    });

    let order = existingOrder;
    if (!order) {
      order = await prisma.order.create({
        data: {
          orderNumber: oData.orderNumber,
          customerId: oData.customerId,
          branchId: oData.branchId,
          type: oData.type,
          status: oData.status,
          paymentMethod: oData.paymentMethod,
          paymentStatus: oData.paymentStatus,
          subtotal: oData.subtotal,
          shippingFee: oData.shippingFee,
          discount: oData.discount,
          total: oData.total,
          shippingAddress: {
            fullName: "Dev Customer",
            addressLine1: "Suite 4B, Astoria",
            city: "Colombo",
            phone: "0771234567",
          },
        },
      });

      // Add Items
      for (const item of oData.items) {
        const v = variantList[item.variantIndex % variantList.length];
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            variantId: v.id,
            quantity: item.qty,
            priceAtPurchase: item.price,
          },
        });
      }

      // Add Payment Transaction
      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          customerId: oData.customerId,
          gateway: oData.payment.gateway,
          method: oData.payment.method,
          amount: oData.payment.amount,
          status: oData.payment.status,
        },
      });
    }
  }

  // 10. Seed Editorial CMS Slides & Banners
  console.log("👉 Seeding Storefront CMS Elements...");
  const slides = [
    {
      title: "Quiet Luxury 2026",
      subtitle: "Uncompromising minimalism and sustainable textile craftsmanship.",
      cta: "Explore Collection",
      ctaLink: "/collections/new-arrivals-2026",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
      active: true,
      order: 1,
    },
    {
      title: "Summer Architectural Cuts",
      subtitle: "Breathable European linens cut with clean, oversized precision.",
      cta: "Shop Summer Edit",
      ctaLink: "/collections/summer-luxury-edit",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600",
      active: true,
      order: 2,
    },
  ];

  for (const s of slides) {
    const existing = await prisma.heroSlide.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.heroSlide.create({ data: s });
    }
  }

  const promoBanners = [
    {
      text: "Complimentary islandwide courier shipping on all orders over LKR 15,000",
      link: "/collections/all",
      bgColor: "#0f0f11",
      active: true,
      type: "PROMO",
    },
  ];

  for (const b of promoBanners) {
    const existing = await prisma.banner.findFirst({ where: { text: b.text } });
    if (!existing) {
      await prisma.banner.create({ data: b });
    }
  }

  console.log("=========================================");
  console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=========================================");
  console.log("Dev Credentials:");
  console.log("  • Super Admin:    superadmin@masky.space / Password123!");
  console.log("  • Store Admin:    admin@masky.space      / Password123!");
  console.log("  • Branch Manager: manager@masky.space    / Password123!");
  console.log("  • Cashier:        cashier@masky.space    / Password123!");
  console.log("  • Customer:       customer@masky.space   / Password123!");
  console.log("=========================================");
}

seedComprehensive()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
