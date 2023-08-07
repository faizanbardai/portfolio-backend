/*
  This function checks if a string is a valid url
  (ftp, http, https) => starts with either of these
  :// => followed by this
  [^ "]+ => followed by any character except space or "
  $ => end of string
*/

const isValidUrl = (url: string): boolean => {
  const regex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
  return regex.test(url);
};

export default isValidUrl;
