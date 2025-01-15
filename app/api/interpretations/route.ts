import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// create interpretation
async function createInterpretation(data: {
  term: string;
  interpretation: string;
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6786c7eb003c9f22421c", // Ensure this is the correct collection ID
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating interpretation", error);
    throw new Error("Failed to create interpretation");
  }
}

// fetch interpretation
async function fetchInterpretations() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6786c7eb003c9f22421c", // Ensure this is the correct collection ID
      [Query.orderDesc("$createdAt")] // Fixed space in query
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching interpretation", error);
    throw new Error("Failed to fetch interpretation");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const response = await createInterpretation(data);
    return NextResponse.json({ message: "Interpretation created" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create interpretation"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      const interpretations = await fetchInterpretations();
      console.log("API response:", interpretations); // Add this log
      return NextResponse.json(interpretations);
    } catch (error) {
      console.error("API error:", error); // Add this log
      return NextResponse.json(
        { error: "Failed to fetch interpretations" },
        { status: 500 }
      );
    }
  }
 