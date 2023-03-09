const cheerio = require('cheerio')
const axios = require('axios');
const querystring = require('querystring');
const slugify = require('slugify')
const BASE_URL = 'https://yugenanime.ro'

const getAnimes = async (args) => {
    const searchParams = { ...args }
    const newQueryString = querystring.stringify(searchParams)
    const searchURL = `${BASE_URL}/discover/?${newQueryString}`

    const response = await axios.get(searchURL)
    const html = response.data;
    const $ = cheerio.load(html);
    let data = [];
    const total = parseInt($('.ya-title').eq(0).text().match(new RegExp(/[0-9]+/))[0])
    const animeElem = $('.anime-meta');
    const has_pagination = $('.pagination').length;
    const no_next_page = $('ul').children().last().children().first().attr('disabled');
    const perPage = animeElem.length;
    animeElem.each((_idx, el) => {
        let details = {};
        const name = $(el).find('.anime-name').text().trim()
        const poster = $(el).find('img').attr('data-src')
        const _id = parseInt($(el).attr('href').match(/[0-9]+/)[0])
        const rating = parseFloat($(el).find('.option').text().trim())
        details['_id'] = _id
        details['name'] = name
        details['rating'] = rating
        details['poster'] = poster
        data.push(details)
    })
    return { 'total': total, 'has_next': has_pagination === 0 ? false : no_next_page === 'disabled' ? false : true, 'totol_per_page': perPage, data }
}

const getAnimeDetails = async (id, name) => {
    const slugedName = slugify(name, '-')
    const detailsURL = `${BASE_URL}/anime/${id}/${slugedName}`
    console.log(detailsURL);
    const response = await axios.get(detailsURL);
    const html = response.data;
    const $ = cheerio.load(html)
    const description =  $(".description").first().text().trim()
    let details = {}
    $(".data").each((_idx,el) => {
        const title = $(el).find(".ap--data-title").text().trim()
        const desc = $(el).find("span").text().trim()
        title !== 'External Links' ? details[title] = desc : null
    })
    details['description'] = description
    return {data:[details]}
}

module.exports = {
    getAnimes,
    getAnimeDetails
}
