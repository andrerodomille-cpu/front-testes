interface ConfigType {
  URL_SERVICE: string;
  HEADER_REQUEST: {
    Accept: string;
  };
}

const Config: ConfigType = {
  URL_SERVICE: import.meta.env.VITE_API_URL,
  HEADER_REQUEST: {
    Accept: "application/json",
  },
};

export default Config;
