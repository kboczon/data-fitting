const production = {
  url: {
    API_URL: 'http://localhost:8000'
  }
};

const development = {
  url: {
    API_URL: 'http://localhost:8000'
  }
};

export const config = process.env.NODE_ENV === 'development' ? development : production;