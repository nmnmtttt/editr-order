import { Input, PageHeader, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
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
  const handleChange = (e: UploadChangeParam<UploadFile<any>>) => {
    console.log(111)
  }
  return (
    <Fragment>
      <PageHeader className="site-page-header" title="商品列表" subTitle="列表中的商品" />
      {shopList.map((_, index) => (
        <Fragment key={index.toString(36)}>
          {_.src ? (
            <img alt="example" style={{ width: '100%' }} src={_.src} />
          ) : (
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              onChange={handleChange}
            ></Upload>
          )}
          <Input
            value={_.value}
            onChange={(e) => {
              changeShop(e, index)
            }}
          ></Input>
        </Fragment>
      ))}
    </Fragment>
  )
}

export default shopList
