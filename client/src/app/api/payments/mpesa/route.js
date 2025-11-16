export async function POST(req) {
  try {
    const body = await req.json();

    // Dummy simulation response for now
    return Response.json({
      success: true,
      message: "Simulated MPesa payment OK",
      data: body
    });
  } catch (err) {
    console.error("MPESA API ERROR:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
