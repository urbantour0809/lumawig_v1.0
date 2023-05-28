export const loadTokenizer = async (url) => {
    const response = await fetch(url)
    const tokenizer = await response.json()
    return tokenizer
  }
  
  export default loadTokenizer