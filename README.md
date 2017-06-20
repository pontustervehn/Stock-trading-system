# Example project, Socket.IO + (-M)EAN stack.
This small project showcases some basic features and use case scenarios of AngularJS, Node.js, Express and socket.IO.


## Description
The website is supposed to simulate trading of shares between different people.
Users log in and get a unique userID.

Three types of items are handled: **Securities** (Shares, Stocks, etc.), **Orders** (Active Purchases and Sales Orders, as well as **Trades** (Completed transactions).

The user is able to perform the following three tasks:
● Add a Security: eg Add the stock Ericsson.
● Add an Order: e.g. Add a purchase order for 10 Nokia stocks for 15 SEK.
● List Trades: eg List all purchases involving Ericsson stocks.

A purchase is completed when a purchase order is matched with the price of a sales order. The oldest orders are matched first, and unless the orders are equal, the matching will continue until either or all of them match or there are no more orders with the right price. After that, any remainders of the orders are added to the system as new or updated orders.

## Structure
The code is split into 2 very distinct parts: API:server (app) and front end (public). The concept utilizes MVC pattern and the users get the server data through AJAX-calls.
