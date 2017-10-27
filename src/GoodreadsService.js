import localForage from 'localforage';
import moment from 'moment';

export function GoodreadsException(code, message) {
   this.message = message;
   this.code = code;
   this.name = 'GoodreadsException';
}

export function GoodreadsUnauthenticatedException() {
   this.message = 'Unauthenticated';
   this.code = 401;
   this.name = 'GoodreadsUnauthenticatedException';
}

class GoodreadsService {
  constructor(jwt, apiBaseUrl) {
    this.shouldCache = false;
    this.jwt = jwt;
    this.apiBaseUrl = apiBaseUrl;

    // if we didn't pass in a JWT, try to get one from localStorage
    if(!this.jwt){
      localForage.getItem('jwt')
        .then((localStorage_jwt) => {
          if(localStorage_jwt){
            this.jwt = localStorage_jwt;
            }
        });
    }

    localForage
      .ready()
      .then(() => {
        this.shouldCache = true;
        // if we have a jwt, make sure its cached
        if(this.jwt){
          localForage.setItem('jwt', jwt);
        }
      })
      .catch((e) => {
        console.log(`LocalForage error: ${e}`)
      });
  }
  authenticate(){

  }
  request(endpoint, _settings = {}){
    if(!this.jwt){
      throw new GoodreadsUnauthenticatedException();
    }
    let settings = Object.assign({}, _settings, {
      credentials: 'omit', // don't send cookies
      headers: new Headers({
        "Authorization": `Bearer ${this.jwt}`,
      })
    });

    return fetch(endpoint, settings)
  }
  getShelf(name, page = 1){
    return localForage.getItem(this.shelfCacheName(name, page))
      .then((bookData) => {
        if(bookData === null || this.responseIsExpired(bookData.queryDate)){
          return this.loadShelf(name, page)
        } else {
          return bookData.shelf
        }
      });
  }
  loadShelf(name, page = 1){
    return this.request(`${this.apiBaseUrl}/api/shelves/${name}?page=${page}&per_page=50`)
      .then(this.checkResponseCode)
      .then((response) => {
        return response.text()
      })
      .then(this.shelfFromGoodreadsXml)
      .then((shelf) => {
        // add name property to shelf (we can't pick this up from goodreads)
        shelf.name = name;
        return shelf;
      })
      .then(this.cacheShelf.bind(this))
  }
  cacheShelf(shelf){
    if(!this.shouldCache){
      return shelf;
    }
    let shelfData = {
      queryDate: Date.now(),
      shelf
    };
    localForage.setItem(this.shelfCacheName(shelf.name, shelf.pagination.currentpage), shelfData)
    return shelf
  }
  shelfCacheName(name, page){
    return `shelf.${name}.${page}`
  }


  getShelves(){
    return localForage.getItem('shelves')
      .then((shelvesData) => {
        if(shelvesData === null || this.responseIsExpired(shelvesData.queryDate)){
          return this.loadShelves();
        } else {
          return shelvesData.shelves;
        }
      });
  }
  loadShelves(){
    // todo: catch errors here
    return this.request(`${this.apiBaseUrl}/api/shelves`)
      .then(this.checkResponseCode)
      .then((response) => {
        return response.text();
      })
      .then(this.shelvesFromGoodreadsXML)
      .then(this.cacheShelves.bind(this))
  }
  cacheShelves(shelves){
    if(!this.shouldCache){
      return shelves;
    }
    let shelvesData = {
      queryDate: Date.now(),
      shelves
    };
    localForage.setItem('shelves', shelvesData)
    return shelves
  }
  checkResponseCode(response){
    if(!response.ok){
      if(response.status === 401){
        // todo: clear the JWT here and in the cache
        throw new GoodreadsUnauthenticatedException();
      } else {
        throw new GoodreadsException(response.status, response.statusText);
      }
    }
    return response;
  }
  responseIsExpired(responseQueryDate){
    // the query date was more than 1 day ago
    return moment(responseQueryDate).add(1, 'day') < moment()
  }
  shelvesFromGoodreadsXML(xmlStr){
    let domParser = new window.DOMParser();
    let doc =  domParser.parseFromString(xmlStr, "text/xml");
    let shelvesElements = doc.getElementsByTagName('user_shelf');
    let shelves = [];
    for (var shelfElement of shelvesElements) {
      shelves.push(
        Object.assign(
          {},
          Shelf,
          {
            id: shelfElement.getElementsByTagName('id')[0].textContent,
            name: shelfElement.getElementsByTagName('name')[0].textContent,
            book_count: Number(shelfElement.getElementsByTagName('book_count')[0].textContent),
            description: shelfElement.getElementsByTagName('description')[0].textContent
            // sort:
            // order:
            // per_page:
            // display_fields:
            // featured:
            // recommend_for:
            // sticky:
          }
        )
      )
    }
    return shelves;
  }
  shelfFromGoodreadsXml(xmlStr){
    let domParser = new window.DOMParser();
    let doc =  domParser.parseFromString(xmlStr, "text/xml");
    let booksElements = doc.getElementsByTagName('book');
    let booksContainerElement = doc.getElementsByTagName('books')[0];
    let books = [];
    for (var bookElement of booksElements) {
      var authorElements = bookElement.getElementsByTagName('author');
      var authors = [];
      for(var authorElement of authorElements){
        authors.push({
          id: authorElement.getElementsByTagName('id')[0].textContent,
          name: authorElement.getElementsByTagName('name')[0].textContent,
          // role: authorElement.getElementsByTagName('role')[0].textContent,
          // image_url: authorElement.getElementsByTagName('image_url')[0].textContent,
          // small_image_url: authorElement.getElementsByTagName('small_image_url')[0].textContent,
          // link: authorElement.getElementsByTagName('link')[0].textContent,
          // average_rating: authorElement.getElementsByTagName('average_rating')[0].textContent,
          // ratings_count: authorElement.getElementsByTagName('ratings_count')[0].textContent,
        })
      }

      books.push(Object.assign({}, Book, {
        id: Number(bookElement.getElementsByTagName('id')[0].textContent),
        isbn: bookElement.getElementsByTagName('isbn')[0].textContent,
        isbn13: bookElement.getElementsByTagName('isbn13')[0].textContent,
        title: bookElement.getElementsByTagName('title')[0].textContent,
        title_without_series: bookElement.getElementsByTagName('title_without_series')[0].textContent,
        image_url: bookElement.getElementsByTagName('image_url')[0].textContent,
        small_image_url: bookElement.getElementsByTagName('small_image_url')[0].textContent,
        // large_image_url: bookElement.getElementsByTagName('large_image_url')[0].textContent,
        link: bookElement.getElementsByTagName('link')[0].textContent,
        // num_pages: bookElement.getElementsByTagName('num_pages')[0].textContent,
        // format: bookElement.getElementsByTagName('format')[0].textContent,
        // edition_information: bookElement.getElementsByTagName('edition_information')[0].textContent,
        // publisher: bookElement.getElementsByTagName('publisher')[0].textContent,
        // publication_day: bookElement.getElementsByTagName('publication_day')[0].textContent,
        // publication_year: bookElement.getElementsByTagName('publication_year')[0].textContent,
        // publication_month: bookElement.getElementsByTagName('publication_month')[0].textContent,
        published: bookElement.getElementsByTagName('published')[0].textContent,
        // average_rating: bookElement.getElementsByTagName('average_rating')[0].textContent,
        // ratings_count: bookElement.getElementsByTagName('ratings_count')[0].textContent,
        description: bookElement.getElementsByTagName('description')[0].textContent,
        authors
      }))
    }

    let pagination = {
      start: parseInt(booksContainerElement.getAttribute('start'), 10),
      end: parseInt(booksContainerElement.getAttribute('end'), 10),
      total: parseInt(booksContainerElement.getAttribute('total'), 10),
      numpages: parseInt(booksContainerElement.getAttribute('numpages'), 10),
      currentpage: parseInt(booksContainerElement.getAttribute('currentpage'), 10),
    }

    let shelf = Object.assign({}, Shelf, {
      pagination,
      books
    })

    return shelf;
  }
}

const Shelf = {
  id: null,
  name: null,
  book_count: null,
  description: null,
  pagination: {
    start: null,
    end: null,
    total: null,
    numpages: null,
    currentpage: null
  },
  books: []
}

const Book = {
  id: null,
  isbn: null,
  isbn13: null,
  title: null,
  title_without_series: null,
  image_url: null,
  small_image_url: null,
  link: null,
  published: null,
  description: null,
  authors: []
}



export default GoodreadsService;