### Mongoose Hook

A special function which fires after a certain mongoose event happens. E.g. a hook which fires a function after new documents are saved or deleted to the database.

### Password Hashing

At a basic level there are two steps involved in hashing:

- generate a salt and attach it to the password
- run our salt+password through a hashing algorithm

A hashing algorithm takes in text and generates a longer more seemingly random string. This alone isn't enough as hackers can reverse engineer simple hashed passwords. An extra step is generated a salt and and attach it to the password before it's hashed.

A salt is a string of characters separate from the password itself, so the end result is a hashed password and a salt combination which is stored in the database.

When a user tries to login we take the password they enter, add the salt to that password, hash it through the same hashing algorithm and then compare it with their hashed password stored in the database.

### Cookies

A way to store data in a user's browser. Can be used to track internet activity by services like google analytics.

How do they work?

- when a request is sent to our server we can create a cookie at that moment in time.
- We decide at that point what data the cookie will hold as well as things like how long the cookie should last.
- The cookie is then sent back to the browser in the server response. The browser registers it and that cookie can then store data inside the user's browser.
- Every request the browser makes to our server thereafter, it sends whatever cookies we stored to the server with that request and on that server we can access it.

This process is the backbone for how we will be authenticating users. Whereby the cookie holds a JWT to identify a user and when the server sees this they can verify and authenticate.

There are some pitfalls to be aware of when using cookies and JWT's like cross-site request forgery: potentially malicious websites can essentially steal a user's authenticated status to make harmful requests to a server.

If you are creating a site with 'state changing endpoints' for authenticated users, where the data could change, then you will need to research 'cross-site request forgery' mitigation strategies to put into place.

See: https://owasp.org/www-community/attacks/csrf

### Authenticating with Cookies and JSON Web Tokens (JWT)

First of all the user logs in via a web form from our website which sends a request to the server with their credentials an email and a password. The server then checks those credentials, the email and password against those stored in a database for that user. If they are correct the server then creates a json web token for the user and it sends it to the browser where it can be stored in a cookie. The json web token contains encoded data about that user to identify them, so for as long as they have this token in the cookie then they are considered logged in and authenticated.

Remember cookies are sent to the server by the browser for every request they make, so when the server gets that token from the cookie in the request it can verify and decode it to identify the user.

If it is verified to be a valid token the user can be seen as logged in by the server and the server can then decide to show the user protected data or pages which require the user to be authenticated.

If the token is missing or not valid the user is not authenticated and the server can send back some kind of error or direct them to the login page.

To repeat, using JWT's inside cookies for authentication does potentially open up your site to cross-site request forgery attacks. Now that means that a malicious site can take a user's authentication cookie and then make requests to our server posing as that user. If our server exposes state changing end points then this is a security risk because it means that the malicious site can then manipulate your user data and potentially access more of it.

### JWT Creation and Verification Process

https://jwt.io

An encoded long string of characters made up of three parts. Each part corresponds to three decoded versions of the three strings, the header, payload and verification signature.

The token header is a bit like metadata for the token and holds the algorithm used and token type. It tells the server what type of signature is being used.

The payload is data encoded into the JWT, which could be a userID and is used to identify the user. It's important no sensitive data is put inside this payload in case a token is intercepted by somebody, because it can be decoded by anyone that knows how. If we change the data in the payload then this changes the resulting encoded token (the corresponding string for the payload changes).

The verification signature is used to verify the token on the server. This ties everything together and it makes the JWT secure. It makes sure that tokens are not tampered with on the client and is a bit like a stamp of authenticity from the server.

How do they work together?

When our server is creating the JWT, after a user successfully logs in our signs up, it creates the headers and the payload parts first and encodes them both. To sign the token, it takes both of these two parts and it hashes them together with a secret, which is a secure secret string stored on the server. This secret must remain a secret because it's the key to unlocking the JWT and the only way to verify a token. Once those three parts are hashed together, it creates the token signature and adds it to the end of the JWT after the other two parts and can then be sent to the browser.

The resulting hashed token would look something like this:
Headers.Payload.Signature

Our JWT is then sent and stored in a browser so for any subsequent request to the server, the token is then received by the server inside the cookie. The server can then verify this token on every request by looking at the header and the payload and hashing them with the secret which is stored on the server.

If the hashed value of those two parts with the secret matches the signature (which is also the two parts + secret) then it knows that it's valid and the JWT has not been tampered with on the client.

If a JWT had been tampered with and modified on the client then the two parts, either the header or the payload would change and when hashed together would not result and match the token signature.
