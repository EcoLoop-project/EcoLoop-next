import { NextResponse } from 'next/server';
import dbConnect from '@/server/lib/mongodb';
import adv from '@/server/models/advSchema';


export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const advs = await adv.find({}).sort({ createdAt: -1 });
    return NextResponse.json(advs);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    
    const newAdv = await adv.create(body);

    return NextResponse.json(newAdv);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'Failed to add adv' }, { status: 500 });
  }
}