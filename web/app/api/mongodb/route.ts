import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId, Filter } from 'mongodb'

// 连接MongoDB数据库
async function connectToMongoDB(uri: string, dbName: string) {
  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    return { client, db }
  } catch (error) {
    console.error('连接MongoDB失败:', error)
    throw new Error(`无法连接到MongoDB: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 获取文档列表
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const uri = url.searchParams.get('uri')
    const dbName = url.searchParams.get('db')
    const collection = url.searchParams.get('collection') || 'documents'

    if (!uri || !dbName) {
      return NextResponse.json({ error: '缺少必要参数: uri, db' }, { status: 400 })
    }

    const { client, db } = await connectToMongoDB(uri, dbName)

    try {
      const documents = await db.collection(collection).find({}).toArray()
      return NextResponse.json({ documents })
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error('查询MongoDB文档时出错:', error)
    return NextResponse.json(
      { error: `获取文档失败: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}

// 添加或更新文档
export async function POST(req: NextRequest) {
  console.log('post');
  try {
    const body = await req.json()
    const { uri, db: dbName, collection = 'documents', document, isUpdate = false } = body

    if (!uri || !dbName || !document) {
      return NextResponse.json(
        { error: '缺少必要参数: uri, db, document' },
        { status: 400 }
      )
    }

    const { client, db } = await connectToMongoDB(uri, dbName)

    try {
      let result
      
      if (isUpdate) {
        // 更新文档
        const { _id, ...updateData } = document
        if (!_id) {
          return NextResponse.json({ error: '更新文档需要_id字段' }, { status: 400 })
        }
        
        // 创建过滤条件
        const filter: Filter<any> = {}
        try {
          if (typeof _id === 'string' && ObjectId.isValid(_id)) {
            filter._id = new ObjectId(_id)
          } else {
            filter._id = _id
          }
        } catch (e) {
          console.log('ID不是有效的ObjectId格式，将使用原始ID:', _id)
          filter._id = _id
        }
        
        result = await db.collection(collection).updateOne(
          filter,
          { $set: updateData }
        )
        
        if (result.matchedCount === 0) {
          return NextResponse.json(
            { error: `未找到ID为 ${_id} 的文档` },
            { status: 404 }
          )
        }
      } else {
        // 插入新文档，自动生成包含时间戳的_id
        const timestamp = new Date().getTime().toString()
        const newDocument = { ...document, _id: timestamp }
        result = await db.collection(collection).insertOne(newDocument)
      }

      return NextResponse.json({
        success: true,
        result,
        message: isUpdate ? '文档已更新' : '文档已添加'
      })
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error('保存MongoDB文档时出错:', error)
    return NextResponse.json(
      { error: `保存文档失败: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}

// 删除文档
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const uri = url.searchParams.get('uri')
    const dbName = url.searchParams.get('db')
    const collection = url.searchParams.get('collection') || 'documents'
    const id = url.searchParams.get('id')

    if (!uri || !dbName || !id) {
      return NextResponse.json(
        { error: '缺少必要参数: uri, db, id' },
        { status: 400 }
      )
    }

    const { client, db } = await connectToMongoDB(uri, dbName)

    try {
      // 创建过滤条件
      const filter: Filter<any> = {}
      try {
        if (ObjectId.isValid(id)) {
          filter._id = new ObjectId(id)
        } else {
          filter._id = id
        }
      } catch (e) {
        console.log('ID不是有效的ObjectId格式，将使用原始ID:', id)
        filter._id = id
      }
      
      const result = await db.collection(collection).deleteOne(filter)
      
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: `未找到ID为 ${id} 的文档` },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: '文档已删除'
      })
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error('删除MongoDB文档时出错:', error)
    return NextResponse.json(
      { error: `删除文档失败: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
} 