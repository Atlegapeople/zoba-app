import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('zoba');
    
    // Find all diagrams with duplicate code, keeping the latest version
    const duplicates = await db.collection('diagrams').aggregate([
      {
        $group: {
          _id: "$code",
          latestDoc: { $first: "$$ROOT" },
          count: { $sum: 1 },
          docs: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    // Remove duplicates, keeping only the latest version
    for (const dup of duplicates) {
      const docsToRemove = dup.docs.filter((id: ObjectId) => 
        id.toString() !== dup.latestDoc._id.toString()
      );
      if (docsToRemove.length > 0) {
        await db.collection('diagrams').deleteMany({
          _id: { $in: docsToRemove }
        });
      }
    }

    // Get the cleaned up diagrams
    const diagrams = await db.collection('diagrams')
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();
    
    return NextResponse.json(diagrams);
  } catch (error) {
    console.error('Failed to fetch diagrams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagrams' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('zoba');
    
    const data = await request.json();
    const { name, code, type } = data;

    // Check if a diagram with this exact code already exists
    const existingDiagram = await db.collection('diagrams').findOne({ code });
    if (existingDiagram) {
      return NextResponse.json(
        { error: 'A diagram with this content already exists' },
        { status: 400 }
      );
    }

    const newDiagram = {
      name,
      code,
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection('diagrams').insertOne(newDiagram);
    return NextResponse.json({ ...newDiagram, _id: result.insertedId });
  } catch (error) {
    console.error('Failed to save diagram:', error);
    return NextResponse.json(
      { error: 'Failed to save diagram' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Diagram ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('zoba');
    
    const result = await db.collection('diagrams').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Diagram not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Diagram deleted successfully' });
  } catch (error) {
    console.error('Failed to delete diagram:', error);
    return NextResponse.json(
      { error: 'Failed to delete diagram' },
      { status: 500 }
    );
  }
} 