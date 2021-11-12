import { forMatPrice } from './../utils/priceEdit'
import { cloneDeep } from 'lodash'
import { chooseElemetAfterIndex } from './..//utils/arrDo'
// content action
enum ActionType {
  EDIT = 'edit', //编辑单个页面元素
  GET = 'get', //获取元素信息
  UNION = 'union', //整合页面元素
}

enum EditType {
  PRICE = 'price',
  IMG = 'img',
}

// 商品类型query
const ITEMQUERY = {
  price: '.order-product-price span span', //商品价格query
  img: '.order-product-item-img img', // 商品图片query
  detialUl: '.order-product-item-detail', // 商品详情ul
  orderDetail: '.merge-order-title', //商品详情标题头
  productItem: '.order-product-item', //商品详情本体
}

//费用明细query
const FEEQUERY = {
  side: '.order-fee-group.right-border',
  feeItem: '.order-fee-item',
}

// 联合商品
const unionProduct = () => {
  //ulClone
  const ulClone = cloneDeep(chooseElemetAfterIndex(document.querySelectorAll(ITEMQUERY.detialUl)))

  //商品标题
  //要删除的
  const deleteOrderDetails = Array.from(document.querySelectorAll(ITEMQUERY.orderDetail))
  //要编辑的
  const editOrderDetails = deleteOrderDetails.shift()

  //商品项
  //要删除的
  const deleteProductItems = Array.from(document.querySelectorAll(ITEMQUERY.productItem))
  //要编辑的
  const editProductItems = deleteProductItems.shift()

  //移除所有的其他元素
  while (deleteOrderDetails.length) deleteOrderDetails.pop().remove()
  while (deleteProductItems.length) deleteProductItems.pop().remove()

  ulClone.map((_) => editProductItems.insertBefore(_, Array.from(editProductItems.children).slice(-1)[0]))
}

// 联合价格表
const feeDetail = () => {
  const AllFee = Array.from(document.querySelector(FEEQUERY.side).querySelectorAll(FEEQUERY.feeItem))
  const deleteFee = AllFee.slice(AllFee.findIndex((_) => _.nextElementSibling.className.includes('space10')) + 1)
  deleteFee.map((_) => _.remove())
}

unionProduct()
feeDetail()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.typ as ActionType) {
    case ActionType.EDIT:
      const { data } = request
      const { type, index, value } = data
      switch (type as EditType) {
        case EditType.IMG:
          document.querySelectorAll(ITEMQUERY[type])[index].src = value
          break
        case EditType.PRICE:
          document.querySelectorAll(ITEMQUERY[type])[index].innerText = forMatPrice(value)
          break
        default:
          break
      }
    case ActionType.GET: {

    Array.from(  document.querySelectorAll(ITEMQUERY.PRICE)).reduce()
      break
    }
    case ActionType.UNION: {
      unionProduct()
      feeDetail()
      break
    }
    default:
      break
  }
})
