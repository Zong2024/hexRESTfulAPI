import axios from "axios"
import { useEffect, useState } from "react"
import ProductModal from "./ProductModal"
const API_BASE = import.meta.env.VITE_API_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [],
}

const App = () => {
  const [formData, setFormData] = useState({
    username: "love970120@gmail.com",
    password: "",
  })

  const [isAuth, setIsAuth] = useState(false)
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState(null)
  const [originalTempProduct, setOriginalTempProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [modalData, setModalData] = useState(defaultModalState)

  const [isEditing, setIsEditing] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => {
    setModalData(defaultModalState)
    setIsModalOpen(true)
  }
  const closeModal = () => setIsModalOpen(false)

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
        expired,
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
  //api
  const fetchProducts = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/admin/products`
      const response = await axios.get(url)
      const { products: data } = response.data
      setProducts(data)
      console.log(data)
    } catch (error) {
      console.error("商品取得錯誤", error)
    }
  }
  const addProduct = async rawData => {
    const productToSend = {
      ...rawData,
      origin_price: Number(rawData.origin_price),
      price: Number(rawData.price),
      imagesUrl: rawData.imagesUrl.filter(url => url.trim() !== ""),
    }
    const response = await axios.post(
      `${API_BASE}/api/${API_PATH}/admin/product`,
      {
        data: productToSend,
      },
    )
    return response.data
  }
  const deleteProduct = async id => {
    const response = await axios.delete(
      `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
    )
    return response.data
  }
  const editProduct = async id => {
    const response = await axios.put(
      `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      { data: tempProduct },
    )
    return response.data
  }

  //event
  const handleSubmit = async e => {
    e.preventDefault()
    await signin()
  }
  const handleInputChange = e => {
    const { value, name } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatInputValue = (value, type, checked) => {
    switch (type) {
      case "checkbox":
        return checked ? 1 : 0
      case "number":
        return Number(value)
      default:
        return value
    }
  }

  const handleModalInputChange = e => {
    const { name, value, type, checked } = e.target
    setModalData(prev => ({
      ...prev,
      [name]: formatInputValue(value, type, checked),
    }))
  }

  const handleImageChange = e => {
    const { value } = e.target
    setModalData(prev => ({
      ...prev,
      imagesUrl: value.split("\n"),
    }))
  }

  const handleEditInputChange = e => {
    const { name, value, type, checked } = e.target
    setTempProduct(prev => ({
      ...prev,
      [name]: formatInputValue(value, type, checked),
    }))
  }
  const handleEditProduct = async id => {
    if (JSON.stringify(tempProduct) === JSON.stringify(originalTempProduct)) {
      alert("沒有任何變更，無需更新產品。")
      return
    }

    try {
      await editProduct(id)
      alert("編輯產品成功")
      fetchProducts()
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert("編輯產品失敗")
    }
  }

  const handleAddProduct = async () => {
    try {
      await addProduct(modalData)
      alert("新增產品成功")
      fetchProducts()
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert("新增產品失敗")
    } finally {
      closeModal()
    }
  }

  const handleDeleteProduct = async id => {
    try {
      await deleteProduct(id)
      alert("刪除產品成功")
      fetchProducts()
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert("刪除產品失敗")
    }
  }

  if (isLoading) {
    return <div className='container mt-5'>驗證身分中，請稍後...</div>
  }

  return (
    <>
      {isAuth ? (
        <div className='container'>
          <button type='button' className='btn btn-dark mt-5' onClick={signout}>
            signout
          </button>
          <div className='row mt-5'>
            <div className='col-md-6'>
              <h2 className='d-inline-block me-3'>產品列表</h2>
              <button
                type='button'
                className='btn btn-warning'
                onClick={openModal}
              >
                新增產品
              </button>
              <table className='table'>
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                    <th>刪除</th>
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
                            onClick={() => {
                              setTempProduct(product)
                              setOriginalTempProduct(product)
                            }}
                          >
                            查看細節
                          </button>
                        </td>
                        <td>
                          <button
                            type='button'
                            className='btn btn-danger'
                            onClick={() => {
                              handleDeleteProduct(product.id)
                            }}
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='6'>尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className='col-md-6'>
              <h2 className='text-center'>單一產品細節</h2>
              {tempProduct ? (
                <div className='card mb-3 p-4 position-relative'>
                  {isEditing ? (
                    <div className='mb-3'>
                      <label htmlFor='imageUrl' className='form-label'>
                        主要圖片網址
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='imageUrl'
                        name='imageUrl'
                        value={tempProduct.imageUrl}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  ) : (
                    <img
                      src={tempProduct.imageUrl}
                      className='card-img-top primary-image'
                      alt='主圖'
                    />
                  )}

                  <button
                    type='button'
                    className={`position-absolute top-0 end-0 btn  ${isEditing ? "btn-success" : "btn-primary"}`}
                    onClick={() => {
                      if (isEditing) {
                        handleEditProduct(tempProduct.id)
                      }
                      setIsEditing(prev => !prev)
                    }}
                  >
                    {isEditing ? "完成" : "編輯"}
                  </button>
                  <div className='card-body'>
                    <h5 className='card-title'>
                      {isEditing ? (
                        <input
                          type='text'
                          className='form-control'
                          name='title'
                          value={tempProduct.title}
                          onChange={handleEditInputChange}
                        />
                      ) : (
                        tempProduct.title
                      )}
                    </h5>

                    <div className='mb-3'>
                      <label htmlFor='description' className='form-label'>
                        商品描述：
                      </label>
                      {isEditing ? (
                        <textarea
                          className='form-control'
                          id='description'
                          name='description'
                          rows='3'
                          value={tempProduct.description}
                          onChange={handleEditInputChange}
                        ></textarea>
                      ) : (
                        <p className='card-text'>{tempProduct.description}</p>
                      )}
                    </div>

                    <div className='mb-3'>
                      <label htmlFor='content' className='form-label'>
                        商品內容：
                      </label>
                      {isEditing ? (
                        <textarea
                          className='form-control'
                          id='content'
                          name='content'
                          rows='3'
                          value={tempProduct.content}
                          onChange={handleEditInputChange}
                        ></textarea>
                      ) : (
                        <p className='card-text'>{tempProduct.content}</p>
                      )}
                    </div>

                    <div className='row mb-3'>
                      <div className='col-md-6'>
                        <label htmlFor='origin_price' className='form-label'>
                          原價：
                        </label>
                        {isEditing ? (
                          <input
                            type='number'
                            className='form-control'
                            id='origin_price'
                            name='origin_price'
                            value={tempProduct.origin_price}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          <p className='card-text text-secondary'>
                            <del>{tempProduct.origin_price}</del> 元
                          </p>
                        )}
                      </div>
                      <div className='col-md-6'>
                        <label htmlFor='price' className='form-label'>
                          售價：
                        </label>
                        {isEditing ? (
                          <input
                            type='number'
                            className='form-control'
                            id='price'
                            name='price'
                            value={tempProduct.price}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          <p className='card-text'>{tempProduct.price} 元</p>
                        )}
                      </div>
                    </div>

                    <div className='mb-3'>
                      <label htmlFor='imagesUrl' className='form-label'>
                        更多圖片網址 (每行一個)：
                      </label>
                      {isEditing ? (
                        //多圖區 須修改
                        <textarea
                          className='form-control'
                          id='imagesUrl'
                          name='imagesUrl'
                          rows='10'
                          value={tempProduct.imagesUrl.join("\n")}
                          onChange={e => {
                            const { value } = e.target
                            setTempProduct(prev => ({
                              ...prev,
                              imagesUrl: value.split("\n"),
                            }))
                          }}
                        ></textarea>
                      ) : (
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
                      )}
                    </div>

                    <div className='mb-3'>
                      <div className='form-check'>
                        {isEditing ? (
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='is_enabled'
                            name='is_enabled'
                            checked={tempProduct.is_enabled === 1}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='is_enabled'
                            name='is_enabled'
                            checked={tempProduct.is_enabled === 1}
                            disabled
                          />
                        )}
                        <label
                          className='form-check-label'
                          htmlFor='is_enabled'
                        >
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-secondary'>請選擇一個商品查看</p>
              )}
            </div>
          </div>
          {/* 產品 Modal 視窗  */}
          <ProductModal
            isOpen={isModalOpen}
            onClose={closeModal}
            tempProduct={modalData}
            handleInputChange={handleModalInputChange}
            handleImageChange={handleImageChange}
            submitFunction={handleAddProduct}
          />
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
