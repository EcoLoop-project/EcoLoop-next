import { NextResponse } from 'next/server';
import dbConnect from '@/server/lib/mongodb';
import user from '@/server/models/userSchema'; 

export async function GET(req) {
  try {
    await dbConnect();
    
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    
    const userData = await user.findById(userId);
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: 'User not found' }, { status: 500 });
  }
}