import request from 'request-promise'
import cheerio from 'cheerio'
import ptn from 'parse-torrent-name'

const remote = request.defaults({
  json: true,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
  }
})

export function searchTorrents (keyword) {
  return remote.get(`https://thepiratebay.org/search/${keyword}/0/99/0`)
    .then(resp => cheerio.load(resp))
    .then($ => $('table#searchResult tr:has(a.detLink)')
      .map((i, x) => {
        let title = $(x).find('a.detLink').text()

        return {
          seeders: $(x).find('td[align="right"]').first().text(),
          leechers: $(x).find('td[align="right"]').next().text(),
          title,
          url: $(x).find('[title="Download this torrent using magnet"]').attr('href'),
          size: $(x).find('font.detDesc').text().split(',')[1].split(' ')[2],
          meta: ptn(title)
        }
      })
      .get()
      .slice(0, 10))
}
