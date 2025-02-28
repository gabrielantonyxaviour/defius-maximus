export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const credId = searchParams.get("credId");
  try {
    const response = await fetch(
      "https://issuer.humanity.org/credentials/revoke",
      {
        method: "POST",
        headers: {
          "X-API-Token": process.env.HUMANITY_PROTOCOL as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credentialId: credId,
        }),
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (e) {
    return Response.json(
      {
        error: "Failed to revoke credential",
      },
      {
        status: 500,
      }
    );
  }
}
