# ✈️ TravelMate AI: A Multi-Agent Travel Planner with LangGraph

An open-source AI travel assistant that turns a natural-language trip request into a practical travel plan with live flight data, hotel and destination suggestions, and a day-by-day itinerary. The project uses a multi-agent workflow built with LangGraph, LangChain, and FastAPI.

## Why this project?

Planning a trip usually means jumping between multiple websites, tools, and spreadsheets. This project brings that flow into one experience by combining:

- a flight-search agent,
- a web-research agent for hotels, destinations, and travel advisories,
- an itinerary-planning agent, and
- a final response agent,

all coordinated through a LangGraph workflow.

## Features

- ✈️ Live flight status lookup via AviationStack, with natural-language route parsing (city, country, or IATA code)
- 🔍 Web search for hotels, attractions, and travel info using Tavily
- 🧠 Multi-agent orchestration with LangGraph
- 📝 Structured travel itinerary generation
- 🌐 FastAPI backend with a simple web interface
- 💾 Conversation state persistence using PostgreSQL
- ⚡ LLM-powered responses with Groq

## Tech Stack

- Python 3.11
- FastAPI
- Jinja2 + HTML/CSS/JavaScript front# ai_proj_travel_mate








end
- LangGraph
- LangChain
- Groq LLMs
- PostgreSQL
- Tavily API
- AviationStack API

## Project Structure

```text
.
├── app.py                # FastAPI app entry point
├── backend.py             # LangGraph travel workflow
├── requirements.txt       # Python dependencies
├── static/                # Static frontend assets
├── templates/              # HTML templates
└── tools/
    ├── tavily_search.py     # Web search tool (hotels, destinations, travel info)
    └── flight_search.py     # Flight lookup tool (AviationStack + location resolution)
```

## Prerequisites

Before running the project locally, make sure you have:

- [Miniconda](https://docs.anaconda.com/miniconda/) or Anaconda installed
- PostgreSQL running and accessible
- API keys for:
  - Groq
  - Tavily
  - AviationStack

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/travel_db
GROQ_API_KEY=your_groq_api_key
AVIATIONSTACK_API_KEY=your_aviationstack_api_key
TAVILY_API_KEY=your_tavily_api_key
DEFAULT_ORIGIN_IATA=DAC
```

> `DEFAULT_ORIGIN_IATA` is the fallback departure airport used when a user only mentions a destination (e.g. "Japan trip"). Change this to your own default location's airport code if needed.

## Installation

```bash
conda create -n travel python=3.11 -y
conda activate travel
pip install -r requirements.txt
```

## Running the App

Start the FastAPI server:

```bash
python app.py
```

Then open your browser at:

```text
http://127.0.0.1:8000/
```

## API Endpoints

- `GET /health` — Health check
- `POST /api/travel` — Submit a travel request

Example request:

```bash
curl -X POST http://127.0.0.1:8000/api/travel \
  -H "Content-Type: application/json" \
  -d '{"message":"Plan a 3-day trip to Tokyo with a budget of $1200"}'
```

## How the Workflow Works

1. The user submits a travel request.
2. The flight agent parses the request (origin, destination, dates) and fetches live flight data.
3. The web-search agent gathers hotel, attraction, and destination information.
4. The itinerary agent combines both into a practical day-by-day travel plan.
5. The final agent formats the result into a polished response.

## Known Limitations

- AviationStack's flight data reflects live/status information, not ticket prices. For fare estimates, a dedicated pricing API (e.g. Amadeus) would need to be integrated separately.
- Location parsing relies on a curated set of countries, cities, and aliases — uncommon or ambiguous location names may not resolve correctly.

## Contributing

Contributions are welcome. If you want to improve the app, add new travel features, or fix issues:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request

## Acknowledgments

This project is built with the help of modern LLM tooling and travel APIs, and it is intended as a practical example of combining LangGraph agents with real-world applications.