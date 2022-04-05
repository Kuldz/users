import React, { useState } from "react"
import Head from "next/head"
import Nav from "../../components/navigation"
import Add from "../../components/add/classAdd"
import Edit from "../../components/edit/classEdit"
import { Input, Table, Space, Select, Popconfirm } from "antd"
import useSWR, { useSWRConfig } from "swr"
import teacherIdHandler from "../api/v1/teachers/[id]"

function handleChange (value) {
  console.log(`selected ${value}`)
}

const { Search } = Input
const { Option } = Select

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function ManageClass () {
  const { mutate } = useSWRConfig()
  const [page, setPage] = useState(1)
  const handlePageChange = page => {
    setPage(page) // by setting new page number, this whole component is re-run and useSWR will fetch new data with new page number
  }

  const { data, error, isValidating } = useSWR(`/api/v1/classes?page=${page}`, fetcher)
  if (error) {
    console.log(error)
  }
  function handleDelete (id) {
    fetch("/api/v1/classes/" + id, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then((json) => {
        console.log("Delete class response: ", json)
        mutate(`/api/v1/classes?page=${page}`)
      })
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year"
    },
    {
      title: "teacher",
      key: "teacher",
      render: (_, Teacher) => (
        <div teacherName="table-functions">
          <Add fields={Teacher} isPOST />
          <Popconfirm title="Are you sure you want to delete this Class?"
                onConfirm={() => handleDelete(teacherIdHandler.id)}
                okText="Yes" cancelText="No">
            <a>Delete</a>
          </Popconfirm>
        </div>
      )
    },
    {
      title: "School",
      dataIndex: ["school", "name"],
      key: "school.name"
    },
    {
      title: "Action",
      key: "action",
      render: (_, Class) => (
        <div className="table-functions">
          <Edit fields={Class} isPUT page={page} />
          <Popconfirm title="Are you sure you want to delete this Class?"
                onConfirm={() => handleDelete(_.id)}
                okText="Yes" cancelText="No">
            <a>Delete</a>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <>
    <Head>
      <title>Manage Classes</title>
    </Head>
    <Nav />
    <Add page={page} />
    <Space>
      <Select defaultValue="Year" size="large" onChange={handleChange}>
        <Option value="Year">Filter by</Option>
        <Option value="Class Name">Filter by</Option>
        <Option value="Yiminghe">Filter by</Option>
      </Select>
      <Search
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
      />
    </Space>
    <Table
      loading={isValidating}
      columns={columns}
      pagination={{ position: ["bottomCenter"], current: page, total: data?.totalCount || 0, onChange: handlePageChange }}
      dataSource={data?.classes || []}
      rowKey="id"
    />
    </>
  )
}
