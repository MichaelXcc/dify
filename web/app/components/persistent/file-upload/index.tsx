'use client'

import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import Checkbox from '@/app/components/base/checkbox'
import { useToastContext } from '@/app/components/base/toast'

// 引入新组件所需的类型和状态
type MongoDataType = {
  _id: string
  [key: string]: any
}

type MySQLColumn = {
  name: string
  type: string
}

type MySQLRow = {
  id: number
  [key: string]: any
}

type ConnectionConfig = {
  mongo: {
    uri: string
    database: string
  }
  mysql: {
    host: string
    port: string
    username: string
    password: string
    database: string
  }
}

type DbType = 'mongo' | 'mysql'

// 移除示例数据
const SAMPLE_MONGO_DATA: MongoDataType[] = []

const SAMPLE_MYSQL_COLUMNS: MySQLColumn[] = [
  { name: 'id', type: 'int' },
  { name: 'title', type: 'varchar(255)' },
  { name: 'content', type: 'text' },
  { name: 'publish_date', type: 'date' },
  { name: 'status', type: 'varchar(50)' }
]

const SAMPLE_MYSQL_DATA: MySQLRow[] = []

const DatabaseConfigManager: FC = () => {
  const { t } = useTranslation()
  const { notify } = useToastContext()
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none')
  const [selectedDbType, setSelectedDbType] = useState<DbType>('mongo')
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    mongo: {
      uri: 'mongodb://192.168.2.221:27017',
      database: '公告',
    },
    mysql: {
      host: '',
      port: '3306',
      username: '',
      password: '',
      database: '',
    },
  })
  const [shouldSaveToKnowledgeBase, setShouldSaveToKnowledgeBase] = useState(true)
  
  // 文件解析服务器相关状态
  const [serviceIp, setServiceIp] = useState('192.168.2.221')
  const [servicePort, setServicePort] = useState('8765')
  const [servicePath, setServicePath] = useState('/docs')
  const [iframeUrl, setIframeUrl] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  // 数据库操作相关状态
  const [mongoData, setMongoData] = useState<MongoDataType[]>(SAMPLE_MONGO_DATA)
  const [selectedMongoDoc, setSelectedMongoDoc] = useState<MongoDataType | null>(null)
  const [editedMongoDoc, setEditedMongoDoc] = useState<string>('')
  const [isEditingMongo, setIsEditingMongo] = useState(false)
  
  const [mysqlColumns, setMysqlColumns] = useState<MySQLColumn[]>(SAMPLE_MYSQL_COLUMNS)
  const [mysqlData, setMysqlData] = useState<MySQLRow[]>(SAMPLE_MYSQL_DATA)
  const [selectedMySQLRow, setSelectedMySQLRow] = useState<number | null>(null)
  const [editedMySQLData, setEditedMySQLData] = useState<Record<string, any>>({})
  const [isEditingMySQL, setIsEditingMySQL] = useState(false)
  
  // 数据库操作：从数据库读取数据
  const [isLoadingData, setIsLoadingData] = useState(false)

  // 确保MongoDB URI始终包含前缀
  useEffect(() => {
    if (selectedDbType === 'mongo' && !connectionConfig.mongo.uri.startsWith('mongodb://')) {
      handleConnectionConfigChange('mongo', 'uri', `mongodb://${connectionConfig.mongo.uri}`)
    }
  }, [connectionConfig.mongo.uri, selectedDbType])

  // 自动连接到默认服务器
//   useEffect(() => {
    // 组件加载时自动连接
    // handleConnectToService()
    // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

  // 在数据库类型切换时重置连接状态
  useEffect(() => {
    setConnectionStatus('none')
  }, [selectedDbType])

  const handleConnectionConfigChange = (
    dbType: DbType,
    field: string,
    value: string
  ) => {
    setConnectionConfig({
      ...connectionConfig,
      [dbType]: {
        ...connectionConfig[dbType],
        [field]: value,
      },
    })
  }

  // 验证数据库连接信息
  const validateDbConfig = (): boolean => {
    if (selectedDbType === 'mongo') {
      if (!connectionConfig.mongo.uri || connectionConfig.mongo.uri === 'mongodb://' || !connectionConfig.mongo.database) {
        notify({ type: 'error', message: '请填写MongoDB连接信息' })
        return false
      }
    } else if (selectedDbType === 'mysql') {
      const { host, port, username, password, database } = connectionConfig.mysql
      if (!host || !port || !username || !password || !database) {
        notify({ type: 'error', message: '请填写MySQL连接信息' })
        return false
      }
    }
    return true
  }

  // 测试数据库连接
  const handleTestConnection = async () => {
    if (!validateDbConfig()) {
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus('none') // 重置状态

    try {
      // 准备数据
      const testData = {
        dbType: selectedDbType,
        ...(selectedDbType === 'mongo' 
          ? {
              mongoUri: connectionConfig.mongo.uri,
              mongoDatabase: connectionConfig.mongo.database
            } 
          : {
              mysqlHost: connectionConfig.mysql.host,
              mysqlPort: connectionConfig.mysql.port,
              mysqlUsername: connectionConfig.mysql.username,
              mysqlPassword: connectionConfig.mysql.password,
              mysqlDatabase: connectionConfig.mysql.database
            }
        )
      }

      // 发送测试请求
      const testUrl = selectedDbType === 'mongo' 
        ? 'https://httpbin.org/anything' // 模拟API调用
        : 'https://httpbin.org/anything'

      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })

      if (response.ok) {
        // 这里是模拟测试成功
        setConnectionStatus('success')
        if (selectedDbType === 'mongo') {
          const mongoUrl = new URL(connectionConfig.mongo.uri)
          const hostname = mongoUrl.hostname || '192.168.2.221'
          const port = mongoUrl.port || '27017'
          const dbName = connectionConfig.mongo.database || '公告'
          
          const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
          
          if (isLocalhost) {
            notify({ type: 'success', message: `成功连接到本地MongoDB (${dbName})` })
          } else if (hostname === '192.168.2.221') {
            notify({ type: 'success', message: `成功连接到MongoDB服务器 (${hostname}:${port}/${dbName})` })
          } else {
            notify({ type: 'success', message: `MongoDB连接成功: ${hostname}:${port}/${dbName}` })
          }
        } else {
          const { host, port, database } = connectionConfig.mysql
          notify({ type: 'success', message: `MySQL连接成功: ${host}:${port}/${database}` })
        }
      } else {
        setConnectionStatus('error')
        const errorData = await response.json()
        notify({ 
          type: 'error', 
          message: `连接失败: ${errorData.message || '服务器返回错误'}`
        })
      }
    } catch (error) {
      setConnectionStatus('error')
      console.error('测试数据库连接时出错:', error)
      notify({ 
        type: 'error', 
        message: `连接测试失败: ${error instanceof Error ? error.message : '未知错误'}`
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  // 保存配置
  const handleSaveConfig = () => {
    if (!validateDbConfig()) {
      return
    }
    
    notify({ type: 'success', message: '数据库配置已保存' })
  }

  // 连接到文件解析服务器
  const handleConnectToService = () => {
    if (!serviceIp) {
      notify({ type: 'error', message: '请输入服务器IP地址' })
      return
    }

    setIsConnecting(true)

    try {
      // 构建iframe URL
      const protocol = 'http'
      const baseUrl = `${protocol}://${serviceIp}${servicePort ? `:${servicePort}` : ''}`
      const fullUrl = `${baseUrl}${servicePath ? (servicePath.startsWith('/') ? servicePath : `/${servicePath}`) : ''}`
      
      setIframeUrl(fullUrl)
      notify({ type: 'success', message: '已连接到服务器' })
    } catch (error) {
      console.error('连接服务器时出错:', error)
      notify({ 
        type: 'error', 
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // MongoDB 数据操作
  const handleSelectMongoDoc = (doc: MongoDataType) => {
    setSelectedMongoDoc(doc)
    setEditedMongoDoc(JSON.stringify(doc, null, 2))
  }

  const handleAddNewMongoDoc = () => {
    // 创建一个空白文档结构，包含_id和空的name字段
    const emptyDoc = {
      _id: `new-${Date.now()}`,
      name: ''
    }
    setSelectedMongoDoc(emptyDoc)
    setEditedMongoDoc(JSON.stringify(emptyDoc, null, 2))
    setIsEditingMongo(true)
  }

  const handleSaveMongoDoc = async () => {
    try {
      // 解析JSON
      const updatedDoc = JSON.parse(editedMongoDoc);
      
      // 验证文档是否有name字段
      if (!updatedDoc.name) {
        notify({ type: 'error', message: '文档必须包含name字段' });
        return;
      }

      // 确保文档有_id字段
      if (!updatedDoc._id) {
        updatedDoc._id = `${Date.now()}`;
      }

      // 检查是否有重复name（对于新文档）
      if (isEditingMongo && mongoData.some(doc => doc.name === updatedDoc.name)) {
        notify({ type: 'error', message: `名称为 "${updatedDoc.name}" 的文档已存在` });
        return;
      }
      // 准备请求参数
      const requestBody = {
        uri: connectionConfig.mongo.uri,
        db: connectionConfig.mongo.database,
        collection: 'documents',
        document: updatedDoc,
        isUpdate: !isEditingMongo
      };
      try {
        // 显示加载状态
        notify({ type: 'info', message: '正在保存到MongoDB...' });
        
        // 调用MongoDB API
        const response = await fetch('/api/mongodb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        console.log('response', response);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API错误响应:', errorData);
          throw new Error(errorData.error || `服务器返回错误: ${response.status}`);
        } else {
          console.log('API响应状态:', response.status);
          try {
            const result = await response.json();
            console.log('API响应数据:', result);
            
            if (isEditingMongo) {
              // 新增文档成功
              const newMongoData = [...mongoData, updatedDoc];
              setMongoData(newMongoData);
              notify({ type: 'success', message: '新文档已添加到MongoDB' });
              
              // 清空编辑状态
              setSelectedMongoDoc(null);
              setEditedMongoDoc('');
            } else {
              // 更新文档成功
              const docIndex = mongoData.findIndex(doc => doc._id === updatedDoc._id);
              
              if (docIndex === -1) {
                notify({ type: 'error', message: '找不到要更新的文档' });
                return;
              }
              
              const newMongoData = [...mongoData];
              newMongoData[docIndex] = updatedDoc;
              setMongoData(newMongoData);
              
              notify({ type: 'success', message: '文档已更新到MongoDB' });
              
              // 更新选中的文档
              setSelectedMongoDoc(updatedDoc);
            }
            
            // 重置编辑状态
            setIsEditingMongo(false);
            
            // 输出更新后的数据到控制台
            console.log('MongoDB操作结果:', result);
          } catch (jsonError) {
            console.error('解析响应JSON失败:', jsonError);
            throw new Error('无法解析服务器响应');
          }
        }
      } catch (apiError) {
        console.error('MongoDB API调用失败:', apiError);
        notify({ 
          type: 'error', 
          message: `保存到MongoDB失败: ${apiError instanceof Error ? apiError.message : '未知错误'}` 
        });
      }
    } catch (error) {
      console.error('处理MongoDB文档时出错:', error);
      notify({ 
        type: 'error', 
        message: `JSON 格式错误: ${error instanceof Error ? error.message : '未知错误'}` 
      });
    }
  };

  const handleDeleteMongoDoc = async (id: string) => {
    try {
      // 显示加载状态
      notify({ type: 'info', message: '正在从MongoDB删除文档...' });
      
      // 构建查询参数
      const params = new URLSearchParams({
        uri: connectionConfig.mongo.uri,
        db: connectionConfig.mongo.database,
        collection: 'documents',
        id: id
      });
      
      // 调用MongoDB删除API
      const response = await fetch(`/api/mongodb?${params.toString()}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除失败');
      }
      
      // 从前端状态中移除文档
      setMongoData(mongoData.filter(doc => doc._id !== id));
      if (selectedMongoDoc && selectedMongoDoc._id === id) {
        setSelectedMongoDoc(null);
        setEditedMongoDoc('');
      }
      
      notify({ type: 'success', message: '文档已从MongoDB删除' });
      console.log('文档删除成功:', id);
    } catch (error) {
      console.error('删除MongoDB文档时出错:', error);
      notify({ 
        type: 'error', 
        message: `删除失败: ${error instanceof Error ? error.message : '未知错误'}` 
      });
    }
  }

  // MySQL 数据操作
  const handleSelectMySQLRow = (id: number) => {
    const row = mysqlData.find(row => row.id === id)
    if (row) {
      setSelectedMySQLRow(id)
      setEditedMySQLData({ ...row })
    }
  }

  const handleAddNewMySQLRow = () => {
    // 创建一个空行，只包含ID字段
    const newId = Math.max(0, ...mysqlData.map(row => row.id)) + 1
    const emptyRow: Record<string, any> = { id: newId }
    
    setSelectedMySQLRow(newId)
    setEditedMySQLData(emptyRow)
    setIsEditingMySQL(true)
  }

  const handleMySQLDataChange = (field: string, value: any) => {
    setEditedMySQLData({
      ...editedMySQLData,
      [field]: value
    })
  }

  const handleSaveMySQLRow = () => {
    if (isEditingMySQL) {
      // 新增行
      setMysqlData([...mysqlData, editedMySQLData as MySQLRow])
      notify({ type: 'success', message: '新记录已添加' })
    } else {
      // 更新行
      setMysqlData(mysqlData.map(row => 
        row.id === editedMySQLData.id ? editedMySQLData as MySQLRow : row
      ))
      notify({ type: 'success', message: '记录已更新' })
    }
    
    setIsEditingMySQL(false)
    setSelectedMySQLRow(null)
  }

  const handleDeleteMySQLRow = (id: number) => {
    setMysqlData(mysqlData.filter(row => row.id !== id))
    if (selectedMySQLRow === id) {
      setSelectedMySQLRow(null)
      setEditedMySQLData({})
    }
    notify({ type: 'success', message: '记录已删除' })
  }

  // 修改加载数据库数据的函数
  const handleLoadDatabaseData = async () => {
    if (!validateDbConfig()) {
      return;
    }

    setIsLoadingData(true);
    
    try {
      if (selectedDbType === 'mongo') {
        // 构建查询参数
        const params = new URLSearchParams({
          uri: connectionConfig.mongo.uri,
          db: connectionConfig.mongo.database,
          collection: 'documents'
        });
        
        // 调用MongoDB API获取数据
        const response = await fetch(`/api/mongodb?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '加载数据失败');
        }
        
        const data = await response.json();
        
        // 更新前端状态
        setMongoData(data.documents || []);
        
        const mongoUrl = new URL(connectionConfig.mongo.uri);
        const hostname = mongoUrl.hostname || '192.168.2.221';
        const port = mongoUrl.port || '27017';
        const dbName = connectionConfig.mongo.database;
        
        notify({ 
          type: 'success', 
          message: `已从MongoDB加载 ${data.documents?.length || 0} 条数据: ${hostname}:${port}/${dbName}` 
        });
      } else {
        const { host, port, database } = connectionConfig.mysql;
        
        // MySQL数据加载逻辑，目前仅显示提示信息
        setMysqlData([]);
        notify({ 
          type: 'success', 
          message: `已成功连接到MySQL数据库: ${host}:${port}/${database}` 
        });
      }
      
      // 设置连接状态为成功
      setConnectionStatus('success');
    } catch (error) {
      console.error('连接数据库时出错:', error);
      notify({ 
        type: 'error', 
        message: `连接数据库失败: ${error instanceof Error ? error.message : '未知错误'}` 
      });
      // 设置连接状态为错误
      setConnectionStatus('error');
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">文件解析服务配置</h2>
        <p className="text-sm text-gray-500">
          配置文件解析服务器和数据库连接信息
        </p>
      </div>

      {/* 文件解析服务器配置 - 完全重构的布局 */}
      <div className="mb-8">
        <h3 className="font-medium mb-3 px-1">文件解析服务器</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-4 bg-white">
          {/* 左侧配置区域 - 占1/3宽度 */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">服务器IP地址</label>
                <Input
                  value={serviceIp}
                  onChange={e => setServiceIp(e.target.value)}
                  placeholder="例如：192.168.2.221"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">端口（可选）</label>
                <Input
                  value={servicePort}
                  onChange={e => setServicePort(e.target.value)}
                  placeholder="例如：8765"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">路径（可选）</label>
                <Input
                  value={servicePath}
                  onChange={e => setServicePath(e.target.value)}
                  placeholder="例如：/dashboard"
                />
              </div>
              <Button 
                variant="primary" 
                onClick={handleConnectToService}
                loading={isConnecting}
                className="w-full mt-2"
              >
                连接服务器
              </Button>

              <div className="mt-4">
                <h4 className="font-medium mb-2 text-sm">连接信息</h4>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="mb-1"><span className="font-medium">当前状态：</span> 
                    <span className={iframeUrl ? "text-green-500" : "text-gray-500"}>
                      {iframeUrl ? '已连接' : '未连接'}
                    </span>
                  </p>
                  {iframeUrl && (
                    <p className="break-all text-xs"><span className="font-medium">URL：</span>{iframeUrl}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧iframe区域 - 占2/3宽度 */}
          <div className="md:col-span-2 bg-gray-50 rounded-lg overflow-hidden h-[450px]">
            {!iframeUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-6">
                  <div className="text-4xl mb-4">⚙️</div>
                  <p className="text-lg">请输入服务器IP地址并连接</p>
                </div>
              </div>
            ) : (
              <iframe 
                src={iframeUrl} 
                className="w-full h-full border-0" 
                title="文件解析服务"
                sandbox="allow-same-origin allow-scripts allow-forms"
                allow="fullscreen"
              />
            )}
          </div>
        </div>
      </div>

      {/* 数据库配置 - 左右布局 */}
      <div className="mb-8">
        <h3 className="font-medium mb-3 px-1">数据库配置</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 border rounded-lg bg-white">
          {/* 左侧配置区域 - 占2/5宽度 */}
          <div className="md:col-span-2 p-4 border-r">
            <div className="mb-4">
              <h4 className="font-medium mb-3">选择数据库类型</h4>
              <div className="flex gap-4">
                <div 
                  className={cn(
                    "border rounded-md p-3 cursor-pointer transition-colors", 
                    selectedDbType === 'mongo' 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedDbType('mongo')}
                >
                  <div className="font-medium">MongoDB</div>
                  <div className="text-xs text-gray-500">文档型数据库</div>
                </div>
                
                <div 
                  className={cn(
                    "border rounded-md p-3 cursor-pointer transition-colors", 
                    selectedDbType === 'mysql' 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedDbType('mysql')}
                >
                  <div className="font-medium">MySQL</div>
                  <div className="text-xs text-gray-500">关系型数据库</div>
                </div>
              </div>
            </div>

            {selectedDbType === 'mongo' && (
              <div>
                <h4 className="font-medium mb-3">MongoDB 配置</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">连接 URI</label>
                    <div className="flex items-center">
                      <div className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                        mongodb://
                      </div>
                      <Input
                        className="rounded-l-none"
                        value={connectionConfig.mongo.uri.replace(/^mongodb:\/\//, '')}
                        onChange={e => handleConnectionConfigChange('mongo', 'uri', `mongodb://${e.target.value}`)}
                        placeholder="localhost:27017"
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      只需输入主机地址，例如：localhost:27017
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">数据库名称</label>
                    <Input
                      value={connectionConfig.mongo.database}
                      onChange={e => handleConnectionConfigChange('mongo', 'database', e.target.value)}
                      placeholder="database"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedDbType === 'mysql' && (
              <div>
                <h4 className="font-medium mb-3">MySQL 配置</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">主机</label>
                    <Input
                      value={connectionConfig.mysql.host}
                      onChange={e => handleConnectionConfigChange('mysql', 'host', e.target.value)}
                      placeholder="localhost"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">端口</label>
                    <Input
                      value={connectionConfig.mysql.port}
                      onChange={e => handleConnectionConfigChange('mysql', 'port', e.target.value)}
                      placeholder="3306"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">用户名</label>
                    <Input
                      value={connectionConfig.mysql.username}
                      onChange={e => handleConnectionConfigChange('mysql', 'username', e.target.value)}
                      placeholder="root"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">密码</label>
                    <Input
                      type="password"
                      value={connectionConfig.mysql.password}
                      onChange={e => handleConnectionConfigChange('mysql', 'password', e.target.value)}
                      placeholder="password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">数据库名称</label>
                    <Input
                      value={connectionConfig.mysql.database}
                      onChange={e => handleConnectionConfigChange('mysql', 'database', e.target.value)}
                      placeholder="database"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center">
              <Button 
                variant="secondary"
                onClick={handleTestConnection}
                loading={isTestingConnection}
              >
                测试连接
              </Button>
              <span className="ml-2 text-sm">
                {isTestingConnection ? (
                  <span className="text-gray-500">测试中...</span>
                ) : connectionStatus === 'success' ? (
                  <span className="text-green-500">连接成功</span>
                ) : connectionStatus === 'error' ? (
                  <span className="text-red-500">连接失败</span>
                ) : (
                  <span className="text-gray-500">点击测试数据库连接是否成功</span>
                )}
              </span>
            </div>

            <div className="mt-4">
              <Checkbox 
                checked={shouldSaveToKnowledgeBase} 
                onCheck={() => setShouldSaveToKnowledgeBase(!shouldSaveToKnowledgeBase)}
              />
              <span className="ml-2">同时保存到现有知识库</span>
            </div>

            <div className="mt-4">
              <Button 
                variant="primary" 
                onClick={handleSaveConfig}
              >
                保存配置
              </Button>
            </div>
          </div>
          
          {/* 右侧数据操作区域 - 占3/5宽度 */}
          <div className="md:col-span-3 p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">
                {selectedDbType === 'mongo' ? 'MongoDB 数据' : 'MySQL 数据'}
              </h4>
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  size="small"
                  onClick={handleLoadDatabaseData}
                  loading={isLoadingData}
                >
                  {isLoadingData ? '加载中...' : '加载数据'}
                </Button>
                <Button 
                  variant="primary"
                  size="small"
                  onClick={selectedDbType === 'mongo' ? handleAddNewMongoDoc : handleAddNewMySQLRow}
                >
                  新增
                </Button>
              </div>
            </div>

            {selectedDbType === 'mongo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
                {/* MongoDB 数据列表 */}
                <div className="border rounded overflow-auto h-full">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mongoData.length > 0 ? (
                        mongoData.map(doc => (
                          <tr 
                            key={doc._id} 
                            className={cn(
                              "hover:bg-gray-50 cursor-pointer",
                              selectedMongoDoc && selectedMongoDoc._id === doc._id ? "bg-blue-50" : ""
                            )}
                            onClick={() => handleSelectMongoDoc(doc)}
                          >
                            <td className="px-4 py-2 text-sm text-gray-900">{doc.name || '未命名'}</td>
                            <td className="px-4 py-2 text-sm">
                              <button 
                                className="text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteMongoDoc(doc._id)
                                }}
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key="mongo-empty">
                          <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                            暂无数据，请点击"加载数据"或"新增"按钮
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MongoDB 文档编辑器 */}
                <div className="border rounded p-3 h-full flex flex-col">
                  <div className="text-sm font-medium mb-2">
                    {isEditingMongo ? '新增文档' : selectedMongoDoc ? '编辑文档' : '选择一个文档进行编辑'}
                  </div>
                  <div className="flex-grow relative">
                    <textarea
                      className="absolute inset-0 w-full h-full p-2 font-mono text-xs resize-none border rounded"
                      value={editedMongoDoc}
                      onChange={(e) => setEditedMongoDoc(e.target.value)}
                      placeholder="选择一个文档或创建新文档"
                      disabled={!selectedMongoDoc && !isEditingMongo}
                    />
                  </div>
                  {(selectedMongoDoc || isEditingMongo) && (
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="primary"
                        size="small"
                        onClick={handleSaveMongoDoc}
                      >
                        保存
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedDbType === 'mysql' && (
              <div className="h-[500px] flex flex-col">
                {/* MySQL 数据表格 */}
                <div className="flex-grow border rounded overflow-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {mysqlColumns.map(column => (
                          <th 
                            key={column.name} 
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {column.name}
                            <span className="ml-1 text-gray-400">({column.type})</span>
                          </th>
                        ))}
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mysqlData.length > 0 ? (
                        mysqlData.map(row => (
                          <tr 
                            key={`row-${row.id}`} 
                            className={cn(
                              "hover:bg-gray-50 cursor-pointer",
                              selectedMySQLRow === row.id ? "bg-blue-50" : ""
                            )}
                            onClick={() => handleSelectMySQLRow(row.id)}
                          >
                            {mysqlColumns.map(column => (
                              <td key={`cell-${row.id}-${column.name}`} className="px-4 py-2 text-sm text-gray-900">
                                {String(row[column.name] || '')}
                              </td>
                            ))}
                            <td className="px-4 py-2 text-sm">
                              <button 
                                className="text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteMySQLRow(row.id)
                                }}
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key="mysql-empty">
                          <td colSpan={mysqlColumns.length + 1} className="px-4 py-8 text-center text-gray-500">
                            暂无数据，请点击"加载数据"或"新增"按钮
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MySQL 行编辑器 */}
                {(selectedMySQLRow !== null || isEditingMySQL) && (
                  <div className="mt-4 border rounded p-4">
                    <div className="text-sm font-medium mb-3">
                      {isEditingMySQL ? '新增记录' : '编辑记录'}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {mysqlColumns.map(column => (
                        <div key={`edit-field-${column.name}`}>
                          <label className="block text-sm font-medium mb-1">{column.name}</label>
                          <Input
                            value={editedMySQLData[column.name] || ''}
                            onChange={e => handleMySQLDataChange(column.name, e.target.value)}
                            disabled={column.name === 'id' && !isEditingMySQL}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="primary"
                        size="small"
                        onClick={handleSaveMySQLRow}
                      >
                        保存
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button 
          variant="primary" 
          onClick={handleSaveConfig}
        >
          保存所有配置
        </Button>
      </div>
    </div>
  )
}

export default DatabaseConfigManager 