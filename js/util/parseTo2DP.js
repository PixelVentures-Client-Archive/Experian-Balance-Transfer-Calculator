
export default function parseTo2DP (val) {
  try {
    return parseFloat(parseFloat(val, 10).toFixed(2), 10)
  } catch (e) {
    console.error('ERROR parsing value: %s', val, e)
  }
}
