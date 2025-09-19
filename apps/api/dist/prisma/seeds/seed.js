"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const mock_data_1 = require("./mock-data");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    await prisma.vote.deleteMany();
    await prisma.proposal.deleteMany();
    await prisma.order.deleteMany();
    await prisma.shareToken.deleteMany();
    await prisma.payout.deleteMany();
    await prisma.document.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    console.log('👥 Creating users...');
    const users = await Promise.all(mock_data_1.mockData.users.map(user => prisma.user.create({
        data: user,
    })));
    console.log(`✅ Created ${users.length} users`);
    console.log('🏞️ Creating listings...');
    const listings = await Promise.all(mock_data_1.mockData.listings.map(listing => prisma.listing.create({
        data: {
            ...listing,
            ownerId: users[Math.floor(Math.random() * users.length)].id,
        },
    })));
    console.log(`✅ Created ${listings.length} listings`);
    console.log('🎫 Creating share tokens...');
    let totalShareTokens = 0;
    for (const listing of listings.slice(0, 3)) {
        const shareTokens = await Promise.all(Array.from({ length: listing.totalShares }, (_, index) => prisma.shareToken.create({
            data: {
                listingId: listing.id,
                mintAddress: `mint_${listing.id}_${index + 1}_${Date.now()}`,
                indexNumber: index + 1,
                metadataUri: `https://api.deedify.com/metadata/mint_${listing.id}_${index + 1}`,
            },
        })));
        totalShareTokens += shareTokens.length;
    }
    console.log(`✅ Created ${totalShareTokens} share tokens`);
    console.log('📋 Creating orders...');
    const shareTokens = await prisma.shareToken.findMany({
        take: 10,
    });
    const orders = await Promise.all(shareTokens.slice(0, 5).map(shareToken => prisma.order.create({
        data: {
            type: 'LIST',
            listingId: shareToken.listingId,
            shareMint: shareToken.mintAddress,
            sellerId: users[Math.floor(Math.random() * users.length)].id,
            price: 0.1 + Math.random() * 0.5,
            status: 'OPEN',
        },
    })));
    console.log(`✅ Created ${orders.length} orders`);
    console.log('🗳️ Creating proposals...');
    const proposals = await Promise.all(listings.slice(0, 2).map(listing => prisma.proposal.create({
        data: {
            listingId: listing.id,
            title: `Development proposal for ${listing.title}`,
            description: `This proposal outlines the development plan for ${listing.title}. We propose to build sustainable infrastructure while preserving the natural beauty of the land.`,
            startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'OPEN',
        },
    })));
    console.log(`✅ Created ${proposals.length} proposals`);
    console.log('🗳️ Creating votes...');
    const votes = await Promise.all(proposals.flatMap(proposal => users.slice(0, 3).map(user => prisma.vote.create({
        data: {
            proposalId: proposal.id,
            userId: user.id,
            weightDecimal: 1 + Math.random() * 5,
            choice: Math.random() > 0.5 ? 'YES' : 'NO',
        },
    }))));
    console.log(`✅ Created ${votes.length} votes`);
    console.log('💰 Creating payouts...');
    const payouts = await Promise.all(listings.slice(0, 2).map(listing => prisma.payout.create({
        data: {
            listingId: listing.id,
            amount: 0.5 + Math.random() * 2,
            reason: Math.random() > 0.5 ? 'DIVIDEND' : 'BUYOUT',
        },
    })));
    console.log(`✅ Created ${payouts.length} payouts`);
    console.log('📄 Creating documents...');
    const documents = await Promise.all(listings.slice(0, 3).flatMap(listing => ['DEED', 'SURVEY', 'IMAGE'].map((kind, index) => prisma.document.create({
        data: {
            listingId: listing.id,
            kind: kind,
            storagePath: `listings/${listing.id}/${kind.toLowerCase()}/doc_${index + 1}.pdf`,
            uploadedBy: users[Math.floor(Math.random() * users.length)].id,
        },
    }))));
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
//# sourceMappingURL=seed.js.map