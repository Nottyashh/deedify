import { PrismaClient } from '@prisma/client';
import { mockData } from './mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.vote.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.order.deleteMany();
  await prisma.shareToken.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.document.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const users = await Promise.all(
    mockData.users.map(user =>
      prisma.user.create({
        data: user,
      })
    )
  );

  console.log(`✅ Created ${users.length} users`);

  // Create listings
  console.log('🏞️ Creating listings...');
  const listings = await Promise.all(
    mockData.listings.map(listing =>
      prisma.listing.create({
        data: {
          ...listing,
          ownerId: users[Math.floor(Math.random() * users.length)].id,
        },
      })
    )
  );

  console.log(`✅ Created ${listings.length} listings`);

  // Create share tokens for some listings
  console.log('🎫 Creating share tokens...');
  let totalShareTokens = 0;
  for (const listing of listings.slice(0, 3)) {
    const shareTokens = await Promise.all(
      Array.from({ length: listing.totalShares }, (_, index) =>
        prisma.shareToken.create({
          data: {
            listingId: listing.id,
            mintAddress: `mint_${listing.id}_${index + 1}_${Date.now()}`,
            indexNumber: index + 1,
            metadataUri: `https://api.deedify.com/metadata/mint_${listing.id}_${index + 1}`,
          },
        })
      )
    );
    totalShareTokens += shareTokens.length;
  }

  console.log(`✅ Created ${totalShareTokens} share tokens`);

  // Create some orders
  console.log('📋 Creating orders...');
  const shareTokens = await prisma.shareToken.findMany({
    take: 10,
  });

  const orders = await Promise.all(
    shareTokens.slice(0, 5).map(shareToken =>
      prisma.order.create({
        data: {
          type: 'LIST',
          listingId: shareToken.listingId,
          shareMint: shareToken.mintAddress,
          sellerId: users[Math.floor(Math.random() * users.length)].id,
          price: 0.1 + Math.random() * 0.5, // Random price between 0.1 and 0.6 SOL
          status: 'OPEN',
        },
      })
    )
  );

  console.log(`✅ Created ${orders.length} orders`);

  // Create some proposals
  console.log('🗳️ Creating proposals...');
  const proposals = await Promise.all(
    listings.slice(0, 2).map(listing =>
      prisma.proposal.create({
        data: {
          listingId: listing.id,
          title: `Development proposal for ${listing.title}`,
          description: `This proposal outlines the development plan for ${listing.title}. We propose to build sustainable infrastructure while preserving the natural beauty of the land.`,
          startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Start in 1 day
          endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // End in 7 days
          status: 'OPEN',
        },
      })
    )
  );

  console.log(`✅ Created ${proposals.length} proposals`);

  // Create some votes
  console.log('🗳️ Creating votes...');
  const votes = await Promise.all(
    proposals.flatMap(proposal =>
      users.slice(0, 3).map(user =>
        prisma.vote.create({
          data: {
            proposalId: proposal.id,
            userId: user.id,
            weightDecimal: 1 + Math.random() * 5, // Random weight between 1 and 6
            choice: Math.random() > 0.5 ? 'YES' : 'NO',
          },
        })
      )
    )
  );

  console.log(`✅ Created ${votes.length} votes`);

  // Create some payouts
  console.log('💰 Creating payouts...');
  const payouts = await Promise.all(
    listings.slice(0, 2).map(listing =>
      prisma.payout.create({
        data: {
          listingId: listing.id,
          amount: 0.5 + Math.random() * 2, // Random amount between 0.5 and 2.5 SOL
          reason: Math.random() > 0.5 ? 'DIVIDEND' : 'BUYOUT',
        },
      })
    )
  );

  console.log(`✅ Created ${payouts.length} payouts`);

  // Create some documents
  console.log('📄 Creating documents...');
  const documents = await Promise.all(
    listings.slice(0, 3).flatMap(listing =>
      ['DEED', 'SURVEY', 'IMAGE'].map((kind, index) =>
        prisma.document.create({
          data: {
            listingId: listing.id,
            kind: kind as any,
            storagePath: `listings/${listing.id}/${kind.toLowerCase()}/doc_${index + 1}.pdf`,
            uploadedBy: users[Math.floor(Math.random() * users.length)].id,
          },
        })
      )
    )
  );

  console.log(`✅ Created ${documents.length} documents`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Listings: ${listings.length}`);
  console.log(`- Share Tokens: ${totalShareTokens}`);
  console.log(`- Orders: ${orders.length}`);
  console.log(`- Proposals: ${proposals.length}`);
  console.log(`- Votes: ${votes.length}`);
  console.log(`- Payouts: ${payouts.length}`);
  console.log(`- Documents: ${documents.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });