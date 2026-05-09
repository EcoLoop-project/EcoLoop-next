import { NextResponse } from 'next/server';
import dbConnect from '@/server/lib/mongodb';
import user from '@/server/models/userSchema';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    
    let rawPhone = body.phone ? String(body.phone) : '';
    let numbersOnly = rawPhone.replace(/\D/g, '');

    if (rawPhone.startsWith('00')) {
      numbersOnly = numbersOnly.substring(2);
    }

    let normalizedPhone = numbersOnly ? '+' + numbersOnly : '';

    if (!normalizedPhone) {
      return NextResponse.json({ error: 'رقم الهاتف غير صالح' }, { status: 400 });
    }

    
    const existingUser = await user.findOne({ phone: normalizedPhone });

    if (existingUser) {
      
      if (existingUser.role !== body.role) {
        return NextResponse.json(
          { error: `هذا الرقم مسجل مسبقاً كـ "${existingUser.role === 'household' ? 'أهالي البيوت' : 'جامع نفايات'}". لا يمكن استخدامه لدور آخر.` },
          { status: 403 }
        );
      }

      
      return NextResponse.json(existingUser);
    }

    
    const newUser = await user.create({
      name: body.name,
      phone: normalizedPhone,
      role: body.role,
      points: body.role === 'household' ? 50 : 0,
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}