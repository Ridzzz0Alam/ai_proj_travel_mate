from tools.tavily_tool import tavily_search
from tools.flight_tool import search_flights

#res = tavily_search("Best hotels in Budapest")
#print(res)


res = search_flights("Plan a 7 days Japan trip from Bangladesh")
print(res)

"""
user_input - input("Enter travel Request: ")

response = run_travel_agent(
    user_inout=user_input,
    thread_id="test_user"
)

print("\nFINAL RESPONSE:\n")
print(response["answer"])

"""