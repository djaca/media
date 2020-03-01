import axios from 'axios'

axios.defaults.baseURL = 'https://api.themoviedb.org/3'

const key = `5579fa8b31d9d5eb6d527d9ff84becad`

export const getMediaItems = (mediaType, type, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`${mediaType}/${type}?api_key=${key}&language=en-US&page=${page}&include_adult=false`)

      resolve(data.results.map(item => parseResults(item)))
    } catch (err) {
      reject(err)
    }
  })
}

export const search = query => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`search/multi?query=${query}&api_key=${key}&language=en-US&page=1&include_adult=false`)

      resolve(data.results.filter(item => item.media_type !== 'person').map(item => {
        let data = parseResults(item)

        data.type = item.media_type

        return data
      }))
    } catch (err) {
      reject(err)
    }
  })
}

export const getSingleMedia = (mediaType, id) => {
  return axios.all([
    axios.get(`${mediaType}/${id}?api_key=${key}&language=en-US`),
    axios.get(`${mediaType}/${id}/credits?api_key=${key}&language=en-US`),
    axios.get(`${mediaType}/${id}/videos?api_key=${key}&language=en-US`),
    axios.get(`${mediaType}/${id}/recommendations?api_key=${key}&language=en-US`),
    axios.get(`${mediaType}/${id}/similar?api_key=${key}&language=en-US`),
    axios.get(`${mediaType}/${id}/external_ids?api_key=${key}&language=en-US`)
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
      year: (data.release_date || data.first_air_date).substr(0, 4),
      overview: data.overview,
      cast: cast.data.cast,
      videos: videos.data.results.filter(video => video.site === 'YouTube'),
      recommendations: recommendations.data.results.slice(0, 12).map(item => parseResults(item)),
      similar: similar.data.results.slice(0, 12).map(item => parseResults(item)),
      seasons: data.seasons ? data.seasons.map(item => parseSeasons(item)) : null,
      lastAirDate: data.last_air_date
    }
  }))
}

export const getSeason = async (id, season) => {
  try {
    const { data } = await axios.get(`tv/${id}/season/${season}?api_key=${key}&language=en-US`)

    return data
  } catch (err) {
    console.log(err)
  }
}

const parseResults = item => {
  return {
    id: item.id,
    title: item.name || item.title,
    img: item.poster_path,
    year: parseYear((item.release_date || item.first_air_date))
  }
}

const parseSeasons = item => {
  return {
    id: item.id,
    title: item.name,
    img: item.poster_path,
    seasonNumber: item.season_number,
    year: parseYear(item.air_date)
  }
}

const parseYear = date => {
  return date && date !== '' ? date.substr(0, 4) : ''
}
