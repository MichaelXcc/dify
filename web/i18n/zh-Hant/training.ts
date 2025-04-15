const translation = {
  title: '模型训练',
  description: '训练自定义模型以满足您的特定需求',
  tabs: {
    train: '训练',
    evaluate: '评估',
    tasks: '任务',
    logs: '日志',
  },
  startTraining: '开始训练',
  evaluateModel: '模型评估',
  modelSelection: {
    title: '选择基础模型',
    description: '选择您想要训练的基础模型',
  },
  datasetSelection: {
    title: '选择训练数据集',
    description: '选择用于训练模型的数据集',
  },
  parameters: {
    title: '训练参数',
    description: '配置训练参数以优化模型性能',
    epochs: '训练轮次',
    batchSize: '批次大小',
    learningRate: '学习率',
  },
  connection: {
    title: '连接设置',
    description: '配置训练环境连接设置',
    endpoint: '训练服务端点',
    apiKey: 'API 密钥',
  },
  tasks: {
    title: '训练任务',
    status: {
      running: '运行中',
      completed: '已完成',
      failed: '失败',
      pending: '等待中',
    },
    startTime: '开始时间',
    duration: '持续时间',
    progress: '进度',
    model: '模型',
    dataset: '数据集',
  },
  logs: {
    title: '训练日志',
    noLogs: '暂无日志',
    refresh: '刷新',
    downloadLogs: '下载日志',
  },
}

export default translation 