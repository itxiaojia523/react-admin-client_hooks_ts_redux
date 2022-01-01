// import axios from "axios";
import { FormInstance } from 'antd';
import React from 'react';
export interface AxiosResponse {
    data: any
    status: number
    statusText?: string
    headers?: any
    config?: any
    request?: any
  }

  export interface AxiosPromise extends Promise<AxiosResponse> {
}

export interface AxiosRequestConfig {
    // ...
    responseType?: XMLHttpRequestResponseType
  }
 
// import { FormInstance } from 'antd/es/form'; //antd form的接口
export interface IFormIProps{
  categoryName? : string
  setForm: (form:FormInstance)=> any
  parentId? : string
  parentName? : string
  categorys? : Icategory[]
}

export interface Icategory{
  name?:string
  _id?: string
  
}
export interface Iimg{
  url?: string
}
export interface Iproduct{
  name?:string
  _id ?: string
  status?:number
  imgs?:Iimg[]
  desc?:string
  price?:number
  detail?:string
  pCategoryId?:string
  categoryId?:string
  __v?:number
}

export interface Option {
  value: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: Option[];
}

export interface IRole{
        "menus"?: React.Key[],
        "_id"?: string,
        "name"?: string,
        "create_time"?: number,
        "__v"?: number,
        "auth_name"?: string,
        "auth_time"?: number
  
}

export interface IMemoryUser{
  username?:string
  role?: any
  _id? : string
  role_id?:string
}

export interface Iuser{
  username: string
  _id? : string
  password: string
  phone: string
  email: string
  role_id:string
  create_time?:number
}