export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  try {

    console.log("API KEY:", API_KEY);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();


    if (!res.ok) {
      return Response.json(
        { error: data.message || "API Error" },
        { status: 500 }
      );
    }

    if (!data.main || !data.weather || !data.wind) {
      return Response.json(
        { error: "Invalid data from API" },
        { status: 500 }
      );
    }

    return Response.json({
      city: data.name,
      temp: data.main.temp,
      weather: data.weather[0].main,
      wind: data.wind.speed
    });

  } catch (error) {
    console.error("ERROR:", error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}