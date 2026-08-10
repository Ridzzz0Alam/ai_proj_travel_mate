from tools.tavily_tool import tavily_search

res = tavily_search("Best hotels in Budapest")
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