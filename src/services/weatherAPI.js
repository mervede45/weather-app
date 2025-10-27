import axios from 'axios'
//Tarayıcılar güvenlik için localhost:3000'den wttr.in'e direkt istek atmayı engelliyor (CORS). bunun içi weatherAPI bunu aşmak için ıoluşturuldu.
// Farklı CORS proxy servisleri
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://thingproxy.freeboard.io/fetch/'
]

export const fetchWeatherFromAPI = async (cityName) => {
  const baseURL = `https://wttr.in/${cityName}?format=j1`
  
  // Önce direkt deneme
  try {
    const response = await axios.get(baseURL)
    return response.data//API'nin gönderdiği JSON verisini alıyoruz.
  } catch (directError) {
    console.log("Doğrudan istek başarısız oldu, proxy'ler deneniyor...")
  }

  // Proxy'ler ile deneme
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await axios.get(`${proxy}${baseURL}`)
      return response.data
    } catch (proxyError) {
      console.log(`Proxy ${proxy} başarısız`)
      continue
    }
  }

  throw new Error('Tüm API çağrıları başarısız')
}