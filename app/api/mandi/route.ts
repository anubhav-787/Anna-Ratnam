export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const params = new URLSearchParams({
    "api-key": "579b464db66ec23bdd000001acced04e1fe44ba567595659abb7226b",
    "format": "json",
    "limit": "20"
  });

  const state = searchParams.get("state")?.trim();
  const district = searchParams.get("district")?.trim();
  const market = searchParams.get("market")?.trim();
  const commodity = searchParams.get("commodity")?.trim();
  const variety = searchParams.get("variety")?.trim();
  const grade = searchParams.get("grade")?.trim();

  if(state) params.append("filters[state.keyword]", state);
  if(district) params.append("filters[district]", district);
  if(market) params.append("filters[market]", market);
  if(commodity) params.append("filters[commodity]", commodity);
  if(variety) params.append("filters[variety]", variety);
  if(grade) params.append("filters[grade]", grade);

  const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${params.toString()}`;

  console.log("API URL:", url);

  const api = await fetch(url);
  const data = await api.json();

  console.log("API DATA:", data);

  return Response.json(data);
}