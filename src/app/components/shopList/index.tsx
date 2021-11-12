import { Input, PageHeader } from 'antd'
import React, { Fragment, useState } from 'react'
import { shopListStore } from '../../store/shopList'

const shopList: React.FC<any> = () => {
  const { shopList, setShopList } = shopListStore()

  const changeShop = (inputEve, index) => {
    setShopList((e) => {
      e[index].value = inputEve.target.value
      return [...e]
    })
  }
  return (
    <Fragment>
      <PageHeader className="site-page-header" title="商品列表" subTitle="列表中的商品" />
      {shopList.map((_, index) => (
        <Input
          key={index.toString(36)}
          value={_.value}
          onChange={(e) => {
            changeShop(e, index)
          }}
        ></Input>
      ))}
    </Fragment>
  )
}

export default shopList
