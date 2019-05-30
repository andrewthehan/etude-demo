
export default {
  toCamelCase: (s) => {
    return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
  }
}