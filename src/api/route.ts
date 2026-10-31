import { NextResponse } from "next/server";

export async function GET() {

  try {
    return NextResponse.json(
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        }
      }
    ) 
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        } 
      } 
    ) 
  }

}
