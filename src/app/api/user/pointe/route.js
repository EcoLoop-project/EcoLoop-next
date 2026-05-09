import { NextResponse } from 'next/server';
import dbConnect from '@/server/lib/mongodb';
import user from '@/server/models/userSchema';

export async function PUT(req) {
  try {
    await dbConnect();
    const { userId, points } = await req.json();

    if (!userId || points === undefined) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const updated = await user.findByIdAndUpdate(
      userId,
      { points },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update points error:', error);
    return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
  }
}