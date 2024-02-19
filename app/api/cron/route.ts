import {NextResponse} from 'next/server';
import {lucia} from '@/util/auth';

export async function GET() {
  try {
    await lucia.deleteExpiredSessions();
    return NextResponse.json({success: true});
  } catch (e: any) {
    return NextResponse.json({success: false, error: e});
  }
}
