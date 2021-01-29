export const getPinnedJSON = async () => {
  try {
    const URL = "https://api.pinata.cloud/data/pinList";
    const response = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ODA4YjdkYy0xYjM1LTQzNmItOGFmZC01Y2JkNTkwMzcyZjEiLCJlbWFpbCI6ImNlc2FyQGRvcmcudGVjaCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2V9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxY2MyOTQ4ZjZiODMyZDBiZWE5ZSIsInNjb3BlZEtleVNlY3JldCI6ImY0M2M5MTYwNmYxZTZlYmFmYzhiOGFkZTZiZmNlZTRiNzhkMWIxNTY2YWMwNDNhM2IwZTY5OGYwYjFhYjE1MTUiLCJpYXQiOjE2MTE4NzU1Njd9.WmInOLogenNlVoD-OLXIXppl7nvspgmA5b-dMx6luSg"}`,
      },
    });
    const result = await response.json();

    console.log(result);
    return result
  } catch (e) {}
};
