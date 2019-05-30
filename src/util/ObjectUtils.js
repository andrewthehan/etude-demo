
export default {
  checkAllNotNull: (...objects) => {
    return objects.every(o => o != null);
  }
}