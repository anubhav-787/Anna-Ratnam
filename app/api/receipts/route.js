import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''

  const dbUser = await prisma.user.findUnique({ where: { clerkuserID: clerkId } })
  if (!dbUser) return NextResponse.json([])

  const receipts = await prisma.receipt.findMany({
    where: {
      userId: dbUser.id,
      ...(query && {
        OR: [
          { merchant:    { contains: query, mode: 'insensitive' } },
          { category:    { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(receipts)
}

export async function DELETE(request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  await prisma.receipt.delete({ where: { id } })

  return NextResponse.json({ success: true })
}