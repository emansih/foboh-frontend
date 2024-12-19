# FOBOH take home assignment

This is the react frontend application for FOBOH take home assignment written in typescript. I used vite to generate the template. 

## Tech used
- React
- Typescript
- Axios for data fetching 

## Running the software

To run this software, make sure you have npm installed. 

To run this software locally, 

```
npm run install
npm run dev
```

The application will now be running on `http://localhost:5173`

Make sure the backend application is also running!

## Things I have done in this project

- I used Material UI for styling the components

- I assumed the currency returned is in AUD and formatted them in 2 decimal places. (For more information on this, please read the README.md in the backend application. )

- I did not use enums for adjustment modes and types, instead I use strings. This could be improved. 

- The backend URL is hardcoded to localhost(located in Constants.ts), in a production environment this is a bad idea. Instead, the code should be looking for a system environment variable as local dev environment will be different from remote environment. 

- I did not use Jest for unit testing, I manually tested the UI. In the future, I could also use puppeteer / Selenium for testing the UI behaviors. 

- The code for `App.tsx` could be split into different components as currently, all the UI code is in 1 file. 