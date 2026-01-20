import { useEffect, useRef } from "react"
import { Modal } from "bootstrap"

const ProductModal = ({
  isOpen,
  onClose,
  tempProduct,
  handleInputChange,
  handleImageChange,
  submitFunction,
  modalType,
}) => {
  const modalRef = useRef(null)
  const bsModal = useRef(null)

  useEffect(() => {
    bsModal.current = new Modal(modalRef.current)

    return () => {
      if (bsModal.current) {
        bsModal.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    const handleHidden = () => {
      onClose()
    }
    const modalElement = modalRef.current
    modalElement.addEventListener("hidden.bs.modal", handleHidden)
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden)
    }
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
                      name='title'
                      value={tempProduct.title}
                      onChange={handleInputChange}
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
                        name='category'
                        value={tempProduct.category}
                        onChange={handleInputChange}
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
                        name='unit'
                        value={tempProduct.unit}
                        onChange={handleInputChange}
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
                        name='origin_price'
                        value={tempProduct.origin_price}
                        onChange={handleInputChange}
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
                        name='price'
                        value={tempProduct.price}
                        onChange={handleInputChange}
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
                      rows='3'
                      value={tempProduct.description}
                      onChange={handleInputChange}
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
                      rows='3'
                      value={tempProduct.content}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='is_enabled'
                        name='is_enabled'
                        checked={tempProduct.is_enabled}
                        onChange={handleInputChange}
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
                      name='imageUrl'
                      value={tempProduct.imageUrl || []}
                      onChange={handleInputChange}
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
                      rows='3'
                      value={(tempProduct.imagesUrl || []).join("\n")}
                      onChange={handleImageChange}
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
              onClick={submitFunction}
            >
              {modalType === "create" ? "新增" : "編輯"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
