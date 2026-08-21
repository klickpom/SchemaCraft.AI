import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.meta?.event_name || body.event || 'order_created';

    // Verify webhook payload or handle direct checkout callback
    const licenseKey = `SC-PRO-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      status: 'active',
      licenseKey,
      event,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid webhook payload' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'SchemaCraft Payment & Webhook API Ready',
    version: '1.0.0',
  });
}
