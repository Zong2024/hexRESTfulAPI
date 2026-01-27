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
  onFileUpload,
}) => {
  const modalRef = useRef(null)
  const bsModal = useRef(null)

  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current)
    }

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
              {modalType === "create" ? "新增產品" : "編輯產品"}
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
                <div className='col-md-6'>
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
                      <label htmlFor='origin' className='form-label'>
                        產地
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='origin'
                        name='origin'
                        value={tempProduct.origin || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='farm' className='form-label'>
                        農場
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='farm'
                        name='farm'
                        value={tempProduct.farm || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='mb-3 col-md-4'>
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
                    <div className='mb-3 col-md-4'>
                      <label htmlFor='weight' className='form-label'>
                        重量
                      </label>
                      <input
                        type='number'
                        className='form-control'
                        id='weight'
                        name='weight'
                        value={tempProduct.weight || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className='mb-3 col-md-4'>
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
                    <label htmlFor='origin_info' className='form-label'>
                      產地資訊
                    </label>
                    <textarea
                      className='form-control'
                      id='origin_info'
                      name='origin_info'
                      rows='3'
                      value={tempProduct.origin_info}
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
                        checked={!!tempProduct.is_enabled}
                        onChange={handleInputChange}
                      />
                      <label className='form-check-label' htmlFor='is_enabled'>
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='mb-3'>
                    <label htmlFor='uploadImage' className='form-label'>
                      上傳圖片
                    </label>
                    <input
                      type='file'
                      className='form-control'
                      id='uploadImage'
                      name='uploadImage'
                      accept='.jpg,.png'
                      onChange={e => onFileUpload(e)}
                    />
                    <label htmlFor='imageUrl' className='form-label'>
                      主要圖片網址
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='imageUrl'
                      name='imageUrl'
                      value={tempProduct.imageUrl || ""}
                      onChange={handleInputChange}
                    />
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
                  <div className='mb-3'>
                    <h6 className='mb-3 border-top pt-2'>保存資訊</h6>
                    <label htmlFor='storage_method' className='form-label'>
                      保存方式
                    </label>
                    <textarea
                      className='form-control'
                      id='storage_method'
                      name='storage_method'
                      rows='2'
                      value={tempProduct.storage_method}
                      onChange={handleInputChange}
                    ></textarea>
                    <label htmlFor='shelf_life' className='form-label'>
                      保存期限
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='shelf_life'
                      name='shelf_life'
                      value={tempProduct.shelf_life || ""}
                      onChange={handleInputChange}
                    ></input>
                    <label htmlFor='eating_tips' className='form-label'>
                      食用技巧
                    </label>
                    <textarea
                      className='form-control'
                      id='eating_tips'
                      name='eating_tips'
                      rows={3}
                      value={tempProduct.eating_tips || ""}
                      onChange={handleInputChange}
                    ></textarea>
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
