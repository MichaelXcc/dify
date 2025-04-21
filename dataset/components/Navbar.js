'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  MenuItem,
  FormControl,
  Select,
  Tabs,
  Tab,
  IconButton,
  useTheme as useMuiTheme,
  Tooltip,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ModelSelect from './ModelSelect';
import LanguageSwitcher from './LanguageSwitcher';
import UpdateChecker from './UpdateChecker';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

// 图标
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import GitHubIcon from '@mui/icons-material/GitHub';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

export default function Navbar({ projects = [], currentProject, models = [], onCreateProject }) {
  const [selectedProject, setSelectedProject] = useState(currentProject || '');
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState(() => {
    // 从 localStorage 获取上次选择的模型
    const savedModel = localStorage.getItem('selectedModel');
    // 如果保存的模型在当前模型列表中存在，则使用它
    if (savedModel && models.some(m => m.id === savedModel)) {
      return savedModel;
    }
    // 否则使用第一个可用的模型
    return models[0]?.id || '';
  });
  const pathname = usePathname();
  const theme = useMuiTheme();
  const { resolvedTheme, setTheme } = useTheme();

  // 只在项目详情页显示模块选项卡
  const isProjectDetail = pathname.includes('/projects/') && pathname.split('/').length > 3;

  const handleProjectChange = event => {
    const newProjectId = event.target.value;
    setSelectedProject(newProjectId);
    // 跳转到新选择的项目页面
    window.location.href = `/projects/${newProjectId}/text-split`;
  };

  const handleModelChange = event => {
    if (!event || !event.target) return;
    const newModel = event.target.value;
    setSelectedModel(newModel);
    // 将选择保存到 localStorage
    localStorage.setItem('selectedModel', newModel);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'transparent',
        boxShadow: 'none'
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          height: '64px',
          px: 4,
          justifyContent: 'space-between'
        }}
      >
        {/* 左侧Logo和项目选择 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
            component={Link}
            href="/"
          >
            <Box
              // component="img"
              // src="/imgs/logo.svg"
              // alt="Easy Dataset Logo"
              // sx={{
              //   width: 28,
              //   height: 28
              // }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                letterSpacing: '-0.3px',
                color: 'text.primary'
              }}
            >
              X-Studio DataSet
            </Typography>
          </Box>

          {isProjectDetail && (
            <>
              <Box sx={{ color: 'text.tertiary', fontWeight: 'light' }}>/</Box>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={selectedProject}
                  onChange={handleProjectChange}
                  displayEmpty
                  variant="outlined"
                  sx={{
                    bgcolor: 'background.default',
                    borderRadius: '0.5rem',
                    border: 'none',
                    color: 'text.primary',
                    '& .MuiSelect-icon': {
                      color: 'text.secondary'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '1px'
                    },
                    height: '2rem'
                  }}
                  MenuProps={{
                    PaperProps: {
                      elevation: 2,
                      sx: { mt: 1, borderRadius: 1 }
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    {t('projects.selectProject')}
                  </MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        {/* 中间的功能模块导航 */}
        {isProjectDetail && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Tabs
              value={pathname}
              textColor="inherit"
              TabIndicatorProps={{
                style: {
                  height: '2px',
                  borderRadius: '1px'
                }
              }}
              sx={{
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  color: 'text.secondary',
                  minHeight: '2rem',
                  marginX: '0.25rem',
                  borderRadius: '0.5rem',
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'state.base.hover'
                  }
                },
                '& .Mui-selected': {
                  color: 'text.primary',
                  fontWeight: 500
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main'
                }
              }}
            >
              <Tab
                label={t('textSplit.title')}
                value={`/projects/${selectedProject}/text-split`}
                component={Link}
                href={`/projects/${selectedProject}/text-split`}
              />
              <Tab
                label={t('questions.title')}
                value={`/projects/${selectedProject}/questions`}
                component={Link}
                href={`/projects/${selectedProject}/questions`}
              />
              <Tab
                label={t('datasets.management')}
                value={`/projects/${selectedProject}/datasets`}
                component={Link}
                href={`/projects/${selectedProject}/datasets`}
              />
              <Tab
                label={t('settings.title')}
                value={`/projects/${selectedProject}/settings`}
                component={Link}
                href={`/projects/${selectedProject}/settings`}
              />
              <Tab
                label={t('playground.title')}
                value={`/projects/${selectedProject}/playground`}
                component={Link}
                href={`/projects/${selectedProject}/playground`}
              />
            </Tabs>
          </Box>
        )}

        {/* 右侧操作区 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* 创建项目按钮 */}
          <Button
            variant="text"
            size="small"
            onClick={onCreateProject}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              mr: 1,
              px: 1.5,
              height: '32px',
              borderRadius: '12px',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: 'text.primary',
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {t('home.createProject')}
          </Button>

          {/* 搜索公开数据集按钮 */}
          <Button
            variant="text"
            size="small"
            onClick={() => {
              window.location.href = '/dataset-square';
            }}
            startIcon={<SearchIcon />}
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              mr: 1,
              px: 1.5,
              height: '32px',
              borderRadius: '12px',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: 'text.primary',
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {t('home.searchDataset')}
          </Button>

          {/* 模型选择 */}
          {pathname.includes('/projects/') && (
            <ModelSelect models={models} selectedModel={selectedModel} onChange={handleModelChange} />
          )}

          {/* 数据集广场链接 */}
          {/* <Tooltip title={t('datasetSquare.title')}>
            <IconButton
              component={Link}
              href="/dataset-square"
              size="small"
              sx={{
                bgcolor: 'background.default',
                color: 'text.secondary',
                p: 1,
                borderRadius: '0.5rem',
                '&:hover': {
                  bgcolor: 'state.base.hover',
                  color: 'text.primary'
                },
                width: '2rem',
                height: '2rem'
              }}
            >
              <StorageIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          
          {/* 语言切换器 */}
          {/* <LanguageSwitcher /> */}
          
          {/* 主题切换按钮 */}
          {/* <Tooltip title={resolvedTheme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}>
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                bgcolor: 'background.default',
                color: 'text.secondary',
                p: 1,
                borderRadius: '0.5rem',
                '&:hover': {
                  bgcolor: 'state.base.hover',
                  color: 'text.primary'
                },
                width: '2rem',
                height: '2rem'
              }}
            >
              {resolvedTheme === 'dark' ? (
                <LightModeOutlinedIcon fontSize="small" />
              ) : (
                <DarkModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip> */}

          {/* GitHub链接 */}
          {/* <Tooltip title={t('common.visitGitHub')}>
            <IconButton
              onClick={() => window.open('https://github.com/ConardLi/easy-dataset', '_blank')}
              size="small"
              sx={{
                bgcolor: 'background.default',
                color: 'text.secondary',
                p: 1,
                borderRadius: '0.5rem',
                '&:hover': {
                  bgcolor: 'state.base.hover',
                  color: 'text.primary'
                },
                width: '2rem',
                height: '2rem'
              }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}

          {/* 更新检查器 */}
          <UpdateChecker />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
