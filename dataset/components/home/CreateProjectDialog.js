'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function CreateProjectDialog({ open, onClose }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reuseConfigFrom: ''
  });
  const [error, setError] = useState(null);

  // 获取项目列表
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('获取项目列表失败:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(t('projects.createFailed'));
      }

      const data = await response.json();

      router.push(`/projects/${data.id}/settings?tab=model`);
    } catch (err) {
      console.error(t('projects.createError'), err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          backgroundColor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="600" sx={{ color: 'text.primary' }}>
          {t('projects.createNew')}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              name="name"
              label={t('projects.name')}
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                } 
              }}
              variant="outlined"
              size="small"
            />
            <TextField
              name="description"
              label={t('projects.description')}
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                } 
              }}
              variant="outlined"
              size="small"
            />
            <FormControl 
              fullWidth 
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                } 
              }}
            >
              <InputLabel id="reuse-config-label">{t('projects.reuseConfig')}</InputLabel>
              <Select
                labelId="reuse-config-label"
                name="reuseConfigFrom"
                value={formData.reuseConfigFrom}
                onChange={handleChange}
                label={t('projects.reuseConfig')}
              >
                <MenuItem value="">{t('projects.noReuse')}</MenuItem>
                {projects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={onClose}
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
            type="submit"
            variant="text"
            disabled={loading || !formData.name}
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 3,
              py: 1,
              height: '2rem',
              borderRadius: '0.75rem',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'background.hover',
              }
            }}
          >
            {loading ? <CircularProgress size={20} /> : t('home.createProject')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
