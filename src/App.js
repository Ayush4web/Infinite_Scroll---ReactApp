import logo from './logo.svg'
import './App.css'
import { FaSearch } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import Photo from './Photo'
function App() {
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState([])
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')

  const mainUrl = 'https://api.unsplash.com/photos'
  const searchUrl = 'https://api.unsplash.com/search/photos'
  const cliendId = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`

  const fetchPhoto = async () => {
    setLoading(true)
    let url

    const urlPage = `&page=${page}`
    const urlSearch = `&query=${search}`

    if (search) {
      url = `${searchUrl}${cliendId}${urlPage}${urlSearch}`
    } else {
      url = `${mainUrl}${cliendId}${urlPage}`
    }
    try {
      const res = await fetch(url)
      const data = await res.json()

      setPhoto((oldData) => {
        if(search && page==0){
          return data.results
        }
        else if (search) {
          return [ ...oldData,...data.results]
        } else {
          return [...oldData, ...data]
        }
      })

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    // setPage(1)
    fetchPhoto()
    // fetchPhoto will automactically called as we changes the state
  }

  useEffect(() => {
    fetchPhoto()
  }, [page])

  const event = () => {
    if (
      !loading &&
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 2
    ) {
      setPage((oldPage) => {
        return oldPage + 1
      })
    }
  }
  useEffect(() => {
    const t = window.addEventListener('scroll', event)

    return () => window.removeEventListener('scroll', t)
  }, [])
  return (
    <main>
      <div className="title">
        <h1>Infinite Scroll</h1>
        <div className="underline"></div>
      </div>

      <section className="form">
        <form className="form-control" >
          <input
            type="text"
            className="input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="container">
        {photo.map((item) => {
          return <Photo key={item.id} {...item} />
        })}
      </section>
      {loading && <h1 className="loading">Loading...</h1>}
    </main>
  )
}

export default App
