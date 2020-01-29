# A Better Search Tool for Harmonized Tariff Schedule (Frontend - Repo)

### Aim

Improve HTS search function in both keyword and HTS code support to retrieve its associated descriptions and details. Making the search more robust and flexible.

### Goals

1. Make HTS Query backend API, to search for item description given keywords, or hts code.
2. Create a better user experience by improving upon the display of the data via its parent-child relationship.
3. Allow API calls to update the backend with latest HTS tariffs updates manually (Upload) or automatically (Web Automation,scrapping)

### Strategy

1. Develop using MERN Stack
   > - MongoDb
   > - Express Framework
   > - React
   > - NodeJS
2. Data retrieval
   > - NightmareJS (headless browsing automation) to retrieve latest HTS_Code csv file
3. Data enhancement using Python libraries
   > - Converting lengthly description into keywords for search
   > - Removal of stopwords from keywords
   > - NLTK for lemmatizer
   > - Textblob to add plural and singular
   > - Adding Parent Child Relationship for the data based on indentation
   > - Ancestry details to better display on ant design
4. MongoDB
   > - Saving the modified data onto Mongo Database
5. Backend
   > - NodeJS to handle HTTP request from react frontend
6. Frontend
   > - Search box to search for item keywords
   >   > - Search via keywords
   >   > - Search via Hts code (Using Regex to hit /searchc endpoint)
   > - Display the details on react frontend with a Ant design nested table
   > - Update button to get the latest HTS Tariff Schedule from hts.usitc.gov
   > - Local upload button to manually upload HTS Tariff Schedule incase of server maintenance

### API Endpoints

1. Search
   > - /Search - Search By keyword, can take multiple keywords, separated by spaces
   > - /Search - Search By HTS_Code, done with regex, its catches anything that matches the hts code
2. Update
   > - /fetch/getLatest - Web scrapes for latest, data/keyword enhancement, before saving to the database.
   > - /fetch/getLocal - User uploads hts_code.csv file, data/keyword enhancement, before saving to the database
   > - /fetch/getLastUpdate - Returns the timestamp for the last online update

### Displaying data

> > 1. Extracted table - Contains the list of results of both the exact hit as well as its parents based on the search query.
> > 2. Expanded List - Contains a list based on the ancestry column. This would provide the expansion and indentation functionalities.
> > 3. Hit List - Contains a list where it is an exact match based on the search query. This provides the highlighted hits functionality.

## Built With

### ReactJS

-[Ant Design](https://ant.design/) - React UI library with a set of high-quality React components.

- [Axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js

- [lodash](https://lodash.com/) - A modern JavaScript utility library delivering modularity, performance & extras.
- [socket.io](https://www.npmjs.com/package/socket.io) - Socket.IO enables real-time bidirectional event-based communication.

-[Moment.js](https://momentjs.com/) - JavaScript library for working with dates and times.

-[React Spinner](https://www.npmjs.com/package/react-spinners) - A collection of loading spinners with React.js based.

#### Available Scripts

In the project directory, you can run:

### `npm install`

Allows the package manager to download all dependencies before starting the project

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Documented by

- Zenger Soong Cun Yuan
- Herman Wong
