const production = {
  url: {
    API_URL: 'https://data-fitting.wtools.us/api'
  }
};

const development = {
  url: {
    API_URL: 'http://localhost:8000'
  }
};

export const config = process.env.NODE_ENV === 'development' ? development : production;
