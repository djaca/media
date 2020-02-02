import axios from 'axios'

const key = `5579fa8b31d9d5eb6d527d9ff84becad`
const lang = 'en-US'

axios.defaults.baseURL = 'https://api.themoviedb.org/3'

export const getMediaItems = (mediaType, type, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`${mediaType}/${type}?api_key=${key}&language=${lang}&page=${page}&include_adult=false`)

      resolve(data.results.map(item => {
        return {
          id: item.id,
          title: item.name || item.title,
          img: item.poster_path
        }
      }))
    } catch (err) {
      reject(err)
    }
  })
}

export const getSingleMedia = (mediaType, id) => {
  return axios.all([
    axios.get(`${mediaType}/${id}?api_key=${key}&language=${lang}`),
    axios.get(`${mediaType}/${id}/credits?api_key=${key}&language=${lang}`),
    axios.get(`${mediaType}/${id}/videos?api_key=${key}&language=${lang}`),
    axios.get(`${mediaType}/${id}/recommendations?api_key=${key}&language=${lang}`),
    axios.get(`${mediaType}/${id}/similar?api_key=${key}&language=${lang}`),
    axios.get(`${mediaType}/${id}/external_ids?api_key=${key}&language=${lang}`)
  ]).then(axios.spread(function ({ data }, cast, videos, recommendations, similar, externalIds) {
    return {
      id: data.id,
      imdbId: externalIds.data.imdb_id,
      title: data.name || data.title,
      img: data.poster_path,
      votes: data.vote_average,
      runtime: data.runtime || data.episode_run_time[0],
      genres: data.genres.map(genre => genre.name),
      status: data.status,
      releaseDate: data.release_date || data.first_air_date,
      overview: data.overview,
      cast: cast.data.cast,
      videos: videos.data.results.filter(video => video.site === 'YouTube'),
      recommendations: recommendations.data.results.slice(0, 12).map(item => {
        return {
          id: item.id,
          title: item.name || item.title,
          img: item.poster_path
        }
      }),
      similar: similar.data.results.slice(0, 12).map(item => {
        return {
          id: item.id,
          title: item.name || item.title,
          img: item.poster_path
        }
      }),
      seasons: data.seasons
        ? data.seasons.map(item => {
          return {
            id: item.id,
            title: item.name,
            img: item.poster_path,
            seasonNumber: item.season_number
          }
        })
        : null
    }
  }))
}

export const getSeason = async (id, season) => {
  try {
    const { data } = await axios.get(`tv/${id}/season/${season}?api_key=${key}&language=${lang}`)

    return data
  } catch (err) {
    console.log(err)
  }
}
