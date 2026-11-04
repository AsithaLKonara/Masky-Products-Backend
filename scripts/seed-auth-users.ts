import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma';
import { RoleService } from '../src/services/role.service';

async function main() {
  console.log('--- Seeding Roles, Permissions & Auth Users for MASKY PRODUCT ---');

  // 1. Seed Permissions & System Roles
  console.log('1. Seeding system permissions and base roles...');
  await RoleService.seedDefaultRolesAndPermissions();

  const allPermissions = await prisma.permission.findMany();
  console.log(`Found ${allPermissions.length} permissions in database.`);

  // 2. Ensure "Store Admin" and "Branch Manager" roles exist
  console.log('2. Ensuring Store Admin and Branch Manager roles...');
  const storeAdminRole = await prisma.role.upsert({
    where: { name: 'Store Admin' },
    update: {
      description: 'Operations Admin: Catalog, orders, customers & inventory',
      isSystem: true,
      status: 'Active',
    },
    create: {
      name: 'Store Admin',
      description: 'Operations Admin: Catalog, orders, customers & inventory',
      isSystem: true,
      status: 'Active',
    },
  });

  // Assign store admin permissions (all except deep system configs)
  const storeAdminPermCodes = allPermissions
    .map((p) => p.code)
    .filter((c) => !c.startsWith('system:'));
  for (const perm of allPermissions.filter((p) => storeAdminPermCodes.includes(p.code))) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: storeAdminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: storeAdminRole.id,
        permissionId: perm.id,
      },
    });
  }

  const branchManagerRole = await prisma.role.upsert({
    where: { name: 'Branch Manager' },
    update: {
      description: 'Store shifts, staff & inventory transfers for assigned branch',
      isSystem: true,
      status: 'Active',
    },
    create: {
      name: 'Branch Manager',
      description: 'Store shifts, staff & inventory transfers for assigned branch',
      isSystem: true,
      status: 'Active',
    },
  });

  const branchAdminRole = await prisma.role.findUnique({ where: { name: 'Branch Admin' } });
  if (branchAdminRole) {
    const branchPerms = await prisma.rolePermission.findMany({ where: { roleId: branchAdminRole.id } });
    for (const bp of branchPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: branchManagerRole.id,
            permissionId: bp.permissionId,
          },
        },
        update: {},
        create: {
          roleId: branchManagerRole.id,
          permissionId: bp.permissionId,
        },
      });
    }
  }

  // 3. Ensure Default Branch exists
  console.log('3. Ensuring default branch exists...');
  let flagshipBranch = await prisma.branch.findFirst({
    where: { code: 'MSK-MAIN' },
  });

  if (!flagshipBranch) {
    flagshipBranch = await prisma.branch.create({
      data: {
        name: 'Masky Flagship Store',
        code: 'MSK-MAIN',
        address: 'No. 45, Dehiattakandiya Agri Zone, Colombo / Dehiattakandiya',
        phone: '+94783130967',
        type: 'MAIN',
        isActive: true,
      },
    });
    console.log(`Created Flagship Branch: ${flagshipBranch.name} (${flagshipBranch.id})`);
  } else {
    console.log(`Flagship Branch already exists: ${flagshipBranch.name} (${flagshipBranch.id})`);
  }

  // 4. Fetch all necessary roles
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
  const cashierRole = await prisma.role.findUnique({ where: { name: 'Cashier' } });
  const publicUserRole = await prisma.role.findUnique({ where: { name: 'PUBLIC_USER' } });

  if (!superAdminRole || !cashierRole || !publicUserRole) {
    throw new Error('Required roles missing after seeding.');
  }

  // 5. Seed credentials
  const defaultPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const usersToSeed = [
    {
      email: 'superadmin@masky.space',
      name: 'Super Admin',
      phone: '+94700000001',
      roleId: superAdminRole.id,
      branchId: flagshipBranch.id,
    },
    {
      email: 'admin@masky.space',
      name: 'Store Admin',
      phone: '+94700000002',
      roleId: storeAdminRole.id,
      branchId: flagshipBranch.id,
    },
    {
      email: 'manager@masky.space',
      name: 'Branch Manager',
      phone: '+94700000003',
      roleId: branchManagerRole.id,
      branchId: flagshipBranch.id,
    },
    {
      email: 'cashier@masky.space',
      name: 'POS Cashier',
      phone: '+94700000004',
      roleId: cashierRole.id,
      branchId: flagshipBranch.id,
    },
    {
      email: 'customer@masky.space',
      name: 'VIP Customer',
      phone: '+94783130967',
      roleId: publicUserRole.id,
      branchId: null,
      isCustomer: true,
    },
  ];

  console.log('4. Upserting users with Password123!...');
  for (const u of usersToSeed) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        password: hashedPassword,
        phone: u.phone,
        status: 'ACTIVE',
        branchId: u.branchId,
      },
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        phone: u.phone,
        status: 'ACTIVE',
        branchId: u.branchId,
      },
    });

    // Link UserRole
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: u.roleId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: u.roleId,
      },
    });

    // If customer, mirror to Customer and create LoyaltyAccount
    if (u.isCustomer) {
      const customer = await prisma.customer.upsert({
        where: { email: u.email },
        update: {
          firstName: 'VIP',
          lastName: 'Customer',
          phone: u.phone,
          isGuest: false,
        },
        create: {
          email: u.email,
          firstName: 'VIP',
          lastName: 'Customer',
          phone: u.phone,
          isGuest: false,
        },
      });

      await prisma.loyaltyAccount.upsert({
        where: { customerId: customer.id },
        update: {
          points: 1250,
          lifetimePoints: 1250,
          tier: 'Gold',
        },
        create: {
          customerId: customer.id,
          points: 1250,
          lifetimePoints: 1250,
          tier: 'Gold',
        },
      });
      console.log(`   ✓ Mirrored Customer & LoyaltyAccount (1,250 pts) for ${u.email}`);
    }

    console.log(`   ✓ Seeded ${u.name} (${u.email}) [Role ID: ${u.roleId}]`);
  }

  console.log('--- All auth credentials seeded successfully! ---');
}

main()
  .catch((e) => {
    console.error('Error seeding auth credentials:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
