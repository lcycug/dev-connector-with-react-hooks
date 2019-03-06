export default value => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "object" && Object.keys(value).length === 0) || // Used for Object {} and Array []
    (typeof value === "string" && value.trim().length === 0)
  );
};
