import { useEffect, useRef } from "react"
import { Modal } from "bootstrap"

const ProductModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null)
  const bsModal = useRef(null)
  useEffect(() => {
    bsModal.current = new Modal(modalRef.current)
    modalRef.current.addEventListener("hidden.bs.modal", () => {
      onClose()
    })
  }, [onClose])
  useEffect(() => {
    if (isOpen) {
      bsModal.current.show()
    } else {
      bsModal.current.hide()
    }
  }, [isOpen])

  return (
    <div className='modal fade' tabIndex='-1' ref={modalRef}>
      <div className='modal-dialog modal-lg modal-dialog-centered'>
        {/* modal-lg 讓 Modal 更寬, modal-dialog-centered 讓 Modal 垂直置中 */}
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='addProductModalLabel'>
              新增產品
            </h5>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={onClose}
            ></button>
          </div>
          <div className='modal-body'>
            <form>
              <div className='row'>
                <div className='col-md-8'>
                  <div className='mb-3'>
                    <label htmlFor='title' className='form-label'>
                      產品名稱
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='title'
                      name='title' // 移除 value 和 onChange
                      // value={newProductData.title}
                      // onChange={handleNewProductInputChange}
                      required
                    />
                  </div>
                  <div className='row'>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='category' className='form-label'>
                        分類
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='category'
                        name='category' // 移除 value 和 onChange
                        // value={newProductData.category}
                        // onChange={handleNewProductInputChange}
                        required
                      />
                    </div>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='unit' className='form-label'>
                        單位
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='unit'
                        name='unit' // 移除 value 和 onChange
                        // value={newProductData.unit}
                        required
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='origin_price' className='form-label'>
                        原價
                      </label>
                      <input
                        type='number'
                        className='form-control'
                        id='origin_price'
                        name='origin_price' // 移除 value 和 onChange
                        // value={newProductData.origin_price}
                        required
                      />
                    </div>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='price' className='form-label'>
                        售價
                      </label>
                      <input
                        type='number'
                        className='form-control'
                        id='price'
                        name='price' // 移除 value 和 onChange
                        // value={newProductData.price}
                        required
                      />
                    </div>
                  </div>
                  <hr />

                  <div className='mb-3'>
                    <label htmlFor='description' className='form-label'>
                      產品描述
                    </label>
                    <textarea
                      className='form-control'
                      id='description'
                      name='description'
                      rows='3' // 移除 value 和 onChange
                      // value={newProductData.description}
                      // onChange={handleNewProductInputChange}
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='content' className='form-label'>
                      說明內容
                    </label>
                    <textarea
                      className='form-control'
                      id='content'
                      name='content'
                      rows='3' // 移除 value 和 onChange
                      // value={newProductData.content}
                      // onChange={handleNewProductInputChange}
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='is_enabled'
                        name='is_enabled' // 移除 checked 和 onChange
                        // checked={newProductData.is_enabled}
                        // onChange={handleNewProductInputChange}
                      />
                      <label className='form-check-label' htmlFor='is_enabled'>
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='mb-3'>
                    <label htmlFor='imageUrl' className='form-label'>
                      主要圖片網址
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='imageUrl'
                      name='imageUrl' // 移除 value 和 onChange
                      // value={newProductData.imageUrl}
                      // onChange={handleNewProductInputChange}
                    />
                    {/* 移除圖片預覽 */}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='imagesUrl' className='form-label'>
                      多圖網址 (每行一個)
                    </label>
                    <textarea
                      className='form-control'
                      id='imagesUrl'
                      name='imagesUrl'
                      rows='3' // 移除 value 和 onChange
                      // value={newProductData.imagesUrl.join('\n')}
                      // onChange={(e) => setNewProductData(prev => ({ ...prev, imagesUrl: e.target.value.split('\n').filter(url => url.trim() !== ''), }))}
                    ></textarea>
                    {/* 移除多圖預覽 */}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}
            >
              取消
            </button>
            <button
              type='button'
              className='btn btn-primary'
              // onClick={addProduct}
            >
              確認新增
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
