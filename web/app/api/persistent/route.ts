import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { createClient } from '@supabase/supabase-js'
import mysql from 'mysql2/promise'

export async function POST(req: NextRequest) {
  console.log('收到请求')
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const dbType = formData.get('dbType') as 'mongo' | 'mysql'
    const saveToKnowledgeBase = formData.get('saveToKnowledgeBase') === 'true'

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 })
    }

    if (!dbType) {
      return NextResponse.json({ error: '未指定数据库类型' }, { status: 400 })
    }

    // 检查数据库连接信息
    if (dbType === 'mongo') {
      const mongoUri = formData.get('mongoUri') as string
      const mongoDatabase = formData.get('mongoDatabase') as string
      
      if (!mongoUri || !mongoDatabase) {
        return NextResponse.json({ error: 'MongoDB连接信息不完整' }, { status: 400 })
      }
    } else if (dbType === 'mysql') {
      const mysqlHost = formData.get('mysqlHost') as string
      const mysqlPort = formData.get('mysqlPort') as string
      const mysqlUsername = formData.get('mysqlUsername') as string
      const mysqlPassword = formData.get('mysqlPassword') as string
      const mysqlDatabase = formData.get('mysqlDatabase') as string
      
      if (!mysqlHost || !mysqlPort || !mysqlUsername || !mysqlPassword || !mysqlDatabase) {
        return NextResponse.json({ error: 'MySQL连接信息不完整' }, { status: 400 })
      }
    }

    // 准备文件数据
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileName = file.name

    // 构建请求URL
    const apiEndpoint = 'http://192.168.2.221:8765/file_parse'
    const url = new URL(apiEndpoint)
    url.searchParams.append('parse_method', 'auto')
    url.searchParams.append('is_json_md_dump', 'true')
    url.searchParams.append('output_dir', 'output')
    url.searchParams.append('return_layout', 'false')
    url.searchParams.append('return_info', 'false')
    url.searchParams.append('return_content_list', 'false')
    url.searchParams.append('return_images', 'false')

    // 创建FormData
    const parseFormData = new FormData()
    parseFormData.append('file', new Blob([fileBuffer]), fileName)

    // 发送到解析API
    const parseResponse = await fetch(url.toString(), {
      method: 'POST',
      body: parseFormData,
    })

    if (!parseResponse.ok) {
      const errorText = await parseResponse.text()
      return NextResponse.json({ 
        error: `文件解析失败: ${parseResponse.status} ${parseResponse.statusText}`,
        details: errorText
      }, { status: 500 })
    }

    const parseResult = await parseResponse.json()
    
    // 获取解析后的文本内容
    const mdContent = parseResult.md_content

    if (!mdContent) {
      return NextResponse.json({ error: '未能获取解析后的内容' }, { status: 500 })
    }
    console.log('解析后的内容:', mdContent)
    console.log('数据库类型:', dbType)
    // 根据所选数据库类型保存数据
    if (dbType === 'mongo') {
      return await saveToMongo(formData, fileName, mdContent, saveToKnowledgeBase)
    } else {
      return await saveToMySQL(formData, fileName, mdContent, saveToKnowledgeBase)
    }
  } catch (error) {
    console.error('处理请求时出错:', error)
    return NextResponse.json({ 
      error: '服务器内部错误', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

// 保存到MongoDB
async function saveToMongo(formData: FormData, fileName: string, mdContent: string, saveToKnowledgeBase: boolean) {
  const mongoUri = formData.get('mongoUri') as string
  const mongoDatabase = formData.get('mongoDatabase') as string
  
  let mongoClient: MongoClient | null = null
  try {
    mongoClient = new MongoClient(mongoUri)
    await mongoClient.connect()
    
    const db = mongoClient.db(mongoDatabase)
    const collection = db.collection('documents')
    
    const result = await collection.insertOne({
      name: fileName,
      txt: mdContent,
      createdAt: new Date(),
    })
    console.log('MongoDB存储成功:', result.insertedId)
    // 保存到知识库（如果需要）
    if (saveToKnowledgeBase) {
      // 这里需要集成知识库API
      // 这只是一个占位示例
      // TODO: 实现知识库存储逻辑
    }
    
    return NextResponse.json({ 
      success: true,
      message: '文件处理成功',
      documentId: result.insertedId,
      dbType: 'mongodb'
    })
  } catch (mongoError) {
    console.error('MongoDB存储错误:', mongoError)
    return NextResponse.json({ 
      error: '数据存储失败', 
      details: mongoError instanceof Error ? mongoError.message : String(mongoError) 
    }, { status: 500 })
  } finally {
    if (mongoClient) await mongoClient.close()
  }
}

// 保存到MySQL
async function saveToMySQL(formData: FormData, fileName: string, mdContent: string, saveToKnowledgeBase: boolean) {
  const mysqlHost = formData.get('mysqlHost') as string
  const mysqlPort = formData.get('mysqlPort') as string
  const mysqlUsername = formData.get('mysqlUsername') as string
  const mysqlPassword = formData.get('mysqlPassword') as string
  const mysqlDatabase = formData.get('mysqlDatabase') as string
  
  let connection: mysql.Connection | null = null
  try {
    // 创建MySQL连接
    connection = await mysql.createConnection({
      host: mysqlHost,
      port: parseInt(mysqlPort, 10),
      user: mysqlUsername,
      password: mysqlPassword,
      database: mysqlDatabase
    })
    
    // 检查表是否存在，如果不存在则创建
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        txt LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // 插入文档
    const [result] = await connection.execute(
      'INSERT INTO documents (name, txt) VALUES (?, ?)',
      [fileName, mdContent]
    )
    
    // 保存到知识库（如果需要）
    if (saveToKnowledgeBase) {
      // 这里需要集成知识库API
      // 这只是一个占位示例
      // TODO: 实现知识库存储逻辑
    }
    
    return NextResponse.json({ 
      success: true,
      message: '文件处理成功',
      documentId: (result as any).insertId,
      dbType: 'mysql'
    })
  } catch (mysqlError) {
    console.error('MySQL存储错误:', mysqlError)
    return NextResponse.json({ 
      error: '数据存储失败', 
      details: mysqlError instanceof Error ? mysqlError.message : String(mysqlError) 
    }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
} 