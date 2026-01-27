import { useEffect, useState } from "react"
import ProductModal from "./ProductModal"
import {
  checkSignin as apiCheckSignin,
  signin as apiSignin,
  signout as apiSignout,
  getProducts as getProducts,
  addProduct as apiAddProduct,
  deleteProduct as apiDeleteProduct,
  editProduct as apiEditProduct,
  postUploadImage,
} from "./api"
import Pagination from "./components/Pagination"

const defaultData = {
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
  // --- 規格區 ---
  origin: "",
  farm: "",
  weight: "",
  origin_info: "",
  // --- 保存與食用區 ---
  storage_method: "",
  shelf_life: "",
  eating_tips: "",
}

const App = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [isAuth, setIsAuth] = useState(false)
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [tempProduct, setTempProduct] = useState(defaultData)
  const [originalTempProduct, setOriginalTempProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [modalType, setModalType] = useState("create")
  const [isFetchingProducts, setIsFetchingProducts] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (type, product = defaultData) => {
    setModalType(type)
    if (type === "create") {
      setTempProduct(product)
    } else if (type === "edit") {
      setTempProduct(product)
    }

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
    try {
      await apiCheckSignin()
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

  const signin = async () => {
    try {
      await apiSignin(formData)
      setIsAuth(true)
      alert("登入成功")
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }
  const signout = async () => {
    try {
      await apiSignout()
      setIsAuth(false)
      alert("您已成功登出")
    } catch (error) {
      console.log("登出錯誤", error)
    }
  }
  //api
  const fetchProducts = async (page = 1) => {
    setIsFetchingProducts(true)
    try {
      const data = await getProducts(page)
      setProducts(data.products)
      setPagination(data.pagination)
      console.log(data)
    } catch (error) {
      console.error("商品取得錯誤", error)
    } finally {
      setIsFetchingProducts(false)
    }
  }
  useEffect(() => {
    if (isAuth) {
      fetchProducts()
    }
  }, [isAuth])

  const addProduct = async product => {
    return await apiAddProduct(product)
  }
  const deleteProduct = async id => {
    return await apiDeleteProduct(id)
  }
  const editProduct = async (id, productData) => {
    return await apiEditProduct(id, productData)
  }

  //event
  const handleSigninInputChange = e => {
    const { value, name } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  const handleSigninSubmit = async e => {
    e.preventDefault()
    await signin()
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
    setTempProduct(prev => ({
      ...prev,
      [name]: formatInputValue(value, type, checked),
    }))
  }

  const handleImageChange = e => {
    const { value } = e.target
    setTempProduct(prev => ({
      ...prev,
      imagesUrl: value.split("\n").filter(url => url.trim() !== ""),
    }))
  }

  const handleModalSubmit = async () => {
    console.log("modalType:", modalType)
    const detailedInfo = {
      origin: tempProduct.origin || "",
      farm: tempProduct.farm || "",
      origin_info: tempProduct.origin_info || "",
      weight: tempProduct.weight || "",
      storage_method: tempProduct.storage_method || "",
      shelf_life: tempProduct.shelf_life || "",
      eating_tips: tempProduct.eating_tips || "",
    }
    const productToSend = {
      ...tempProduct,
      content: JSON.stringify(detailedInfo),
      origin_price: Number(tempProduct.origin_price),
      price: Number(tempProduct.price),
      imagesUrl: (tempProduct.imagesUrl || []).filter(url => url.trim() !== ""),
    }
    try {
      if (modalType === "create") {
        await addProduct(productToSend)
        alert("新增產品成功")
      } else if (modalType === "edit") {
        if (
          JSON.stringify(tempProduct) !== JSON.stringify(originalTempProduct)
        ) {
          await editProduct(tempProduct.id, productToSend)
          alert("編輯產品成功")
        } else {
          alert("資料無更新")
        }
      }
      fetchProducts()
      closeModal()
    } catch (error) {
      console.error(error.response?.data || error.message)
      alert("操作失敗")
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
    } finally {
      setTempProduct(defaultData)
    }
  }

  const handlePageChange = page => {
    setPagination(prev => ({ ...prev, current_page: page }))
    fetchProducts(page)
  }
  //上傳圖片邏輯
  const handleFileUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const uploadedImageUrl = await postUploadImage(file)
    setTempProduct(prev => ({
      ...prev,
      imageUrl: uploadedImageUrl,
    }))
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
            <div className='col-lg-6'>
              <h2 className='d-inline-block me-3'>產品列表</h2>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => openModal("create")}
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
                    <th>功能</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetchingProducts ? (
                    <tr>
                      <td colSpan='6' className='text-center py-4'>
                        <div
                          className='spinner-border text-primary'
                          role='status'
                        >
                          <span className='visually-hidden'>Loading...</span>
                        </div>
                        <p className='mt-2'>載入產品中...</p>
                      </td>
                    </tr>
                  ) : products && products.length > 0 ? (
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
                        <td className='d-flex'>
                          <button
                            type='button'
                            className='btn btn-outline-danger'
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            刪除
                          </button>
                          <button
                            type='button'
                            className='btn btn-outline-success '
                            onClick={() => openModal("edit", product)}
                          >
                            edit
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
              <Pagination
                totalPages={pagination.total_pages}
                currentPage={pagination.current_page}
                onPageChange={handlePageChange}
              />
            </div>
            <div className='col-md-6'>
              <h2 className='text-center'>單一產品細節</h2>
              {tempProduct.id ? (
                <div className='card mb-3 p-4 '>
                  <img
                    src={tempProduct.imageUrl || null}
                    className='card-img-top primary-image'
                    alt='主圖'
                  />

                  <div className='card-body'>
                    <h5 className='card-title'>{tempProduct.title}</h5>

                    <div className='mb-3'>
                      <label className='form-label'>商品描述：</label>
                      <p className='card-text'>{tempProduct.description}</p>
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>產地資訊：</label>
                      <p className='card-text'>{tempProduct.origin_info}</p>
                    </div>
                    <div className='row mb-3'>
                      <div className='col-md-6'>
                        <label className='form-label'>原價：</label>
                        <p className='card-text text-secondary'>
                          <del>{tempProduct.origin_price}</del> 元
                        </p>
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>售價：</label>
                        <p className='card-text'>{tempProduct.price} 元</p>
                      </div>
                    </div>

                    <div className='mb-3'>
                      <label className='form-label'>
                        更多圖片網址 (每行一個)：
                      </label>
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

                    <div className='mb-3'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={tempProduct.is_enabled === 1}
                          disabled
                        />
                        <label className='form-check-label'>是否啟用</label>
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
            tempProduct={tempProduct}
            handleInputChange={handleModalInputChange}
            handleImageChange={handleImageChange}
            submitFunction={handleModalSubmit}
            modalType={modalType}
            onFileUpload={handleFileUpload}
          />
        </div>
      ) : (
        <div className='container login'>
          <div className='row justify-content-center'>
            <h1 className='h3 mb-3 font-weight-normal'>請先登入</h1>
            <div className='col-8'>
              <form
                id='form'
                className='form-signin'
                onSubmit={handleSigninSubmit}
              >
                <div className='form-floating mb-3'>
                  <input
                    type='email'
                    className='form-control'
                    id='username'
                    name='username'
                    placeholder='name@example.com'
                    value={formData.username}
                    onChange={handleSigninInputChange}
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
                    onChange={handleSigninInputChange}
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
