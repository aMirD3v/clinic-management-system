import { NextResponse } from "next/server";

// Example dummy fetch — replace with real student API call
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const student = await fetch(`http://localhost:3001/api/students/${id}`).then(res => res.json());

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}
