import axios from 'axios'

export function getTorrentsFor (type, id) {
  type = type === 'tv' ? 'show' : 'movie'

  return axios.get(`https://tv-v2.api-fetch.website/${type}/${id}`)
}
