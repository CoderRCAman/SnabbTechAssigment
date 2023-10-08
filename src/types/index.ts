export type USER = {
  name: string;
  email: string;
  password: string;
  country: string;
};

export type COUNTRY_DATA_TYPE = {
  value: string;
  label: string;
};
export type INPUTS = {
  name: string;
  email: string;
  password: string;
  country: COUNTRY_DATA_TYPE
};


