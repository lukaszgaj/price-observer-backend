1. Stworzenie bazy (MongoDB?)
2. Zaprojektowanie struktury trzymanych danych
3. Napisanie API 
https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
https://medium.freecodecamp.org/build-restful-api-with-authentication-under-5-minutes-using-loopback-by-expressjs-no-programming-31231b8472ca
4. Zaprojektowanie sprytnego serwisu obserwującego ceny
a) załóżmy że cenę sprawdzamy co 10 min
b) żeby to miało sens trzebaby zrobić coś w rodzaju kolejki -> 
kolejne produkty wrzucane są na kolejkę, a po wykonaniu powinno zwrocić
dane a następnie wrzucić się spowrotem na koniec kolejki? inną kolejkę?
c) kolejka musi być przez coś konsumowana
5. Apropo konsumera - trzeba wymyślić sposób na wyciąganie ceny ze strony:
a) pewnie niektóre serwisy mają wystawione jakieś API
b) odczyt na podstawie podobieństw struktury HTML
c) może wystarczy zwykły REGEX? (co jeżeli będzie więcej niż jeden produkt na stornie)