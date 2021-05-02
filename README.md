# portfolio-App
This document explains the business requirements of a portfolio tracking API. 
Definitions 
Securities: A simple definition of a security is any proof of ownership or debt that has been assigned a value and may be sold. Example - Tata Consultancy Services Limited (TCS) one of the companies which became public in 2004 and investors can buy and sell shares of TCS. Currently price of 1 share (can call it quantity also) of TCS is Rs. 1,843.45. All the information is publicly available. Other listed companies - WIPRO (Wipro Limited), GODREJIND (Godrej Industries Ltd). 
Ticker Symbol: Every listed security has a unique ticker symbol, facilitating the vast array of trade orders that flow through the financial markets every day. Example - ticker for Tata Consultancy Services Limited is TCS, for Wipro Limited it is WIPRO. 
Portfolio: A portfolio is a grouping of financial assets such as stocks, bonds, commodities, currencies and cash equivalents, as well as their fund counterparts, including mutual, exchange-traded and closed funds. Example - Suppose the following securities are bought - 
Ticker symbol 
Average Buy Price 
Shares
TCS 
1,833.45 
5
WIPRO 
319.25 
10
GODREJIND 
535.00 
2



The above mentioned table constitutes a portfolio. Simply put, portfolio is group of securities with each one having an average price and quantity of shares. 
Suppose 5 more shares of GODREJIND are bought at Rs 400 (this is called placing a trade in the security). Now portfolio will look like -
Ticker symbol 
Average Buy Price 
Shares
TCS 
1,833.45 
5
WIPRO 
319.25 
10
GODREJIND 
(535*2 + 400*5)/(5 + 2) 
7



Observe carefully how price of GODREJIND is a weighted average of previous average buy price and the current trade price. 
Now suppose if 5 shares of WIPRO are sold (again by placing a trade), the portfolio will look like 
Ticker symbol 
Average Buy Price 
Shares
TCS 
1,833.45 
5
WIPRO 
319.25 
5
GODREJIND 
438.57 
7



Observe carefully how average price doesn’t change after selling off a few securities. This is because selling affects your returns, not the average price of the stocks bought. 

https://www.getpostman.com/collections/0836a733107fa1cc5529

POSTMAN LINK

1. do git pull
2. npm install
3. update mongo Values, hash keys etc in  a .env file
4. npm run dev
