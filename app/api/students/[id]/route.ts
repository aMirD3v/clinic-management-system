import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  const { id } = await params;
  const encodedId = encodeURIComponent(id);

  // First, perform the fetch and get the Response object
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/${encodedId}`
  );

  // If the API gave us a 404, bail out here
  if (res.status === 404) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  // If any other non-2xx, bubble up a generic error
  if (!res.ok) {
    return NextResponse.json(
      { error: "Unable to fetch student" },
      { status: res.status }
    );
  }

  // Only now do we parse the JSON body
  const student = await res.json();

  // (Optionally) do an additional sanity check:
  // if (!student.id) return NextResponse.json({ error: ... }, { status: 404 });

  return NextResponse.json(student);
}
