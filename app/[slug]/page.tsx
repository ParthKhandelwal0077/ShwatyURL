import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function SlugRedirectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Use a raw query to fetch the URL
  const result = await prisma.$queryRaw`
    SELECT "id", "originalUrl", "expiresAt"
    FROM "Url"
    WHERE "shortSlug" = ${slug}
    LIMIT 1
  ` as Array<{ id: string; originalUrl: string; expiresAt: Date | null }>;

  const url = result[0];

  if (!url) {
    redirect('/not-found');
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
    redirect('/expired');
  }

  // Increment clickCount
  await prisma.$executeRaw`
    UPDATE "Url" SET "clickCount" = "clickCount" + 1 WHERE "id" = ${url.id}
  `;

  redirect(url.originalUrl);
  return null;
} 