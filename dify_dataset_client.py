import requests
import json
from typing import Dict, List, Union, Optional, Any


class DifyDatasetClient:
    """
    Dify知识库API客户端
    """
    
    def __init__(self, api_key: str, base_url: str):
        """
        初始化客户端
        
        Args:
            api_key: API密钥
            base_url: API基础URL
        """
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def _get(self, path: str, params: dict = None) -> dict:
        """发送GET请求"""
        response = requests.get(f"{self.base_url}{path}", headers=self.headers, params=params)
        response.raise_for_status()
        return response.json() if response.status_code != 204 else {"result": "success"}
    
    def _post(self, path: str, data: dict = None, files: dict = None) -> dict:
        """发送POST请求"""
        headers = self.headers.copy()
        
        if files:
            # 当上传文件时，不包含Content-Type，让requests自动设置
            headers.pop('Content-Type', None)
            
        response = requests.post(f"{self.base_url}{path}", headers=headers, 
                                json=data if not files else None, 
                                data=None if not files else data, 
                                files=files)
        response.raise_for_status()
        return response.json() if response.status_code != 204 else {"result": "success"}
    
    def _patch(self, path: str, data: dict) -> dict:
        """发送PATCH请求"""
        response = requests.patch(f"{self.base_url}{path}", headers=self.headers, json=data)
        response.raise_for_status()
        return response.json() if response.status_code != 204 else {"result": "success"}
    
    def _delete(self, path: str) -> dict:
        """发送DELETE请求"""
        response = requests.delete(f"{self.base_url}{path}", headers=self.headers)
        response.raise_for_status()
        return response.json() if response.status_code != 204 else {"result": "success"}
    
    # ==== 知识库相关接口 ====
    
    def create_empty_dataset(self, name: str, description: str = None, indexing_technique: str = None,
                            permission: str = "only_me", provider: str = "vendor",
                            embedding_model: str = None, embedding_provider_name: str = None,
                            retrieval_model: dict = None) -> dict:
        """
        创建空知识库
        
        Args:
            name: 知识库名称
            description: 知识库描述
            indexing_technique: 索引模式 (high_quality/economy)
            permission: 权限 (only_me/all_team_members/partial_members)
            provider: Provider (vendor/external)
            embedding_model: Embedding模型名称
            embedding_provider_name: Embedding模型供应商
            retrieval_model: 检索模式配置
            
        Returns:
            知识库详情
        """
        data = {
            "name": name,
            "description": description,
            "indexing_technique": indexing_technique,
            "permission": permission,
            "provider": provider
        }
        
        if embedding_model:
            data["embedding_model"] = embedding_model
        
        if embedding_provider_name:
            data["embedding_provider_name"] = embedding_provider_name
            
        if retrieval_model:
            data["retrieval_model"] = retrieval_model
            
        return self._post("/datasets", data)
    
    def get_dataset_list(self, keyword: str = None, tag_ids: List[str] = None,
                        page: int = 1, limit: int = 20, include_all: bool = False) -> dict:
        """
        获取知识库列表
        
        Args:
            keyword: 搜索关键词
            tag_ids: 标签ID列表
            page: 页码
            limit: 返回条数
            include_all: 是否包含所有数据集
            
        Returns:
            知识库列表
        """
        params = {
            "page": page,
            "limit": limit
        }
        
        if keyword:
            params["keyword"] = keyword
            
        if tag_ids:
            params["tag_ids"] = tag_ids
            
        if include_all:
            params["include_all"] = include_all
            
        return self._get("/datasets", params)
    
    def get_dataset_detail(self, dataset_id: str) -> dict:
        """
        查看知识库详情
        
        Args:
            dataset_id: 知识库ID
            
        Returns:
            知识库详情
        """
        return self._get(f"/datasets/{dataset_id}")
    
    def update_dataset(self, dataset_id: str, name: str = None, indexing_technique: str = None,
                      permission: str = None, embedding_model_provider: str = None,
                      embedding_model: str = None, retrieval_model: dict = None,
                      partial_member_list: List[str] = None) -> dict:
        """
        修改知识库详情
        
        Args:
            dataset_id: 知识库ID
            name: 知识库名称
            indexing_technique: 索引模式
            permission: 权限
            embedding_model_provider: 嵌入模型提供商
            embedding_model: 嵌入模型
            retrieval_model: 检索参数
            partial_member_list: 部分团队成员ID列表
            
        Returns:
            知识库详情
        """
        data = {}
        
        if name:
            data["name"] = name
            
        if indexing_technique:
            data["indexing_technique"] = indexing_technique
            
        if permission:
            data["permission"] = permission
            
        if embedding_model_provider:
            data["embedding_model_provider"] = embedding_model_provider
            
        if embedding_model:
            data["embedding_model"] = embedding_model
            
        if retrieval_model:
            data["retrieval_model"] = retrieval_model
            
        if partial_member_list:
            data["partial_member_list"] = partial_member_list
            
        return self._patch(f"/datasets/{dataset_id}", data)
    
    def delete_dataset(self, dataset_id: str) -> dict:
        """
        删除知识库
        
        Args:
            dataset_id: 知识库ID
            
        Returns:
            结果
        """
        return self._delete(f"/datasets/{dataset_id}")
    
    # ==== 文档相关接口 ====
    
    def create_document_by_text(self, dataset_id: str, name: str, text: str, 
                               indexing_technique: str = "high_quality", 
                               doc_form: str = "text_model",
                               doc_language: str = None,
                               process_rule: dict = None,
                               retrieval_model: dict = None,
                               embedding_model: str = None,
                               embedding_model_provider: str = None) -> dict:
        """
        通过文本创建文档
        
        Args:
            dataset_id: 知识库ID
            name: 文档名称
            text: 文档内容
            indexing_technique: 索引方式 (high_quality/economy)
            doc_form: 索引内容的形式 (text_model/hierarchical_model/qa_model)
            doc_language: 文档语言
            process_rule: 处理规则
            retrieval_model: 检索模式
            embedding_model: Embedding模型名称
            embedding_model_provider: Embedding模型供应商
            
        Returns:
            文档信息
        """
        data = {
            "name": name,
            "text": text,
            "indexing_technique": indexing_technique,
            "doc_form": doc_form
        }
        
        if doc_language:
            data["doc_language"] = doc_language
            
        if process_rule:
            data["process_rule"] = process_rule
            
        if retrieval_model:
            data["retrieval_model"] = retrieval_model
            
        if embedding_model:
            data["embedding_model"] = embedding_model
            
        if embedding_model_provider:
            data["embedding_model_provider"] = embedding_model_provider
            
        return self._post(f"/datasets/{dataset_id}/document/create-by-text", data)
    
    def create_document_by_file(self, dataset_id: str, file_path: str, 
                              indexing_technique: str = "high_quality",
                              doc_form: str = "text_model",
                              doc_language: str = None,
                              process_rule: dict = None,
                              original_document_id: str = None,
                              retrieval_model: dict = None,
                              embedding_model: str = None,
                              embedding_model_provider: str = None) -> dict:
        """
        通过文件创建文档
        
        Args:
            dataset_id: 知识库ID
            file_path: 文件路径
            indexing_technique: 索引方式
            doc_form: 索引内容的形式
            doc_language: 文档语言
            process_rule: 处理规则
            original_document_id: 源文档ID
            retrieval_model: 检索模式
            embedding_model: Embedding模型名称
            embedding_model_provider: Embedding模型供应商
            
        Returns:
            文档信息
        """
        # 准备数据部分
        data = {
            "indexing_technique": indexing_technique,
            "doc_form": doc_form
        }
        
        if doc_language:
            data["doc_language"] = doc_language
            
        if process_rule:
            data["process_rule"] = process_rule
            
        if original_document_id:
            data["original_document_id"] = original_document_id
            
        if retrieval_model:
            data["retrieval_model"] = retrieval_model
            
        if embedding_model:
            data["embedding_model"] = embedding_model
            
        if embedding_model_provider:
            data["embedding_model_provider"] = embedding_model_provider
        
        # 准备multipart表单
        files = {'file': open(file_path, 'rb')}
        form_data = {'data': json.dumps(data)}
        
        try:
            return self._post(f"/datasets/{dataset_id}/document/create-by-file", data=form_data, files=files)
        finally:
            files['file'].close()
    
    def get_document_list(self, dataset_id: str, keyword: str = None, 
                         page: int = 1, limit: int = 20) -> dict:
        """
        获取知识库文档列表
        
        Args:
            dataset_id: 知识库ID
            keyword: 搜索关键词
            page: 页码
            limit: 返回条数
            
        Returns:
            文档列表
        """
        params = {
            "page": page,
            "limit": limit
        }
        
        if keyword:
            params["keyword"] = keyword
            
        return self._get(f"/datasets/{dataset_id}/documents", params)
    
    def update_document_by_text(self, dataset_id: str, document_id: str, 
                               name: str = None, text: str = None,
                               process_rule: dict = None) -> dict:
        """
        通过文本更新文档
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            name: 文档名称
            text: 文档内容
            process_rule: 处理规则
            
        Returns:
            文档信息
        """
        data = {}
        
        if name:
            data["name"] = name
            
        if text:
            data["text"] = text
            
        if process_rule:
            data["process_rule"] = process_rule
            
        return self._post(f"/datasets/{dataset_id}/documents/{document_id}/update-by-text", data)
    
    def update_document_by_file(self, dataset_id: str, document_id: str, 
                              file_path: str, name: str = None,
                              process_rule: dict = None) -> dict:
        """
        通过文件更新文档
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            file_path: 文件路径
            name: 文档名称
            process_rule: 处理规则
            
        Returns:
            文档信息
        """
        data = {}
        
        if name:
            data["name"] = name
            
        if process_rule:
            data["process_rule"] = process_rule
        
        # 准备multipart表单
        files = {'file': open(file_path, 'rb')}
        form_data = {'data': json.dumps(data)}
        
        try:
            return self._post(f"/datasets/{dataset_id}/documents/{document_id}/update-by-file", 
                             data=form_data, files=files)
        finally:
            files['file'].close()
    
    def delete_document(self, dataset_id: str, document_id: str) -> dict:
        """
        删除文档
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            
        Returns:
            结果
        """
        return self._delete(f"/datasets/{dataset_id}/documents/{document_id}")
    
    def get_document_indexing_status(self, dataset_id: str, batch: str) -> dict:
        """
        获取文档嵌入状态（进度）
        
        Args:
            dataset_id: 知识库ID
            batch: 上传文档的批次号
            
        Returns:
            文档嵌入状态
        """
        return self._get(f"/datasets/{dataset_id}/documents/{batch}/indexing-status")
    
    def get_upload_file(self, dataset_id: str, document_id: str) -> dict:
        """
        获取上传文件信息
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            
        Returns:
            文件信息
        """
        return self._get(f"/datasets/{dataset_id}/documents/{document_id}/upload-file")
    
    # ==== 文档分段相关接口 ====
    
    def create_segments(self, dataset_id: str, document_id: str, 
                       segments: List[Dict[str, Any]]) -> dict:
        """
        新增分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            segments: 分段列表，每个分段包含content, answer(可选), keywords(可选)
            
        Returns:
            分段信息
        """
        data = {
            "segments": segments
        }
        
        return self._post(f"/datasets/{dataset_id}/documents/{document_id}/segments", data)
    
    def get_segments(self, dataset_id: str, document_id: str, keyword: str = None,
                    status: str = None, page: int = 1, limit: int = 20) -> dict:
        """
        查询文档分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            keyword: 搜索关键词
            status: 搜索状态
            page: 页码
            limit: 返回条数
            
        Returns:
            分段列表
        """
        params = {
            "page": page,
            "limit": limit
        }
        
        if keyword:
            params["keyword"] = keyword
            
        if status:
            params["status"] = status
            
        return self._get(f"/datasets/{dataset_id}/documents/{document_id}/segments", params)
    
    def update_segment(self, dataset_id: str, document_id: str, segment_id: str,
                     content: str = None, answer: str = None, 
                     keywords: List[str] = None, enabled: bool = None,
                     regenerate_child_chunks: bool = None) -> dict:
        """
        更新文档分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            segment_id: 分段ID
            content: 文本内容
            answer: 答案内容
            keywords: 关键字列表
            enabled: 是否启用
            regenerate_child_chunks: 是否重新生成子分段
            
        Returns:
            分段信息
        """
        data = {
            "segment": {}
        }
        
        if content is not None:
            data["segment"]["content"] = content
            
        if answer is not None:
            data["segment"]["answer"] = answer
            
        if keywords is not None:
            data["segment"]["keywords"] = keywords
            
        if enabled is not None:
            data["segment"]["enabled"] = enabled
            
        if regenerate_child_chunks is not None:
            data["segment"]["regenerate_child_chunks"] = regenerate_child_chunks
            
        return self._post(f"/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}", data)
    
    def delete_segment(self, dataset_id: str, document_id: str, segment_id: str) -> dict:
        """
        删除文档分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            segment_id: 分段ID
            
        Returns:
            结果
        """
        return self._delete(f"/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}")
    
    # ==== 子分段相关接口 ====
    
    def create_child_chunk(self, dataset_id: str, document_id: str, 
                          segment_id: str, content: str) -> dict:
        """
        新增文档子分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            segment_id: 分段ID
            content: 子分段内容
            
        Returns:
            子分段信息
        """
        data = {
            "content": content
        }
        
        return self._post(f"/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks", data)
    
    def get_child_chunks(self, dataset_id: str, document_id: str, segment_id: str,
                        keyword: str = None, page: int = 1, limit: int = 20) -> dict:
        """
        查询文档子分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            segment_id: 分段ID
            keyword: 搜索关键词
            page: 页码
            limit: 返回条数
            
        Returns:
            子分段列表
        """
        params = {
            "page": page,
            "limit": limit
        }
        
        if keyword:
            params["keyword"] = keyword
            
        return self._get(f"/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks", params)
    
    def update_child_chunk(self, dataset_id: str, document_id: str, 
                         segment_id: str, child_chunk_id: str, content: str) -> dict:
        """
        更新文档子分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            segment_id: 分段ID
            child_chunk_id: 子分段ID
            content: 子分段内容
            
        Returns:
            子分段信息
        """
        data = {
            "content": content
        }
        
        return self._patch(f"/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}", data)
    
    def delete_child_chunk(self, dataset_id: str, document_id: str, 
                         segment_id: str, child_chunk_id: str) -> dict:
        """
        删除文档子分段
        
        Args:
            dataset_id: 知识库ID
            document_id: 文档ID
            segment_id: 分段ID
            child_chunk_id: 子分段ID
            
        Returns:
            结果
        """
        return self._delete(f"/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}")
    
    # ==== 知识库检索 ====
    
    def retrieve_dataset(self, dataset_id: str, query: str, 
                       retrieval_model: dict = None, 
                       external_retrieval_model: dict = None) -> dict:
        """
        检索知识库
        
        Args:
            dataset_id: 知识库ID
            query: 检索关键词
            retrieval_model: 检索参数
            external_retrieval_model: 外部检索模型参数
            
        Returns:
            检索结果
        """
        data = {
            "query": query
        }
        
        if retrieval_model:
            data["retrieval_model"] = retrieval_model
            
        if external_retrieval_model:
            data["external_retrieval_model"] = external_retrieval_model
            
        return self._post(f"/datasets/{dataset_id}/retrieve", data)
    
    # ==== 元数据相关接口 ====
    
    def create_metadata(self, dataset_id: str, metadata_type: str, name: str) -> dict:
        """
        新增元数据
        
        Args:
            dataset_id: 知识库ID
            metadata_type: 元数据类型
            name: 元数据名称
            
        Returns:
            元数据信息
        """
        data = {
            "type": metadata_type,
            "name": name
        }
        
        return self._post(f"/datasets/{dataset_id}/metadata", data)
    
    def update_metadata(self, dataset_id: str, metadata_id: str, name: str) -> dict:
        """
        更新元数据
        
        Args:
            dataset_id: 知识库ID
            metadata_id: 元数据ID
            name: 元数据名称
            
        Returns:
            元数据信息
        """
        data = {
            "name": name
        }
        
        return self._patch(f"/datasets/{dataset_id}/metadata/{metadata_id}", data)
    
    def delete_metadata(self, dataset_id: str, metadata_id: str) -> dict:
        """
        删除元数据
        
        Args:
            dataset_id: 知识库ID
            metadata_id: 元数据ID
            
        Returns:
            结果
        """
        return self._delete(f"/datasets/{dataset_id}/metadata/{metadata_id}")
    
    def toggle_built_in_metadata(self, dataset_id: str, action: str) -> dict:
        """
        启用/禁用内置元数据
        
        Args:
            dataset_id: 知识库ID
            action: 操作，disable或enable
            
        Returns:
            结果
        """
        return self._post(f"/datasets/{dataset_id}/metadata/built-in/{action}")
    
    def update_documents_metadata(self, dataset_id: str, operation_data: List[Dict[str, Any]]) -> dict:
        """
        更新文档元数据
        
        Args:
            dataset_id: 知识库ID
            operation_data: 操作数据，包含document_id和metadata_list
            
        Returns:
            结果
        """
        data = {
            "operation_data": operation_data
        }
        
        return self._post(f"/datasets/{dataset_id}/documents/metadata", data)
    
    def get_metadata_list(self, dataset_id: str) -> dict:
        """
        查询知识库元数据列表
        
        Args:
            dataset_id: 知识库ID
            
        Returns:
            元数据列表
        """
        return self._get(f"/datasets/{dataset_id}/metadata")
    
    # ==== 模型列表 ====
    
    def get_embedding_models(self) -> dict:
        """
        获取嵌入模型列表
        
        Returns:
            嵌入模型列表
        """
        return self._get("/workspaces/current/models/model-types/text-embedding")


# 使用示例
if __name__ == "__main__":
    # 初始化客户端
    client = DifyDatasetClient(
        api_key="dataset-2ziPmrCbREyrVzoqherBxZE3",
        base_url="http://192.168.2.221/v1"
    )
    
    # 创建知识库示例
    # result = client.create_empty_dataset(
    #     name="测试知识库",
    #     description="这是一个测试知识库",
    #     indexing_technique="high_quality"
    # )
    # print(result)
    
    # 获取知识库列表示例
    datasets = client.get_dataset_list()
    print(datasets) 