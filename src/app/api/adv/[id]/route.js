import { NextResponse } from 'next/server';
import dbConnect from '@/server/lib/mongodb';
import adv from '@/server/models/advSchema';
import user from '@/server/models/userSchema';

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await req.json();
    
    let updateData = { ...body };
    
    
    if (body.action === 'accept') {
      updateData = {
        status: 'قيد الاستلام',
        collectorId: body.collectorId,
        collectorName: body.collectorName,
        collectorPhone: body.collectorPhone
      };
    } 
    
    else if (body.action === 'cancel') {
      updateData = {
        status: 'متاح',
        $unset: { collectorId: "", collectorName: "", collectorPhone: "" }
      };
    }
    
    else if (body.action === 'complete') {
      
      updateData = { status: 'مكتمل' };

      
      const listing = await adv.findById(id);
      if (listing?.authorId) {
        try {
          await user.findByIdAndUpdate(listing.authorId, { $inc: { points: 15 } });
        } catch (updateError) {
          console.error("Failed to update user points:", updateError);
        }
      }
    }

    const updated = await adv.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const id = resolvedParams.id;

    await adv.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}