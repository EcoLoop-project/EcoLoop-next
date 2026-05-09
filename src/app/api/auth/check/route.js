import { NextResponse } from 'next/server';
import dbConnect from '@/server/lib/mongodb';
import user from '@/server/models/userSchema';

export async function POST(req) {
  try {
    await dbConnect();
    const { phone, name, role } = await req.json();

    
    let rawPhone = phone ? String(phone) : '';
    let numbersOnly = rawPhone.replace(/\D/g, '');
    if (rawPhone.startsWith('00')) numbersOnly = numbersOnly.substring(2);
    const normalizedPhone = numbersOnly ? '+' + numbersOnly : '';

    if (!normalizedPhone) {
      return NextResponse.json({ error: 'رقم الهاتف غير صالح' }, { status: 400 });
    }

    const existingUser = await user.findOne({ phone: normalizedPhone });

    
    if (!existingUser) {
      return NextResponse.json({ ok: true });
    }

    
    if (existingUser.role !== role) {
      return NextResponse.json(
        { error: `هذا الرقم مسجل كـ "${existingUser.role === 'household' ? 'أهالي البيوت' : 'جامع نفايات'}". لا يمكن استخدامه لدور آخر.` },
        { status: 403 }
      );
    }

    
    const incomingName = name?.trim().toLowerCase();
    const savedName = existingUser.name?.trim().toLowerCase();

    if (incomingName !== savedName) {
      return NextResponse.json(
        { error: 'هذا الرقم مرتبط باسم مختلف. الرجاء إدخال الاسم الصحيح المسجل مسبقاً.' },
        { status: 403 }
      );
    }

    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Check error:', error);
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 });
  }
}