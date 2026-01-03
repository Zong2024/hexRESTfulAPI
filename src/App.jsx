import axios from "axios"
import { useEffect, useState } from "react"
const API_BASE = import.meta.env.VITE_API_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

const App = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [isAuth, setIsAuth] = useState(false)
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkSignin = async () => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("hexToken="))
      ?.split("=")[1]
    if (!token) {
      setIsLoading(false)
      return
    }
    axios.defaults.headers.common["Authorization"] = token
    try {
      await axios.post(`${API_BASE}/api/user/check`)
      console.log("驗證成功")
      setIsAuth(true)
    } catch (error) {
      console.error(error.response?.data)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    checkSignin()
  }, [])

  useEffect(() => {
    if (isAuth) {
      fetchProducts()
    }
  }, [isAuth])

  const signin = async () => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData)
      const { token, expired } = response.data
      document.cookie = `hexToken=${token}; expires=${new Date(
        expired
      )}; path=/`
      axios.defaults.headers.common["Authorization"] = token
      setIsAuth(true)
      alert("登入成功")
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }

  const signout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`)
      if (response.data.success) {
        document.cookie =
          "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        delete axios.defaults.headers.common["Authorization"]
        setIsAuth(false)
        alert("您已成功登出")
      }
    } catch (error) {
      console.log("登出錯誤", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/admin/products`
      const response = await axios.get(url)
      const { products: data } = response.data
      return setProducts(data)
    } catch (error) {
      console.error("商品取得錯誤", error)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await signin()
  }
  const handleInputChange = e => {
    const { value, name } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return <div className='container mt-5'>驗證身分中，請稍後...</div>
  }

  return (
    <>
      {isAuth ? (
        <div className='container'>
          <div className='row mt-5'>
            <div className='col-md-6'>
              <h2>產品列表</h2>
              <button type='button' onClick={signout}>
                signout
              </button>
              <table className='table'>
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map(product => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            className='btn btn-primary'
                            onClick={() => setTempProduct(product)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='5'>尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className='col-md-6'>
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className='card mb-3'>
                  <img
                    src={tempProduct.imageUrl}
                    className='card-img-top primary-image'
                    alt='主圖'
                  />
                  <div className='card-body'>
                    <h5 className='card-title'>
                      {tempProduct.title}
                      <span className='badge bg-primary ms-2'>
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className='card-text'>
                      商品描述：{tempProduct.description}
                    </p>
                    <p className='card-text'>商品內容：{tempProduct.content}</p>
                    <div className='d-flex'>
                      <p className='card-text text-secondary'>
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className='mt-3'>更多圖片：</h5>
                    <div className='d-flex flex-wrap'>
                      {tempProduct.imagesUrl?.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className='images'
                          alt='副圖'
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-secondary'>請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='container login'>
          <div className='row justify-content-center'>
            <h1 className='h3 mb-3 font-weight-normal'>請先登入</h1>
            <div className='col-8'>
              <form id='form' className='form-signin' onSubmit={handleSubmit}>
                <div className='form-floating mb-3'>
                  <input
                    type='email'
                    className='form-control'
                    id='username'
                    name='username'
                    placeholder='name@example.com'
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor='username'>Email address</label>
                </div>
                <div className='form-floating'>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor='password'>Password</label>
                </div>
                <button
                  className='btn btn-lg btn-primary w-100 mt-3'
                  type='submit'
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className='mt-5 mb-3 text-muted'>&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  )
}

export default App
