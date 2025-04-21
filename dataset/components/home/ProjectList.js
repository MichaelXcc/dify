'use client';

import {
  Grid,
  Card,
  Box,
  CardActionArea,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  Paper,
  Button,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import Link from 'next/link';
import { styles } from '@/styles/home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function ProjectList({ projects, onCreateProject }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // 打开删除确认对话框
  const handleOpenDeleteDialog = (event, project) => {
    event.stopPropagation();
    event.preventDefault();
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // 删除项目
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('projects.deleteFailed'));
      }

      // 刷新页面以更新项目列表
      window.location.reload();
    } catch (error) {
      console.error('删除项目失败:', error);
      alert(error.message || t('projects.deleteFailed'));
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };


  // 项目卡片组件
  const ProjectCard = ({ project }) => (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '240px',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardActionArea
        component={Link}
        href={`/projects/${project.id}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          flexGrow: 1,
          height: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            flexGrow: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40
                }}
              >
                <DataObjectIcon />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="600" sx={{ color: 'text.primary' }}>
                {project.name}
              </Typography>
            </Box>
            <IconButton
              size="small"
              color="error"
              onClick={e => handleOpenDeleteDialog(e, project)}
              sx={{
                opacity: 0.7,
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'error.lighter'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              flexGrow: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis'
            }}
          >
            {project.description || t('projects.noDescription')}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                size="small"
                label={`${project.questionsCount || 0} ${t('projects.questions')}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                size="small"
                label={`${project.datasetsCount || 0} ${t('projects.datasets')}`}
                color="secondary"
                variant="outlined"
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {project.lastUpdated}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );

  return (
    <div className="relative grid grid-cols-1 content-start gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
      {projects.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center p-8">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('projects.noProjects')}
          </Typography>
          <Button 
            variant="text"
            onClick={onCreateProject} 
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              height: '2rem',
              borderRadius: '0.75rem',
              color: 'primary.main',
              mt: 2,
              '&:hover': {
                backgroundColor: 'background.hover',
              }
            }}
          >
            {t('projects.createFirst')}
          </Button>
        </div>
      ) : (
        <>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </>
      )}

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{t('projects.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {projectToDelete && (
              <>
                {t('projects.deleteConfirm')}
                <br />
                <Typography component="span" fontWeight="bold" sx={{ mt: 1, display: 'inline-block' }}>
                  {projectToDelete.name}
                </Typography>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog} 
            disabled={loading}
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              height: '2rem',
              borderRadius: '0.75rem',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'background.hover',
              }
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDeleteProject} 
            color="error" 
            variant="text" 
            disabled={loading}
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              height: '2rem',
              borderRadius: '0.75rem',
              '&:hover': {
                backgroundColor: 'background.hover',
              }
            }}
          >
            {loading ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
